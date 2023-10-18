using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using Coronado.Web.Domain;

namespace Coronado.Web.Controllers
{
    public class InvoiceController : Controller
    {

        private readonly IConfiguration _config;
        private readonly CoronadoDbContext _context;

        public InvoiceController(IConfiguration config, CoronadoDbContext context)
        {
            _config = config;
            _context = context;
        }

        [Route("admin/invoices/GeneratePDF")]
        public async Task<IActionResult> GeneratePDF(Guid invoiceId)
        {
            var apiKey = _config.GetValue<string>("Html2PdfRocketKey");

            using var client = new HttpClient();
            var invoice = await _context.FindInvoiceEager(invoiceId).ConfigureAwait(false);
            var parms = new Dictionary<string, string>();
            parms.Add("apikey", apiKey);
            parms.Add("value", GetInvoiceHtml(invoice));
            var content = new FormUrlEncodedContent(parms);
            var result = await client.PostAsync("https://api.html2pdfrocket.com/pdf", content);
            if (result.IsSuccessStatusCode)
            {
                HttpContext.Response.Headers.Add("content-disposition", $"attachment; filename=Invoice {invoice.InvoiceNumber}.pdf");
                var stream = new MemoryStream(await result.Content.ReadAsByteArrayAsync());
                return new FileStreamResult(stream, "application/pdf");
            }

            throw new Exception("Error generating PDF");
        }

        private string GetInvoiceHtml(Invoice invoice)
        {
            var template = _context.Configurations.SingleOrDefault(c => c.Name == "InvoiceTemplate");
            if (template == null || string.IsNullOrWhiteSpace(template.Value))
            {
                throw new Exception("No invoice template found");
            }
            if (invoice == null) return template.Value;
            var value = template.Value
              .Replace("{{InvoiceNumber}}", invoice.InvoiceNumber)
              .Replace("{{Balance}}", invoice.Balance.ToString("C"))
              .Replace("{{CustomerName}}", invoice.Customer.Name)
              .Replace("{{CustomerAddress}}", StringExtensions
                .GetAddress(invoice.Customer.StreetAddress, invoice.Customer.City, invoice.Customer.Region).Replace("\n", "<br/>"))
              .Replace("{{InvoiceDate}}", invoice.Date.ToString("MMM dd, yyyy"))
              .Replace("{{DueDate}}", invoice.Date.AddDays(30).ToString("MMM dd, yyyy"));
            var lineItemTemplate = value.Substring(value.IndexOf("{{StartInvoiceLineItem}}"));
            lineItemTemplate = lineItemTemplate.Substring(0, lineItemTemplate.IndexOf("{{EndInvoiceLineItem}}")).Replace("{{StartInvoiceLineItem}}", "");
            var lineItemNumber = 0;
            var lineItemSection = "";
            foreach (var item in invoice.LineItems)
            {
                lineItemNumber++;
                var section = lineItemTemplate
                  .Replace("{{ItemNumber}}", lineItemNumber.ToString())
                  .Replace("{{Description}}", item.Description)
                  .Replace("{{Quantity}}", item.Quantity.ToString("n2"))
                  .Replace("{{UnitAmount}}", item.UnitAmount.ToString("n2"))
                  .Replace("{{ItemTotal}}", (item.Quantity * item.UnitAmount).ToString("n2"));
                lineItemSection += section;
            }

            var pos1 = value.IndexOf("{{StartInvoiceLineItem}}");
            var pos2 = value.IndexOf("{{EndInvoiceLineItem}}") + "{{EndInvoiceLineItem}}".Length;
            value = value.Remove(pos1, pos2 - pos1).Insert(pos1, lineItemSection);

            return value;
        }

        [Route("admin/invoices/GenerateHTML")]
        public async Task<IActionResult> GenerateHtml(Guid invoiceId)
        {
            var invoice = await _context.FindInvoiceEager(invoiceId).ConfigureAwait(false);
            var value = GetInvoiceHtml(invoice);
            var ms = new MemoryStream(Encoding.UTF8.GetBytes(value));
            return new FileStreamResult(ms, "text/html");
        }

        [HttpPost]
        public async Task<IActionResult> SendEmail(Guid invoiceId)
        {
            var invoice = await _context.FindInvoiceEager(invoiceId).ConfigureAwait(false); 
            await SendInvoice(invoice).ConfigureAwait(false);
            invoice.LastSentToCustomer = DateTime.Now;
            await _context.SaveChangesAsync().ConfigureAwait(false);

            return Ok(invoice);
        }

        private async Task SendInvoice(Invoice invoice)
        {

            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("kyle@baley.org", "Kyle Baley");
            var to = new EmailAddress(invoice.Customer.Email, invoice.Customer.Name);
            var subject = $"Invoice {invoice.InvoiceNumber} from Kyle Baley Consulting Ltd.";
            var cc = new EmailAddress("kyle@baley.org", "Kyle Baley");

            var htmlContent = $"Invoice {invoice.InvoiceNumber} for {invoice.Balance:C} from Kyle Baley Consulting Ltd is attached";
            var plainTextContent = htmlContent;
            var msg = new SendGridMessage
            {
                From = from,
                Subject = subject,
                PlainTextContent = plainTextContent,
                HtmlContent = htmlContent
            };
            msg.AddTo(to);
            msg.AddCc(cc);
            using (var webClient = new HttpClient())
            {
                var pdfApiKey = _config.GetValue<string>("Html2PdfRocketKey");
                var parms = new Dictionary<string, string>
                {
                    { "apikey", pdfApiKey }, { "value", GetInvoiceHtml(invoice) }
                };

                var content = new FormUrlEncodedContent(parms);
                var result = await webClient.PostAsync("https://api.html2pdfrocket.com/pdf", content).ConfigureAwait(false);
                if (result.IsSuccessStatusCode)
                {
                    var stream = new MemoryStream(await result.Content.ReadAsByteArrayAsync());
                    var file = Convert.ToBase64String(stream.ToArray());
                    msg.AddAttachment($"Invoice {invoice.InvoiceNumber}.pdf", file);
                }

            }
            await client.SendEmailAsync(msg).ConfigureAwait(false);
        }
    }
}

using System;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Coronado.Web.Controllers
{
    public class InvoiceController : Controller
    {

        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IConfiguration _config;
        private readonly IInvoiceRepository _invoiceRepo;
        private readonly ILogger _logger;
        private readonly ICustomerRepository _customerRepo;
        private readonly IConfigurationRepository _configRepo;

        public InvoiceController(IHostingEnvironment hostingEnvironment, IConfiguration config,
          IInvoiceRepository invoiceRepo, ILogger<InvoiceController> logger, ICustomerRepository customerRepo,
          IConfigurationRepository configRepo)
        {
            _hostingEnvironment = hostingEnvironment;
            _config = config;
            _invoiceRepo = invoiceRepo;
            _logger = logger;
            _customerRepo = customerRepo;
            _configRepo = configRepo;
        }

        public IActionResult GeneratePDF(Guid invoiceId)
        {
            var apiKey = _config.GetValue<string>("Html2PdfRocketKey");

            using (var client = new WebClient())
            {
                var invoice = _invoiceRepo.Get(invoiceId);
                var options = new NameValueCollection();
                options.Add("apikey", apiKey);
                options.Add("value", GetInvoiceHtml(invoice));

                var ms = new MemoryStream(client.UploadValues("http://api.html2pdfrocket.com/pdf", options));

                HttpContext.Response.Headers.Add("content-disposition", $"attachment; filename=Invoice {invoice.InvoiceNumber}.pdf");
                return new FileStreamResult(ms, "text/html");
            }
        }

        private string GetInvoiceHtml(InvoiceForPosting invoice)
        {
            var template = _configRepo.GetInvoiceTemplate();
            if (string.IsNullOrWhiteSpace(template)) {
                throw new Exception("No invoice template found");
            }
            if (invoice == null) return template;
            // var contentPath = _hostingEnvironment.WebRootPath;
            // var value = System.IO.File.ReadAllText(Path.Combine(contentPath, "InvoiceTemplate.html"))
            var value = template
              .Replace("{{InvoiceNumber}}", invoice.InvoiceNumber)
              .Replace("{{Balance}}", invoice.Balance.ToString("C"))
              .Replace("{{CustomerName}}", invoice.CustomerName)
              .Replace("{{CustomerAddress}}", StringExtensions.GetAddress(invoice.CustomerStreetAddress, invoice.CustomerCity, invoice.CustomerRegion).Replace("\n", "<br/>"))
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
        public IActionResult GenerateHtml(Guid invoiceId)
        {
            var invoice = _invoiceRepo.Get(invoiceId);
            var value = GetInvoiceHtml(invoice);
            var ms = new MemoryStream(Encoding.UTF8.GetBytes(value));
            return new FileStreamResult(ms, "text/html");
        }

        [HttpPost]
        public async Task<IActionResult> SendEmail(Guid invoiceId)
        {
            var invoice = _invoiceRepo.Get(invoiceId);
            await SendInvoice(invoice).ConfigureAwait(false);

            return Ok(invoice);
        }

        [HttpGet]
        public IActionResult Moo() {
            return Ok(new { Text = "moo"});
        }

        private async Task SendInvoice(InvoiceForPosting invoice)
        {

            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("kyle@baley.org", "Kyle Baley");
            var to = new EmailAddress(invoice.CustomerEmail, invoice.CustomerName);
            var subject = $"Invoice {invoice.InvoiceNumber} from Kyle Baley Consulting Ltd.";
            var cc = new EmailAddress("kyle@baley.org", "Kyle Baley");

            var htmlContent = $"Invoice {invoice.InvoiceNumber} for {invoice.Balance.ToString("C")} from Kyle Baley Consulting Ltd is attached";
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
            var attachment = new Attachment();
            using (var webClient = new WebClient())
            {
                var pdfApiKey = _config.GetValue<string>("Html2PdfRocketKey");
                var options = new NameValueCollection();
                options.Add("apikey", pdfApiKey);
                options.Add("value", GetInvoiceHtml(invoice));

                var attachmentContent = webClient.UploadValues("http://api.html2pdfrocket.com/pdf", options);
                var file = Convert.ToBase64String(attachmentContent);
                msg.AddAttachment($"Invoice {invoice.InvoiceNumber}.pdf", file);

            }
            var response = await client.SendEmailAsync(msg);
            await Task.Run(() => _invoiceRepo.RecordEmail(invoice, null)).ConfigureAwait(false);
        }
    }
}
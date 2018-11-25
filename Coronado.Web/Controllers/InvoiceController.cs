using System;
using System.Collections.Specialized;
using System.IO;
using System.Net;
using System.Text;
using Coronado.Web.Data;
using Coronado.Web.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Coronado.Web.Controllers
{
  public class InvoiceController : Controller
  {

    private readonly IHostingEnvironment _hostingEnvironment;
    private readonly IConfiguration _config;
    private readonly IInvoiceRepository _invoiceRepo;
    private readonly ILogger _logger;

    public InvoiceController(IHostingEnvironment hostingEnvironment, IConfiguration config,
      IInvoiceRepository invoiceRepo, ILogger<InvoiceController> logger)
    {
      _hostingEnvironment = hostingEnvironment;
      _config = config;
      _invoiceRepo = invoiceRepo;
      _logger = logger;
    }

    public IActionResult GeneratePDF(Guid invoiceId)
    {
      var apiKey = _config.GetValue<string>("Html2PdfRocketKey");

      using (var client = new WebClient())
      {
        var options = new NameValueCollection();
        options.Add("apikey", apiKey);
        options.Add("value", GetInvoiceHtml(_invoiceRepo.Get(invoiceId)));

        var ms = new MemoryStream(client.UploadValues("http://api.html2pdfrocket.com/pdf", options));

        HttpContext.Response.Headers.Add("content-disposition", "attachment; filename=moo.pdf");
        return new FileStreamResult(ms, "text/html");
      }
    }

    private string GetInvoiceHtml(InvoiceForPosting invoice)
    {
      var contentPath = _hostingEnvironment.WebRootPath;
      var value = System.IO.File.ReadAllText(Path.Combine(contentPath, "InvoiceTemplate.html"))
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
  }
}
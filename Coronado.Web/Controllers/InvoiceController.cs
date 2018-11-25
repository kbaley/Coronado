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

namespace Coronado.Web.Controllers
{
  public class InvoiceController : Controller
  {

    private readonly IHostingEnvironment _hostingEnvironment;
    private readonly IConfiguration _config;
    private readonly IInvoiceRepository _invoiceRepo;

    public InvoiceController(IHostingEnvironment hostingEnvironment, IConfiguration config, IInvoiceRepository invoiceRepo)
    {
      _hostingEnvironment = hostingEnvironment;
      _config = config;
      _invoiceRepo = invoiceRepo;
    }

    public IActionResult GeneratePDF(Guid invoiceId)
    {
      var apiKey = _config.GetValue<string>("Html2PdfRocketKey");
      var contentPath = _hostingEnvironment.WebRootPath;
      var value = System.IO.File.ReadAllText(Path.Combine(contentPath, "InvoiceTemplate.html"));

      using (var client = new WebClient())
      {
        var options = new NameValueCollection();
        options.Add("apikey", apiKey);
        options.Add("value", value);

        var ms = new MemoryStream(client.UploadValues("http://api.html2pdfrocket.com/pdf", options));

        HttpContext.Response.Headers.Add("content-disposition", "attachment; filename=moo.pdf");
        return new FileStreamResult(ms, "text/html");

      }

    }

    private string GetInvoiceHtml(InvoiceForPosting invoice) {

      var contentPath = _hostingEnvironment.WebRootPath;
      var value = System.IO.File.ReadAllText(Path.Combine(contentPath, "InvoiceTemplate.html"))
        .Replace("{{InvoiceNumber}}", invoice.InvoiceNumber)
        .Replace("{{Balance}}", invoice.Balance.ToString("C"))
        .Replace("{{CustomerName}}", invoice.CustomerName)
        .Replace("{{CustomerAddress}}", StringExtensions.GetAddress(invoice.CustomerStreetAddress, invoice.CustomerCity, invoice.CustomerRegion).Replace("\n", "<br/>"))
        .Replace("{{InvoiceDate}}", invoice.Date.ToString("MMM dd, yyyy"))
        .Replace("{{DueDate}}", invoice.Date.AddDays(30).ToString("MMM dd, yyyy"));

      return value;
    }
    public IActionResult GenerateHtml(Guid invoiceId)
    {
      var invoice = _invoiceRepo.Get(invoiceId);
      var apiKey = _config.GetValue<string>("Html2PdfRocketKey");
      var value = GetInvoiceHtml(invoice);

      using (var client = new WebClient())
      {
        var options = new NameValueCollection();
        options.Add("apikey", apiKey);
        options.Add("value", value);

        var ms = new MemoryStream(Encoding.UTF8.GetBytes(value));

        return new FileStreamResult(ms, "text/html");
      }
    }
  }
}
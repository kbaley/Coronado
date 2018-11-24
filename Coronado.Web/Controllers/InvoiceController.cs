using System;
using System.Collections.Specialized;
using System.IO;
using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Coronado.Web.Controllers {
  public class InvoiceController : Controller {

    private readonly IHostingEnvironment _hostingEnvironment;
    private readonly IConfiguration _config;

    public InvoiceController(IHostingEnvironment hostingEnvironment, IConfiguration config) {
      _hostingEnvironment = hostingEnvironment;
      _config = config;
    }

    public IActionResult GeneratePDF(Guid invoiceId)
    {
      var apiKey = _config.GetValue<string>("Html2PdfRocketKey");
      var contentPath = _hostingEnvironment.WebRootPath;
      var value = System.IO.File.ReadAllText(Path.Combine(contentPath, "InvoiceTemplate.html"));

      using (var client = new WebClient()) {
        var options = new NameValueCollection();
        options.Add("apikey", apiKey);
        options.Add("value", value);

        var ms = new MemoryStream(client.UploadValues("http://api.html2pdfrocket.com/pdf", options));

        HttpContext.Response.Headers.Add("content-disposition", "attachment; filename=moo.pdf");
        return new FileStreamResult(ms, "application/pdf");

      }
    }
  }
}
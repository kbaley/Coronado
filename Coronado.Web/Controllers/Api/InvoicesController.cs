using System;
using System.Collections.Generic;
using System.Linq;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Coronado.Web.Models;
using Microsoft.AspNetCore.Authorization;
using System.IO;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly CoronadoDbContext _context;
        private readonly IInvoiceRepository _invoiceRepo;

        public InvoicesController(CoronadoDbContext context, IInvoiceRepository invoiceRepo)
        {
            _context = context;
            _invoiceRepo = invoiceRepo;
        }

        [HttpGet]
        public IEnumerable<InvoiceForPosting> GetInvoices([FromQuery] UrlQuery query )
        {
            var invoices = _invoiceRepo.GetAll();
            return invoices;
        }

        [HttpGet("{id}")]
        public InvoiceForPosting GetInvoice([FromRoute] Guid id) {
            return _invoiceRepo.Get(id);
        }

        [HttpPut("{id}")]
        public IActionResult Put([FromRoute] Guid id, [FromBody] InvoiceForPosting invoice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != invoice.InvoiceId)
            {
                return BadRequest();
            }

            _invoiceRepo.Update(invoice);
            invoice = _invoiceRepo.Get(invoice.InvoiceId);

            return Ok(invoice);
        }

        [HttpPost]
        public IActionResult Post([FromBody] InvoiceForPosting invoice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (invoice.InvoiceId == null || invoice.InvoiceId == Guid.Empty) invoice.InvoiceId = Guid.NewGuid();
            _invoiceRepo.Insert(invoice);
            invoice = _invoiceRepo.Get(invoice.InvoiceId);

            return CreatedAtAction("PostInvoice", new { id = invoice.InvoiceId }, invoice);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var invoice = _invoiceRepo.Delete(id);
            if (invoice == null)
            {
                return NotFound();
            }

            return Ok(invoice);
        }
        
        [HttpGet]
        [Route("[action]")]
        // [AllowAnonymous]
        public IActionResult ResolveInvoices() {
            // Used to fix an issue with invoices where making a payment would set the current balance
            // of all invoices to whatever the balance of the update invoice was
            _invoiceRepo.UpdateBalances();
            return Ok();
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult UploadTemplate([FromForm] UploadTemplateViewModel model)
        {
            var file = model.File;
            if (file.Length > 0) {

                using (var reader = new StreamReader(file.OpenReadStream()))
                {
                    var template = reader.ReadToEnd();
                    var config = _context.Configurations.SingleOrDefault(c => c.Name == "InvoiceTemplate");
                    if (config == null) {
                        config = new Configuration {
                            ConfigurationId = Guid.NewGuid(),
                            Name = "InvoiceTemplate",
                            Value = template
                        };
                        _context.Configurations.Add(config);
                    } else {
                        config.Value = template;
                    }
                    _context.SaveChanges();
                }
            }
            return Ok(new { Status = "Uploaded successfully" } );
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Coronado.Web.Models;

namespace Coronado.Web.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly IInvoiceRepository _invoiceRepo;

        public InvoicesController(ApplicationDbContext context, IInvoiceRepository invoiceRepo)
        {
            _invoiceRepo = invoiceRepo;
        }

        [HttpGet]
        public IEnumerable<InvoiceForPosting> GetInvoice([FromQuery] UrlQuery query )
        {
            return _invoiceRepo.GetAll();
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
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.IO;
using AutoMapper;
using Coronado.Web.Controllers.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly CoronadoDbContext _context;
        private readonly IInvoiceRepository _invoiceRepo;
        private readonly IMapper _mapper;

        public InvoicesController(CoronadoDbContext context, IInvoiceRepository invoiceRepo, IMapper mapper)
        {
            _context = context;
            _invoiceRepo = invoiceRepo;
            _mapper = mapper;
        }

        [HttpGet]
        public IEnumerable<InvoiceForPosting> GetInvoices()
        {
            var invoices = _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.LineItems)
                .ToArray();
            return _mapper.Map<Invoice[], IEnumerable<InvoiceForPosting>>(invoices);
        }

        [HttpGet("{id}")]
        public InvoiceForPosting GetInvoice([FromRoute] Guid id) {
            return _invoiceRepo.Get(id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put([FromRoute] Guid id, [FromBody] InvoiceForPosting invoice)
        {
            var newBalance = invoice.GetLineItemTotal() - _context.Transactions.GetPaymentsFor(id);
            invoice.Balance = newBalance;
            var invoiceMapped = _mapper.Map<Invoice>(invoice);
            _context.Entry(invoiceMapped).State = EntityState.Modified;

            foreach (var item in invoice.LineItems)
            {
                var mappedLineItem = _mapper.Map<InvoiceLineItem>(item);
                switch (item.Status.ToLower()) {
                    case "deleted":
                        await _context.InvoiceLineItems.RemoveById(item.InvoiceLineItemId).ConfigureAwait(false);
                        break;
                    case "added":
                        _context.InvoiceLineItems.Add(mappedLineItem);
                        break;
                    case "updated":
                        _context.Entry(mappedLineItem).State = EntityState.Modified;
                        break;
                }
            }

            await _context.SaveChangesAsync().ConfigureAwait(false);
            await _context.Entry(invoiceMapped).Reference(i => i.Customer).LoadAsync().ConfigureAwait(false);
            invoice = _mapper.Map<InvoiceForPosting>(invoiceMapped);

            return Ok(invoice);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] InvoiceForPosting invoice)
        {
            
            if (invoice.InvoiceId == null || invoice.InvoiceId == Guid.Empty) invoice.InvoiceId = Guid.NewGuid();
            invoice.Balance = invoice.GetLineItemTotal();
            var invoiceMapped = _mapper.Map<Invoice>(invoice);
            _context.Invoices.Add(invoiceMapped);
            await _context.SaveChangesAsync();

            return CreatedAtAction("PostInvoice", new { id = invoice.InvoiceId }, invoice);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) {
                return NotFound();
            }
            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();
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

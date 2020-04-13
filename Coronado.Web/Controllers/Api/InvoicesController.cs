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
            var payments = _context.Transactions
                .Where(t => t.InvoiceId == invoice.InvoiceId)
                .Sum(t => t.Amount);
            var newBalance = invoice.LineItems.Sum(i => i.Quantity * i.UnitAmount) - payments;
            invoice.Balance = newBalance;
            var invoiceMapped = _mapper.Map<Invoice>(invoice);

            var existingInvoice = await _context.Invoices
                .Where(i => i.InvoiceId == id)
                .Include(i => i.LineItems)
                .SingleOrDefaultAsync().ConfigureAwait(false);
            
            if (existingInvoice != null) {
                _context.Entry(existingInvoice).CurrentValues.SetValues(invoice);

                foreach (var existingLineItem in existingInvoice.LineItems.ToList())
                {
                    if (invoice.LineItems.All(li => li.InvoiceLineItemId != existingLineItem.InvoiceLineItemId)) {
                        _context.InvoiceLineItems.Remove(existingLineItem);
                    }    
                }

                var newLineItems = new List<InvoiceLineItem>();
                foreach (var lineItemDto in invoice.LineItems)
                {
                    var existingLineItem = existingInvoice.LineItems
                        .SingleOrDefault(li => li.InvoiceLineItemId == lineItemDto.InvoiceLineItemId);
                    if (existingLineItem != null) {
                        _context.Entry(existingLineItem).CurrentValues.SetValues(lineItemDto);
                    } else {
                        var mappedLineItem = _mapper.Map<InvoiceLineItem>(lineItemDto);
                        newLineItems.Add(mappedLineItem);
                    }
                }
                foreach (var lineItem in newLineItems)
                {
                    existingInvoice.LineItems.Add(lineItem);
                }
            }

            await _context.SaveChangesAsync().ConfigureAwait(false);

            return Ok(invoice);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] InvoiceForPosting invoice)
        {
            
            if (invoice.InvoiceId == null || invoice.InvoiceId == Guid.Empty) invoice.InvoiceId = Guid.NewGuid();
            invoice.Balance = invoice.LineItems.Sum(li => li.Quantity * li.UnitAmount);
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

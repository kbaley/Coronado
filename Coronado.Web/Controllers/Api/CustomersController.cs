using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Coronado.Web.Models;
using Microsoft.AspNetCore.Authorization;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly CoronadoDbContext _context;

        public CustomersController(CoronadoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Customer> GetCustomer()
        {
            return _context.Customers;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer([FromRoute] Guid id, [FromBody] Customer customer)
        {
            _context.Entry(customer).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(customer);
        }

        [HttpPost]
        public async Task<IActionResult> PostCustomer([FromBody] Customer customer)
        {
            if (customer.CustomerId == null || customer.CustomerId == Guid.Empty) customer.CustomerId = Guid.NewGuid();
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync().ConfigureAwait(false);

            return CreatedAtAction("PostCustomer", new { id = customer.CustomerId }, customer);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer([FromRoute] Guid id)
        {
            var customer = await _context.Customers.FindAsync(id).ConfigureAwait(false);
            if (customer == null) {
                return NotFound();
            }
            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync().ConfigureAwait(false);
            return Ok(customer);
        }
    }
}

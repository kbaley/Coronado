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
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerRepository _customerRepo;

        public CustomersController(ApplicationDbContext context, ICustomerRepository customerRepo)
        {
            _customerRepo = customerRepo;
        }

        [HttpGet]
        public IEnumerable<Customer> GetCustomer([FromQuery] UrlQuery query )
        {
            return _customerRepo.GetAll();
        }

        [HttpPut("{id}")]
        public IActionResult PutCustomer([FromRoute] Guid id, [FromBody] Customer customer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != customer.CustomerId)
            {
                return BadRequest();
            }

            _customerRepo.Update(customer);

            return Ok(customer);
        }

        [HttpPost]
        public IActionResult PostCustomer([FromBody] Customer customer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (customer.CustomerId == null || customer.CustomerId == Guid.Empty) customer.CustomerId = Guid.NewGuid();
            _customerRepo.Insert(customer);

            return CreatedAtAction("PostCustomer", new { id = customer.CustomerId }, customer);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCustomer([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var customer = _customerRepo.Delete(id);
            if (customer == null)
            {
                return NotFound();
            }

            return Ok(customer);
        }
    }
}
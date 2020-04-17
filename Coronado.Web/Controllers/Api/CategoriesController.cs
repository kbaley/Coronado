using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly CoronadoDbContext _context;

        public CategoriesController(CoronadoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Category> GetCategory([FromQuery] UrlQuery query )
        {
            return _context.Categories;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory([FromRoute] Guid id, [FromBody] Category category)
        {
            _context.Entry(category).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> PostCategory([FromBody] Category category)
        {
            if (category.CategoryId == null || category.CategoryId == Guid.Empty) category.CategoryId = Guid.NewGuid();
            _context.Categories.Add(category);
            await _context.SaveChangesAsync().ConfigureAwait(false);

            return CreatedAtAction("PostCategory", new { id = category.CategoryId }, category);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory([FromRoute] Guid id)
        {
            var category = await _context.Categories.FindAsync(id).ConfigureAwait(false);
            if (category == null) {
                return NotFound();
            }
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync().ConfigureAwait(false);
            return Ok(category);
        }
    }
}

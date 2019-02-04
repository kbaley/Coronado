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
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepo;

        public CategoriesController(ApplicationDbContext context, ICategoryRepository categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }

        [HttpGet]
        public IEnumerable<Category> GetCategory([FromQuery] UrlQuery query )
        {
            return _categoryRepo.GetAll();
        }

        [HttpPut("{id}")]
        public IActionResult PutCategory([FromRoute] Guid id, [FromBody] Category category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != category.CategoryId)
            {
                return BadRequest();
            }

            _categoryRepo.Update(category);

            return Ok(category);
        }

        [HttpPost]
        public IActionResult PostCategory([FromBody] Category category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (category.CategoryId == null || category.CategoryId == Guid.Empty) category.CategoryId = Guid.NewGuid();
            _categoryRepo.Insert(category);

            return CreatedAtAction("PostCategory", new { id = category.CategoryId }, category);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCategory([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var category = _categoryRepo.Delete(id);
            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }
    }
}
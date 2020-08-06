using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Coronado.Web.Controllers.Dtos;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InvestmentCategoriesController : ControllerBase
    {
        private readonly CoronadoDbContext _context;
        private readonly IMapper _mapper;

        public InvestmentCategoriesController(CoronadoDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IEnumerable<InvestmentCategory> GetCategories()
        {
            return _context.InvestmentCategories.OrderBy(c => c.Name);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateCategories([FromBody] InvestmentCategoryForUpdate[] categories)
        {
            // Update any investments that refer to a deleted category to remove the reference to the category
            foreach (var investment in _context.Investments)
            {
                if (categories.Any(c => c.Status.Equals("deleted", StringComparison.InvariantCultureIgnoreCase)
                    && investment.CategoryId == c.InvestmentCategoryId))
                {
                    investment.CategoryId = null;
                    investment.Category = null;
                }
            }

            // now update the categories
            foreach (var category in categories)
            {
                var mappedCategory = _mapper.Map<InvestmentCategory>(category);
                switch (category.Status.ToLower())
                {
                    case "updated":
                        _context.Entry(mappedCategory).State = EntityState.Modified;
                        break;
                    case "deleted":
                        await _context.InvestmentCategories.RemoveByIdAsync(category.InvestmentCategoryId).ConfigureAwait(false);
                        break;
                    case "added":
                        await _context.InvestmentCategories.AddAsync(mappedCategory).ConfigureAwait(false);
                        break;

                }
            }
            await _context.SaveChangesAsync().ConfigureAwait(false);

            return Ok(_context.InvestmentCategories);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Coronado.Web.Models;
using HtmlAgilityPack;

namespace Coronado.Web.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvestmentsController : ControllerBase
    {
        private readonly IInvestmentRepository _investmentRepo;

        public InvestmentsController(ApplicationDbContext context, IInvestmentRepository investmentRepo)
        {
            _investmentRepo = investmentRepo;
        }

        [HttpGet]
        public IEnumerable<Investment> GetInvestments([FromQuery] UrlQuery query)
        {
            var investments = _investmentRepo.GetAll();
            foreach (var investment in investments)
            {
                if (investment.LastRetrieved < DateTime.Today && !string.IsNullOrWhiteSpace(investment.Symbol)) {
                    var html = $"https://www.theglobeandmail.com/investing/markets/funds/{investment.Symbol}.CF/performance/";
                    var web = new HtmlWeb();
                    var htmlDoc = web.Load(html);
                    var node = htmlDoc.DocumentNode.SelectSingleNode("//barchart-field[@name='lastPrice']");
                    if (node != null && node.Attributes["value"] != null) {
                        investment.Price = decimal.Parse(node.Attributes["value"].Value);
                        investment.LastRetrieved = DateTime.Today;
                        _investmentRepo.Update(investment);
                    }
                }
            }

            return investments.OrderBy(i => i.Name);
        }

        [HttpPut("{id}")]
        public IActionResult PutInvestment([FromRoute] Guid id, [FromBody] Investment investment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != investment.InvestmentId)
            {
                return BadRequest();
            }

            _investmentRepo.Update(investment);

            return Ok(investment);
        }

        [HttpPost]
        public IActionResult PostInvestment([FromBody] Investment investment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (investment.InvestmentId == null || investment.InvestmentId == Guid.Empty) investment.InvestmentId = Guid.NewGuid();
            _investmentRepo.Insert(investment);

            return CreatedAtAction("PostInvestment", new { id = investment.InvestmentId }, investment);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var investment = _investmentRepo.Delete(id);
            if (investment == null)
            {
                return NotFound();
            }

            return Ok(investment);
        }
    }
}
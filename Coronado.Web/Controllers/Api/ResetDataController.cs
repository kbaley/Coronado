using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Coronado.Web.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResetDataController : ControllerBase
    {
        private ApplicationDbContext _context;

        public ResetDataController(ApplicationDbContext context) {
            _context = context;
        }

        [HttpGet]
        public void ResetData( )
        {
            _context.Database.ExecuteSqlCommand("UPDATE transactions SET related_transaction_id = null");
            _context.Database.ExecuteSqlCommand("TRUNCATE TABLE transactions");
            _context.Database.ExecuteSqlCommand("TRUNCATE TABLE accounts CASCADE");
            _context.Database.ExecuteSqlCommand("TRUNCATE TABLE categories CASCADE");

        }

    }
}
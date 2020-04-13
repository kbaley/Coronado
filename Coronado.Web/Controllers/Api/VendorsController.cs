using System.Collections.Generic;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class VendorsController : ControllerBase
    {
        private readonly CoronadoDbContext _context;

        public VendorsController(CoronadoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Vendor> GetVendors()
        {
            return _context.Vendors;
        }
    }

    public class THETHING
    {

    }
}

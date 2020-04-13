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
        public VendorsController(CoronadoDbContext context)
        {
        }

        [HttpGet]
        public IEnumerable<Vendor> GetVendors()
        {
            return null;
            // return _context.Vendors;
        }
    }

    public class THETHING
    {

    }
}

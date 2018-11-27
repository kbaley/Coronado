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
    public class VendorsController : ControllerBase
    {
        private readonly IVendorRepository _vendorRepo;

        public VendorsController(IVendorRepository vendorRepo)
        {
            _vendorRepo = vendorRepo;
        }

        [HttpGet]
        public IEnumerable<Vendor> GetVendors( )
        {
            return _vendorRepo.GetAll();
        }
    }
}
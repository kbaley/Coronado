using System.Collections.Generic;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;

namespace Coronado.Web.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountTypesController : ControllerBase
    {

        [HttpGet]
        public IEnumerable<string> GetAccountTypes( )
        {
            return AccountType.GetAccountTypes();
        }
    }
}

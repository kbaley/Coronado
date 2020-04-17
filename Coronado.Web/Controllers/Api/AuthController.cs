using System;
using System.Linq;
using Coronado.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Coronado.Web.Controllers.Dtos;
using CryptoHelper;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Logging;

namespace Coronado.Web.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<AuthController> _logger;
        private readonly CoronadoDbContext _context;
        const int NUM_ITERATIONS = 10_000;

        public AuthController(ILogger<AuthController> logger, CoronadoDbContext context, IConfiguration config)
        {
            _logger = logger;
            _context = context;
            _config = config;
        }

        [HttpGet]
        [Route("[action]")]
        public string GetPassword(string password) {
            return Crypto.HashPassword(password);
        }

        [HttpPost]
        [Route("[action]")]
        public ActionResult<AuthData> Login([FromBody] LoginViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = _context.Users
                .SingleOrDefault(u => u.Email == model.Email);

            if (user == null) {
                return BadRequest(new { email = "No user found"});
            }

            var validPassword = Crypto.VerifyHashedPassword(user.Password, model.Password);
            if (!validPassword) {
                return BadRequest(new { password = "Invalid password" } );
            }

            var jwtExpiry = _config.GetValue<int>("JwtLifespan");
            var jwtSecret = _config.GetValue<string>("JwtSecretKey");
            var expiration = DateTime.UtcNow.AddSeconds(jwtExpiry);

            var tokenDescriptor = new SecurityTokenDescriptor{
                Subject = new ClaimsIdentity(new[] {
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = expiration,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));

            return new AuthData{
                Token = token,
                TokenExpirationTime = ((DateTimeOffset)expiration).ToUnixTimeSeconds(),
                Id = user.Email
            };

        }

    }
}

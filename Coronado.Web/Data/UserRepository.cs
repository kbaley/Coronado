using Microsoft.Extensions.Configuration;
using Coronado.Web.Domain;
using Dapper;

namespace Coronado.Web.Data
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(IConfiguration config) : base(config) { }

        public User GetByEmail(string email)
        {
            using (var conn = Connection) {
                return conn.QuerySingleOrDefault<User>(
@"SELECT *
FROM users u
WHERE email=@email", new {email}
);
            }
        }
    }
}

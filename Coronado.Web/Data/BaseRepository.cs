using System.Data;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Coronado.Web.Data
{
    public abstract class BaseRepository
    {
        internal readonly string _connectionString;
        internal IConfiguration _config;

        public BaseRepository(IConfiguration config)
        {
            _config = config;    
#if DEBUG
            _connectionString = config.GetConnectionString("localConnection");
#else
            _connectionString = config.GetConnectionString("defaultConnection");
#endif
            Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
        }
        internal IDbConnection Connection
        {
            get
            {
                return new NpgsqlConnection(_connectionString);
            }
        }

    }
}

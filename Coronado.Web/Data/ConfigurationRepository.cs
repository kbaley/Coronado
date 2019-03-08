using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Dapper;

namespace Coronado.Web.Data
{
    public class ConfigurationRepository : BaseRepository, IConfigurationRepository
    {
        public ConfigurationRepository(IConfiguration config) : base(config) { }

        public string GetInvoiceTemplate()
        {
            using (var conn = Connection) {
                return conn.ExecuteScalar<string>("SELECT value FROM configuration WHERE name='InvoiceTemplate'");
            }
        }

        public void UpdateInvoiceTemplate(string template) {
            InsertOrUpdate("InvoiceTemplate", template);
        }

        private void InsertOrUpdate(string name, string value) {
            using (var conn = Connection) {
                var existingValue = conn.ExecuteScalar<string>($"SELECT value FROM configuration WHERE name='{name}'");
                if (existingValue == null) {
                    conn.Execute("INSERT INTO configuration (configuration_id, name, value) VALUES (@Id, @Name, @Value)", 
                    new { Id = System.Guid.NewGuid(), Name = name, Value = value});
                } else {
                    conn.Execute("UPDATE configuration SET value = @Value WHERE name = @Name", 
                    new { Name = name, Value = value});
                }
            } 
        }
    }
}

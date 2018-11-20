using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Coronado.Web.Models;
using Microsoft.Extensions.Configuration;
using Npgsql;
using Dapper;

namespace Coronado.Web.Data
{
  public class InvoiceRepository : IInvoiceRepository
  {
    private readonly IConfiguration _config;
    private readonly string _connectionString;
    public InvoiceRepository(IConfiguration config)
    {
      _config = config;
      _connectionString = config.GetConnectionString("DefaultConnection");
      Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
    }

    internal IDbConnection Connection
    {
      get
      {
        return new NpgsqlConnection(_connectionString);
      }
    }

    public IEnumerable<InvoiceForPosting> GetAll()
    {
      using (var conn = Connection)
      {
        return conn.Query<InvoiceForPosting>(@"SELECT i.*, c.name as customer_name,
        (SELECT sum(ili.quantity * ili.unit_amount) FROM invoice_line_items ili WHERE ili.invoice_id = i.invoice_id) as balance
        FROM invoices i inner join customers c on i.customer_id = c.customer_id");
      }
    }

    public InvoiceForPosting Delete(Guid invoiceId)
    {
      using (var conn = Connection)
      {
        conn.Open();
        using (var trx = conn.BeginTransaction())
        {
          try
          {
            var invoice = GetAll().Single(i => i.InvoiceId == invoiceId);
            conn.Execute("DELETE FROM invoice_line_items WHERE invoice_id = @invoiceId", new {invoiceId}, trx);
            conn.Execute("DELETE FROM invoices WHERE invoice_id = @invoiceId", new {invoiceId}, trx);
            return invoice;
          }
          catch (System.Exception)
          {
            trx.Rollback();
            conn.Close();
            throw;
          }
          finally {
            trx.Commit();
            conn.Close();
          }
        }
      }
    }

    public void Insert(InvoiceForPosting invoice)
    {
      invoice.InvoiceId = invoice.InvoiceId.GetId();

      using (var conn = Connection)
      {
        conn.Open();
        using (var trx = conn.BeginTransaction())
        {

          try
          {
            conn.Execute(
              @"INSERT INTO invoices (invoice_id, date, customer_id, invoice_number) VALUES
             (@InvoiceId, @Date, @CustomerId, @InvoiceNumber)", invoice, trx);
            foreach (var item in invoice.LineItems)
            {
              item.LineItemId = item.LineItemId.GetId();
              conn.Execute(
                @"INSERT INTO invoice_line_items (invoice_line_item_id, invoice_id, quantity, unit_amount, description) VALUES
               (@InvoiceLineItemId, @InvoiceId, @Quantity, @UnitAmount, @Description)",
                  new
                  {
                    InvoiceLineItemId = item.LineItemId,
                    InvoiceId = invoice.InvoiceId,
                    Quantity = item.Quantity,
                    UnitAmount = item.UnitAmount,
                    Description = item.Description
                  }
                 , trx
              );
            }
            trx.Commit();
            conn.Close();
          }
          catch
          {
            trx.Rollback();
            conn.Close();
            throw;
          }
        }
      }
    }

    public void Update(InvoiceForPosting invoice)
    {
      throw new NotImplementedException();
    }
  }
}

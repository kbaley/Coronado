using System;
using System.Collections.Generic;
using System.Data;
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

    public InvoiceForPosting Delete(Guid customerId)
    {
      throw new NotImplementedException();
    }

    public IEnumerable<InvoiceForPosting> GetAll()
    {
      throw new NotImplementedException();
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
          }
          catch (Exception e)
          {
            trx.Rollback();
            conn.Close();
            throw e;
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

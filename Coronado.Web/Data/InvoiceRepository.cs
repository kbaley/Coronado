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
        var invoiceDictionary = new Dictionary<Guid, InvoiceForPosting>();
        var invoices = conn.Query<InvoiceForPosting, InvoiceLineItemsForPosting, InvoiceForPosting>(
        @"SELECT i.*, c.name as customer_name, c.street_address as customer_street_address, c.city as customer_city, c.region as customer_region,
          c.email as customer_email, ili.invoice_id, ili.invoice_line_item_id as line_item_id, ili.quantity, ili.unit_amount, ili.description
        FROM invoices i inner join customers c on i.customer_id = c.customer_id
        INNER JOIN invoice_line_items as ili ON i.invoice_id = ili.invoice_id",
        (invoice, lineItem) => {
          InvoiceForPosting invoiceEntry;
          if (!invoiceDictionary.TryGetValue(invoice.InvoiceId, out invoiceEntry))
          {
            invoiceEntry = invoice;
            invoiceEntry.LineItems = new List<InvoiceLineItemsForPosting>();
            invoiceDictionary.Add(invoiceEntry.InvoiceId, invoiceEntry);
          }

          invoiceEntry.LineItems.Add(lineItem);
          return invoiceEntry;
        },
        splitOn: "invoice_id")
        .Distinct();
        return invoices;
      }
    }

    public InvoiceForPosting Get(Guid invoiceId) {
      var invoice = GetAll().SingleOrDefault(i => i.InvoiceId == invoiceId);
      if (invoice != null) {
        using (var conn = Connection) {
          invoice.LineItems = conn.Query<InvoiceLineItemsForPosting>(@"SELECT * from invoice_line_items
          WHERE invoice_id = @InvoiceId", new {invoiceId}).ToList();
        }
      }

      return invoice;
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
            var balance = invoice.LineItems.Sum(li => li.Quantity * li.UnitAmount);
            conn.Execute(
              @"INSERT INTO invoices (invoice_id, date, customer_id, invoice_number, balance) VALUES
              (@InvoiceId, @Date, @CustomerId, @InvoiceNumber, @Balance)", 
              new {
                InvoiceId = invoice.InvoiceId,
                Date = invoice.Date,
                CustomerId = invoice.CustomerId,
                InvoiceNumber = invoice.InvoiceNumber,
                Balance = balance
              }, trx);
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
      using (var conn = Connection) {
        conn.Open();
        using (var trx = conn.BeginTransaction()) {
          try
          {
            var existingLineItems = conn.Query<InvoiceLineItemsForPosting>(
              @"SELECT invoice_line_item_id as line_item_id, quantity, unit_amount, description FROM invoice_line_items
            WHERE invoice_id = @InvoiceId", new {InvoiceId = invoice.InvoiceId});
            var oldBalance = existingLineItems.Sum(li => (li.Quantity * li.UnitAmount));
            var newBalance = invoice.LineItems.Sum(li => li.Quantity * li.UnitAmount);
            var newLineItems = invoice.LineItems.Where(li => existingLineItems.All(li2 => li2.LineItemId != li.LineItemId));
            var removedLineItems = existingLineItems.Where(li => invoice.LineItems.All(li2 => li2.LineItemId != li.LineItemId));
            var updatedLineItems = invoice.LineItems.Where(li => existingLineItems.Any(li2 => li2.LineItemId == li.LineItemId));
            foreach (var item in newLineItems)
            {
              conn.Execute(@"INSERT INTO invoice_line_items (invoice_line_item_id, invoice_id, quantity, unit_amount, description)
              VALUES (@InvoiceLineItemId, @InvoiceId, @Quantity, @UnitAmount, @Description)", 
              new {InvoiceLineItemId = Guid.NewGuid(), InvoiceId = invoice.InvoiceId, Quantity = item.Quantity, 
                UnitAmount = item.UnitAmount, Description = item.Description}, trx);
            }
            foreach (var item in removedLineItems)
            {
              conn.Execute(@"DELETE FROM invoice_line_items WHERE invoice_line_item_id=@InvoiceLineItemId", 
              new {InvoiceLineItemId = item.LineItemId}, trx);
            }
            foreach (var item in updatedLineItems)
            {
                conn.Execute(@"UPDATE invoice_line_items
                SET quantity = @Quantity, unit_amount = @UnitAmount, description = @Description
                WHERE invoice_line_item_id = @LineItemId", item, trx);
            }

            conn.Execute(@"UPDATE invoices
            SET date = @Date, customer_id = @CustomerId, invoice_number = @InvoiceNumber, balance = balance - " + oldBalance + " + " + newBalance,
            invoice, trx);

             trx.Commit(); 
          }
          catch 
          {
            trx.Rollback();
            throw;
          }
          finally
          {
            conn.Close();              
          }
        }
      }
    }
  }
}

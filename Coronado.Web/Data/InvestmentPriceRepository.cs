using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Dapper;
using Coronado.Web.Domain;

namespace Coronado.Web.Data
{
  public class InvestmentPriceRepository : BaseRepository, IInvestmentPriceRepository
    {
        public InvestmentPriceRepository(IConfiguration config) : base(config) { }

        public InvestmentPrice Delete(Guid investmentPriceId)
        {
            using (var conn = Connection) {
                var investmentPrice = conn.QuerySingle<InvestmentPrice>("SELECT * FROM investment_prices WHERE investment_price_id=@investmentPriceId", new {investmentPriceId});
                conn.Execute("DELETE FROM investment_prices WHERE investment_price_id=@investmentPriceId", new {investmentPriceId});
                return investmentPrice;
            }    
        }

        public void Insert(InvestmentPrice investmentPrice)
        {
            using (var conn = Connection) {
                conn.Execute(
@"INSERT INTO investment_prices (investment_price_id, investment_id, date, price)
VALUES (@InvestmentPriceId, @InvestmentId, @Date, @Price)", investmentPrice); 
            }
        }
    }
}

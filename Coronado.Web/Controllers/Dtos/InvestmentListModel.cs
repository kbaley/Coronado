using System.Collections.Generic;

namespace Coronado.Web.Controllers.Dtos
{
    public class InvestmentListModel
    {
        public IEnumerable<InvestmentForListDto> Investments { get; set; }
        public double PortfolioIrr { get; set; }
    }
}

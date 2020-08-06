using System;

namespace Coronado.Web.Controllers.Dtos
{
    public class InvestmentCategoryForUpdate
    {
        public InvestmentCategoryForUpdate()
        {
            Status = "Unchanged";
        }
        public string Status { get; set; }
        public Guid InvestmentCategoryId { get; set; }
        public string Name { get; set; }
        public decimal Percentage { get; set; }
    }
}

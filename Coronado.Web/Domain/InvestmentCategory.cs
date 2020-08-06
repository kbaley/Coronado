using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Coronado.Web.Domain
{
    [Table("investment_categories")]
    public class InvestmentCategory
    {
        [Key]
        public Guid InvestmentCategoryId { get; set; }
        public string Name { get; set; }
        public decimal Percentage { get; set; }
    }
}

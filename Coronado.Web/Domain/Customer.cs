using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Coronado.Web.Domain
{
  [Table("customers")]
    public class Customer
    {
        [Key]
        public Guid CustomerId {get;set;}    
        
        [Required]
        public string Name { get; set; }
    }
}
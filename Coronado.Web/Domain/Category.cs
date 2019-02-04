using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Coronado.Web.Domain
{

    [Table("categories")]
    public class Category
    {
        [Key]
        public Guid CategoryId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Type { get; set; }

        public Guid? ParentCategoryId { get; set; }
    }

}
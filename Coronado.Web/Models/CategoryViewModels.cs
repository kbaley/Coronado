using System;

namespace Coronado.Web.Models
{
    public class CategoryForPosting {
        public Guid CategoryId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public Guid ParentCategoryId { get; set; }
    }
}
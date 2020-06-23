using System;

namespace Coronado.ConsoleApp.Domain
{
    public class Category : IHasAlias {
        public Guid CategoryId { get; set; }
        public string Name { get; set; }
        public string Alias { get; set; }
    }
}

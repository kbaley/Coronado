using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Coronado.Web.Domain
{
    [Table("users")]
    public class User
    {
        [Key]
        public Guid UserId { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Password { get; set; }
    }

}
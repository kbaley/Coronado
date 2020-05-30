using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Coronado.Web.Domain
{
    [Table("transfers")]
    public class Transfer
    {
        [Key]
        public Guid TransferId { get; set; }
        public Guid LeftTransactionId { get; set; }
        public Guid RightTransactionId { get; set; }
        public Transaction LeftTransaction { get; set; }
        public Transaction RightTransaction { get; set; }
    }
}

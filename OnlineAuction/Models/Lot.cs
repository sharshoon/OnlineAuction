using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineAuction.Models
{
    public class Lot
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Id { get; set; }
        public string NextLotId { get; set; }
        public string ImagePath { get; set; }
        public string Description { get; set; }
        public string MinPriceUsd { get; set; }
        [Required]
        public int ActionTimeSec { get; set; }
    }
}

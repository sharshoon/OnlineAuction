using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineAuction.Models
{
    public class Lot
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string NextLotId { get; set; }
        [Required]
        public string ImagePath { get; set; }
        public string Description { get; set; }
        public int MinPriceUsd { get; set; }
        [Required]
        public int ActionTimeSec { get; set; }
    }
}

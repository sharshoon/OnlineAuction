﻿using System.ComponentModel.DataAnnotations;
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
        public int? NextLotId { get; set; } = null;
        [Required]
        public string ImagePath { get; set; }
        public string Description { get; set; }
        public int MinPriceUsd { get; set; }
        [Required] public int ActionTimeSec { get; set; }
        public bool IsSold { get; set; } = false;
    }
}

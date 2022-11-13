using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Dtos
{
    public class TagCreateDto
    {
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? BackGroundColorHex { get; set; }
        public string? TextColorHex { get; set; }
    }
}

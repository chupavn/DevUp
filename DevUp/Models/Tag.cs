using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DevUp.Models
{
    public class Tag
    {
        [Key]
        public int Id { get; set; }
        public string AuthorId { get; set; }
        [ForeignKey("AuthorId")]
        public virtual ApplicationUser Author { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? BackGroundColorHex { get; set; }
        public string? TextColorHex { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }
        public DateTime? DeletedAt { get; set; }

        public virtual ICollection<Article> Articles { get; set; } = new List<Article>();
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Models
{
    public class Quiz
    {
        public int Id { get; set; }
        public string HostId { get; set; }
        [ForeignKey("HostId")]
        public virtual ApplicationUser Host { get; set; }
        [Required]
        public string Title { get; set; }
        public string MetaTitle { get; set; }
        public string Slug { get; set; }
        public string Summary { get; set; }
        public int? Type { get; set; }
        public int Score { get; set; }
        public bool Published { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }
        public DateTime? PublishedAt { get; set; }
        public DateTime? StartAt { get; set; }
        public DateTime? EndAt { get; set; }
        public string Content { get; set; }
    }
}

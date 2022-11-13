using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Dtos
{
    public class QuizCreateDto
    {
        [Required]
        public string Title { get; set; }
        public string MetaTitle { get; set; }
        public string Summary { get; set; }
        public int? Type { get; set; }
        public DateTime? StartAt { get; set; }
        public DateTime? EndAt { get; set; }
        public string Content { get; set; }
    }
}

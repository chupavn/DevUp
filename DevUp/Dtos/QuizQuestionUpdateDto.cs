using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Dtos
{
    public class QuizQuestionUpdateDto
    {
        [Required]
        public int QuizId { get; set; }
        public int? Type { get; set; }
        public bool Active { get; set; }
        public int Level { get; set; }
        public int Score { get; set; }
        [Required]
        public string Content { get; set; }
    }
}

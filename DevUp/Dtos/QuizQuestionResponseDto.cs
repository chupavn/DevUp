using DevUp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Dtos
{
    public class QuizQuestionResponseDto
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }
        public int? Type { get; set; }
        public bool Active { get; set; }
        public int Level { get; set; }
        public int Score { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }
        public string Content { get; set; }
    }
}

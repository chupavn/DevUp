using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Dtos
{
    public class CommentUpdateDto
    {
        [Required]
        public string Content { get; set; }

        public int? ParentId { get; set; }

        [Required]
        public int ArticleId { get; set; }
    }
}

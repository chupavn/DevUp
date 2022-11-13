using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Dtos
{
    public class ReadingListCreateDto
    {
        [Required]
        public int ArticleId { get; set; }
    }
}

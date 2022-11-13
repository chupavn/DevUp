using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Dtos
{
    public class ArticleUpdateDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string? CoverImageUrl { get; set; }
        public string Slug { get; set; }
        public List<TagUpdateDto> Tags { get; set; }
    }
}

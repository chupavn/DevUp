using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Dtos
{
    public class ArticleResponseDto
    {
        public int Id { get; set; }
        public string AuthorId { get; set; }
        public UserResponse Author { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Slug { get; set; }
        public string? CoverImageUrl { get; set; }
        public bool IsPublished { get; set; }
        public bool IsReadingList { get; set; }
        public int ReadingListCount { get; set; } = 0;
        public bool IsLiked { get; set; }
        public int LikedCount { get; set; } = 0;
        public bool IsArchivedReadingList { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }
        public DateTime? PublishedAt { get; set; }

        public List<TagResponseDto> Tags { get; set; }
        public List<CommentResponseDto> Comments { get; set; }
    }
}

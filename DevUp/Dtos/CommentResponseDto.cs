using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Dtos
{
    public class CommentResponseDto
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public int ArticleId { get; set; }
        public string AuthorId { get; set; }
        public UserResponse Author { get; set; }
        public string Content { get; set; }
        public bool IsLiked { get; set; }
        public int LikedCount { get; set; } = 0;
        public DateTime CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }

    }
}

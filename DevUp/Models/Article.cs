using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DevUp.Models
{
    public class Article
    {
        public int Id { get; set; }
        public string AuthorId { get; set; }
        [ForeignKey("AuthorId")]
        public virtual ApplicationUser Author { get; set; }
        [Required]
        public string Title { get; set; }
        public string Content { get; set; }
        public string Slug { get; set; }
        public string? CoverImageUrl { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }
        public DateTime? PublishedAt { get; set; }
        public DateTime? DeletedAt { get; set; }

        public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public virtual ICollection<ReadingList> ReadingLists { get; set; } = new List<ReadingList>();
        public virtual ICollection<UserLikeArticle> UserLikeArticles { get; set; } = new List<UserLikeArticle>();
    }
}

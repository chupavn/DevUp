using AutoMapper;
using Microsoft.EntityFrameworkCore;
using DevUp.Data;
using DevUp.Dtos;
using DevUp.Helpers;
using DevUp.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DevUp.Services
{
    public interface ICommentService
    {
        Comment Create(Comment comment, string authorId);
        IEnumerable<Comment> Get(int? id, int articleId, string authorId);
        Comment GetById(int id);
        Comment Update(int id, CommentUpdateDto model);

        UserLikeComment LikeComment(int id, string userId);
        UserLikeComment UnLikeComment(int id, string userId);
        void Delete(int id);
    }

    public class CommentService : ICommentService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public CommentService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public Comment Create(Comment comment, string authorId)
        {
            _context.Comments.Add(comment);
            _context.SaveChanges();
            return comment;
        }

        public Comment Update(int id, CommentUpdateDto model)
        {
            var comment = GetById(id);

            _mapper.Map(model, comment);
            comment.UpdateAt = DateTime.UtcNow;
            _context.Comments.Update(comment);
            _context.SaveChanges();

            return comment;
        }

        public IEnumerable<Comment> Get(int? id, int articleId, string authorId)
        {
            var comments = _context.Comments
                            .Include(x => x.Author)
                            .Include(x => x.Parent)
                            .Include(x => x.UserLikeComments)
                            .Where(x => x.ArticleId == articleId)
                            .WhereIf(id.HasValue, x => x.Id == id)
                            .WhereIf(!string.IsNullOrEmpty(authorId), x => x.AuthorId == authorId)
                            .OrderByDescending(x => x.CreateAt);
            return comments;
        }

        public Comment GetById(int id)
        {
            var dbObject = _context.Comments
                .Include(x => x.Author)
                .Include(x => x.Parent)
                .Include(x => x.UserLikeComments)
                .FirstOrDefault(x => x.Id == id);
            if (dbObject == null) throw new KeyNotFoundException("Comment not found");
            return dbObject;
        }

        public void Delete(int id)
        {
            var dbObject = GetById(id);
            _context.Comments.Remove(dbObject);
            _context.SaveChanges();
        }

        public UserLikeComment LikeComment(int commentId, string userId)
        {
            var comment = GetById(commentId);
            if (comment == null) return null;
            var userLikeCommentExists = _context.UserLikeComments.FirstOrDefault(x => x.CommentId == commentId && x.UserId == userId);
            if (userLikeCommentExists != null)
            {
                return userLikeCommentExists;
            }

            var userLikeComment = new UserLikeComment
            {
                CommentId = commentId,
                UserId = userId,
                CreateAt = DateTime.UtcNow,
            };
            _context.UserLikeComments.Add(userLikeComment);
            _context.SaveChanges();

            return userLikeComment;

        }

        public UserLikeComment UnLikeComment(int commentId, string userId)
        {
            var userLikeComment = _context.UserLikeComments.FirstOrDefault(x => x.CommentId == commentId && x.UserId == userId);
            if (userLikeComment == null) return null;
            _context.UserLikeComments.Remove(userLikeComment);
            _context.SaveChanges();

            return userLikeComment;

        }
    }
}

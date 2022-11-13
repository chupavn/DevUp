using AutoMapper;
using Microsoft.EntityFrameworkCore;
using DevUp.Data;
using DevUp.Dtos;
using DevUp.Helpers;
using DevUp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace DevUp.Services
{
    public interface IArticleService
    {
        Article Create(Article article, string userId);
        IEnumerable<Article> Get(int? id, string tagName, string authorId, int? top, int? skip, string loginUserId, bool readingListOnly, string q, string filters = null, string sortBy = null, string sortDirection = null, bool publishedOnly = false);
        Article GetById(int id);
        Article Update(int id, ArticleUpdateDto model);
        ReadingList AddToReadingList(int id, string userId);
        ReadingList RemoveReadingList(int id, string userId);
        ReadingList ArchiveReadingList(int id, string userId);
        ReadingList UnArchiveReadingList(int id, string userId);

        UserLikeArticle LikeArticle(int id, string userId);
        UserLikeArticle UnLikeArticle(int id, string userId);
        void Delete(int id);
    }

    public class ArticleService : IArticleService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ArticleService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public Article Create(Article article, string userId)
        {
            _context.Articles.Add(article);
            _context.SaveChanges();
            return article;
        }

        public Article Update(int id, ArticleUpdateDto model)
        {
            var article = GetById(id);

            // copy model to article and save
            _mapper.Map(model, article);
            article.UpdateAt = DateTime.UtcNow;
            _context.Articles.Update(article);
            _context.SaveChanges();

            return article;
        }

        public IEnumerable<Article> Get(int? id, string tagName, string authorId, int? top, int? skip = 0, string loginUserId = null, bool readingListOnly = false, string q = null, string filters = null, string sortBy = null, string sortDirection = null, bool publishedOnly = false)
        {
            var articles = _context.Articles
                .Include(x => x.Author)
                .Include(x => x.Tags)
                .Include(x => x.ReadingLists)
                .Include(x => x.UserLikeArticles)
                .Include(x => x.Comments)
                .ThenInclude(x => x.Author)
                .Include(x => x.Comments)
                .ThenInclude(x => x.UserLikeComments)
                .WhereIf(id.HasValue, x => x.Id == id)
                .WhereIf(!string.IsNullOrEmpty(tagName), x => x.Tags.Any(t => t.Name == tagName))
                .WhereIf(!string.IsNullOrEmpty(authorId), x => x.AuthorId == authorId)
                .WhereIf(readingListOnly && !string.IsNullOrEmpty(loginUserId),
                    x => x.ReadingLists.Any(rl => rl.ArticleId == x.Id && rl.UserId == loginUserId))
                .WhereIf(!string.IsNullOrEmpty(q), x => x.Title.ToLower().Contains(q.ToLower()) || x.Content.ToLower().Contains(q.ToLower()) || x.Author.Name.ToLower().Contains(q.ToLower()) || x.Tags.Any(t => t.Name.ToLower().Contains(q.ToLower())))
                .WhereIf(!string.IsNullOrEmpty(filters) && filters == "myArticles", x => x.Author.Id == loginUserId)
                .WhereIf(publishedOnly, x => x.PublishedAt.HasValue)
                .OrderByDescending(x => x.PublishedAt)
                .OrderByDescending(x => x.CreateAt)
                .Skip(skip.Value)
                .TakeIfHasValue(top);
            return articles;
        }

        public Article GetById(int id)
        {
            var dbObject = _context.Articles
                .Include(x => x.Author)
                .Include(x => x.Tags)
                .Include(x => x.ReadingLists)
                .Include(x => x.UserLikeArticles)
                .Include(x => x.Comments)
                .ThenInclude(x => x.Author)
                .Include(x => x.Comments)
                .ThenInclude(x => x.UserLikeComments)
                .FirstOrDefault(x => x.Id == id);
            if (dbObject == null) throw new KeyNotFoundException("Article not found");
            return dbObject;
        }

        public void Delete(int id)
        {
            var dbObject = GetById(id);
            _context.Articles.Remove(dbObject);
            _context.SaveChanges();
        }

        public ReadingList AddToReadingList(int articleId, string userId)
        {
            var article = GetById(articleId);
            if (article == null) return null;
            var readingListExists = _context.ReadingLists.FirstOrDefault(x => x.ArticleId == articleId && x.UserId == userId);
            if (readingListExists != null)
            {
                return readingListExists;
            }

            var readingList = new ReadingList
            {
                ArticleId = articleId,
                UserId = userId,
                IsArchived = false,
                CreateAt = DateTime.UtcNow,
            };
            _context.ReadingLists.Add(readingList);
            _context.SaveChanges();

            return readingList;

        }

        public ReadingList RemoveReadingList(int articleId, string userId)
        {
            var readingList = _context.ReadingLists.FirstOrDefault(x => x.ArticleId == articleId && x.UserId == userId);
            if (readingList == null) return null;
            _context.ReadingLists.Remove(readingList);
            _context.SaveChanges();

            return readingList;

        }

        public ReadingList ArchiveReadingList(int articleId, string userId)
        {
            var readingList = _context.ReadingLists.FirstOrDefault(x => x.ArticleId == articleId && x.UserId == userId);
            if (readingList == null) return null;
            readingList.IsArchived = true;
            readingList.UpdateAt = DateTime.UtcNow;
            _context.SaveChanges();

            return readingList;

        }

        public ReadingList UnArchiveReadingList(int articleId, string userId)
        {
            var readingList = _context.ReadingLists.FirstOrDefault(x => x.ArticleId == articleId && x.UserId == userId);
            if (readingList == null) return null;
            readingList.IsArchived = false;
            readingList.UpdateAt = DateTime.UtcNow;
            _context.SaveChanges();

            return readingList;

        }

        public UserLikeArticle LikeArticle(int articleId, string userId)
        {
            var article = GetById(articleId);
            if (article == null) return null;
            var userLikeArticleExists = _context.UserLikeArticles.FirstOrDefault(x => x.ArticleId == articleId && x.UserId == userId);
            if (userLikeArticleExists != null)
            {
                return userLikeArticleExists;
            }

            var userLikeArticle = new UserLikeArticle
            {
                ArticleId = articleId,
                UserId = userId,
                CreateAt = DateTime.UtcNow,
            };
            _context.UserLikeArticles.Add(userLikeArticle);
            _context.SaveChanges();

            return userLikeArticle;

        }

        public UserLikeArticle UnLikeArticle(int articleId, string userId)
        {
            var userLikeArticle = _context.UserLikeArticles.FirstOrDefault(x => x.ArticleId == articleId && x.UserId == userId);
            if (userLikeArticle == null) return null;
            _context.UserLikeArticles.Remove(userLikeArticle);
            _context.SaveChanges();

            return userLikeArticle;

        }
    }
}

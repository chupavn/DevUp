using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DevUp.Dtos;
using DevUp.Models;
using DevUp.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SlugGenerator;
using Microsoft.AspNetCore.Authorization;
using DevUp.Data;

namespace DevUp.Controllers
{
    [ApiController]
    [Route("api/articles")]
    public class ArticleController : BaseController
    {
        private readonly IArticleService _articleService;
        private readonly ITagService _tagService;
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public ArticleController(IArticleService articleService, ITagService tagService, IMapper mapper, DataContext context) : base(context)
        {
            _articleService = articleService;
            _tagService = tagService;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ArticleResponseDto>> GetAll(string? tagName, string? authorId, int? top, int? skip = 0, bool readingListOnly = false, string q = null, string filters = null, string sortBy = null, string sortDirection = null, bool publishedOnly = false)
        {
            var articles = _articleService.Get(null, tagName, authorId, top, skip, CurrentUser?.Id, readingListOnly, q, filters, sortBy, sortDirection, publishedOnly);
            var dtos = _mapper.Map<IList<ArticleResponseDto>>(articles);

            if (CurrentUser != null)
            {
                var ids = dtos.Select(x => x.Id);
                var readingListsByCurrentUser = _context.ReadingLists.Where(x => ids.Contains(x.ArticleId) && x.UserId == CurrentUser.Id).ToList();

                var userLikeArticlesByCurrentUser = _context.UserLikeArticles.Where(x => ids.Contains(x.ArticleId) && x.UserId == CurrentUser.Id).ToList();

                var userTags = _context.UserTags.Where(x => x.UserId == CurrentUser.Id).ToList();
                var userTagIds = userTags.Select(x => x.TagId).Distinct();

                foreach (var item in dtos)
                {
                    var readingList = readingListsByCurrentUser.FirstOrDefault(x => x.ArticleId == item.Id && x.UserId == CurrentUser.Id);
                    item.IsReadingList = readingList != null;
                    item.IsArchivedReadingList = readingList != null && readingList.IsArchived;
                    item.IsLiked = userLikeArticlesByCurrentUser.Any(x => x.ArticleId == item.Id && x.UserId == CurrentUser.Id);

                    foreach (var tag in item.Tags)
                    {
                        tag.Followed = userTagIds.Any(x => x == tag.Id);
                    }
                }
            }

            return Ok(dtos);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ArticleResponseDto> GetById(int id)
        {
            var article = _articleService.GetById(id);
            var dto = _mapper.Map<ArticleResponseDto>(article);
            if (CurrentUser != null)
            {
                var readingList = _context.ReadingLists.FirstOrDefault(x => x.ArticleId == dto.Id && x.UserId == CurrentUser.Id);
                dto.IsReadingList = readingList != null;
                dto.IsArchivedReadingList = readingList != null && readingList.IsArchived;
                dto.IsLiked = _context.UserLikeArticles.Any(x => x.ArticleId == dto.Id && x.UserId == CurrentUser.Id);

                var commentIds = dto.Comments.Select(x => x.Id);

                var userLikeCommentsByCurrentUser = _context.UserLikeComments.Where(x => commentIds.Contains(x.CommentId) && x.UserId == CurrentUser.Id).ToList();

                foreach (var comment in dto.Comments)
                {
                    comment.IsLiked = userLikeCommentsByCurrentUser.Any(x => x.CommentId == comment.Id && x.UserId == CurrentUser.Id);
                }
            }

            return Ok(dto);
        }

        [Authorize]
        [HttpPost]
        public ActionResult<ArticleResponseDto> Create(ArticleCreateDto model)
        {
            var article = _mapper.Map<Article>(model);
            article.AuthorId = CurrentUser.Id;
            article.IsPublished = false;
            article.Slug = model.Title.GenerateSlug();
            article.CreateAt = DateTime.UtcNow;

            article = _articleService.Create(article, CurrentUser.Id);

            foreach (var tag in model.Tags)
            {
                if (!string.IsNullOrEmpty(tag.Name.Trim()))
                {
                    var tagDbObject = _context.Tags.FirstOrDefault(x => x.Name == tag.Name);
                    if (tagDbObject != null)
                    {
                        tagDbObject.Articles.Add(article);
                    }
                    else
                    {
                        var newTag = _mapper.Map<Tag>(tag);
                        newTag.AuthorId = CurrentUser.Id;
                        newTag.CreateAt = DateTime.UtcNow;
                        newTag.Articles.Add(article);
                        _context.Tags.Add(newTag);
                    }
                }
            }

            _context.SaveChanges();

            return Ok(_mapper.Map<ArticleResponseDto>(article));
        }

        [Authorize]
        [HttpPut("{id}")]
        public ActionResult<ArticleResponseDto> Update(int id, ArticleUpdateDto model)
        {
            var dbObject = _articleService.GetById(id);
            if (dbObject == null || (CurrentUser.Id != dbObject.AuthorId && !Roles.IsAdministrator(HttpContext.User)))
            {
                return Forbid();
            }

            model.Slug = model.Title.GenerateSlug();
            var article = _articleService.Update(id, model);

            // remove
            var removedTagsInArticle = article.Tags.Where(t => model.Tags.All(mt => mt.Name != t.Name)).Select(x => x.Id);
            var removedTags = _context.Tags.Where(x => removedTagsInArticle.Contains(x.Id));
            foreach (var rmTag in removedTags)
            {
                article.Tags.Remove(rmTag);
            }

            _context.SaveChanges();

            foreach (var tag in model.Tags)
            {
                if (!string.IsNullOrEmpty(tag.Name.Trim()))
                {
                    var tagDbObject = _context.Tags.FirstOrDefault(x => x.Name == tag.Name);
                    if (tagDbObject != null)
                    {
                        if (!article.Tags.Any(t => t.Name == tag.Name))
                        {
                            tagDbObject.Articles.Add(article);
                        }
                    }
                    else
                    {
                        var newTag = _mapper.Map<Tag>(tag);
                        newTag.AuthorId = CurrentUser.Id;
                        newTag.CreateAt = DateTime.UtcNow;
                        newTag.Articles.Add(article);
                        _context.Tags.Add(newTag);
                    }
                }
            }

            _context.SaveChanges();

            return Ok(_mapper.Map<ArticleResponseDto>(article));
        }

        [Authorize]
        [HttpPut("{id}/published")]
        public ActionResult<ArticleResponseDto> Published(int id)
        {
            var article = _context.Articles.FirstOrDefault(x => x.Id == id && x.AuthorId == CurrentUser.Id);
            if (article != null)
            {
                article.PublishedAt = DateTime.UtcNow;
                article.IsPublished = true;
                _context.SaveChanges();
                return Ok(_mapper.Map<ArticleResponseDto>(article));
            }
            return BadRequest();
        }

        [Authorize]
        [HttpPut("{id}/unpublished")]
        public ActionResult<ArticleResponseDto> Unpublished(int id)
        {
            var article = _context.Articles.FirstOrDefault(x => x.Id == id && x.AuthorId == CurrentUser.Id);
            if (article != null)
            {
                article.PublishedAt = null;
                article.IsPublished = false;
                _context.SaveChanges();
                return Ok(_mapper.Map<ArticleResponseDto>(article));
            }
            return BadRequest();
        }

        [Authorize]
        [HttpPut("{id}/add-to-reading-list")]
        public ActionResult<ArticleResponseDto> AddToReadingList(int id)
        {
            var readingList = _articleService.AddToReadingList(id, CurrentUser.Id);
            if (readingList != null)
                return GetById(id);
            return BadRequest();
        }

        [Authorize]
        [HttpPut("{id}/remove-reading-list")]
        public ActionResult<ArticleResponseDto> RemoveReadingList(int id)
        {
            var readingList = _articleService.RemoveReadingList(id, CurrentUser.Id);
            if (readingList != null)
                return GetById(id);
            return BadRequest();
        }

        [Authorize]
        [HttpPut("{id}/archive-reading-list")]
        public ActionResult<ArticleResponseDto> ArchiveReadingList(int id)
        {
            var readingList = _articleService.ArchiveReadingList(id, CurrentUser.Id);
            if (readingList != null)
                return GetById(id);
            return BadRequest();
        }

        [Authorize]
        [HttpPut("{id}/unarchive-reading-list")]
        public ActionResult<ArticleResponseDto> UnArchiveReadingList(int id)
        {
            var readingList = _articleService.UnArchiveReadingList(id, CurrentUser.Id);
            if (readingList != null)
                return GetById(id);
            return BadRequest();
        }

        [Authorize]
        [HttpPut("{id}/like-article")]
        public ActionResult<ArticleResponseDto> LikeArticle(int id)
        {
            var readingList = _articleService.LikeArticle(id, CurrentUser.Id);
            if (readingList != null)
                return GetById(id);
            return BadRequest();
        }

        [Authorize]
        [HttpPut("{id}/unlike-article")]
        public ActionResult<ArticleResponseDto> UnLikeArticle(int id)
        {
            var readingList = _articleService.UnLikeArticle(id, CurrentUser.Id);
            if (readingList != null)
                return GetById(id);
            return BadRequest();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var dbObject = _articleService.GetById(id);
            if (dbObject == null || (CurrentUser.Id != dbObject.AuthorId && !Roles.IsAdministrator(HttpContext.User)))
            {
                return Forbid();
            }

            _articleService.Delete(id);
            return Ok();
        }
    }
}

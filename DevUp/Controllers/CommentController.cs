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
    [Route("api/comments")]
    public class CommentController : BaseController
    {
        //private readonly IArticleService _articleService;
        private readonly ICommentService _commentService;
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public CommentController(IArticleService articleService, ICommentService commentService, IMapper mapper, DataContext context) : base(context)
        {
            //_articleService = articleService;
            _commentService = commentService;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<CommentResponseDto>> GetAll(string tagName, int articleId, string authorId)
        {
            var comments = _commentService.Get(null, articleId, authorId);
            var dtos = _mapper.Map<IList<CommentResponseDto>>(comments);

            if (CurrentUser != null)
            {
                var ids = dtos.Select(x => x.Id);

                var userLikeCommentsByCurrentUser = _context.UserLikeComments.Where(x => ids.Contains(x.CommentId) && x.UserId == CurrentUser.Id).ToList();

                foreach (var item in dtos)
                {
                    item.IsLiked = userLikeCommentsByCurrentUser.Any(x => x.CommentId == item.Id && x.UserId == CurrentUser.Id);
                }
            }

            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public ActionResult<CommentResponseDto> GetById(int id)
        {
            var comment = _commentService.GetById(id);
            var dto = _mapper.Map<CommentResponseDto>(comment);
            if (CurrentUser != null)
            {
                dto.IsLiked = _context.UserLikeComments.Any(x => x.CommentId == dto.Id && x.UserId == CurrentUser.Id);
            }

            return Ok(dto);
        }

        [Authorize]
        [HttpPost]
        public ActionResult<CommentResponseDto> Create(CommentCreateDto model)
        {
            var comment = _mapper.Map<Comment>(model);
            comment.AuthorId = CurrentUser.Id;
            comment.CreateAt = DateTime.UtcNow;

            comment = _commentService.Create(comment, CurrentUser.Id);

            return Ok(_mapper.Map<CommentResponseDto>(comment));
        }

        [Authorize]
        [HttpPut("{id}")]
        public ActionResult<CommentResponseDto> Update(int id, CommentUpdateDto model)
        {
            var dbObject = _commentService.GetById(id);
            if (dbObject == null || (CurrentUser.Id != dbObject.AuthorId && !Roles.IsAdministrator(HttpContext.User)))
            {
                return Forbid();
            }
            var comment = _commentService.Update(id, model);
            return Ok(_mapper.Map<CommentResponseDto>(comment));
        }


        [Authorize]
        [HttpPut("{id}/like-comment")]
        public ActionResult<CommentResponseDto> LikeComment(int id)
        {
            var userLikeComment = _commentService.LikeComment(id, CurrentUser.Id);
            if (userLikeComment != null)
                return GetById(id);
            return BadRequest();
        }

        [Authorize]
        [HttpPut("{id}/unlike-comment")]
        public ActionResult<CommentResponseDto> UnLikeComment(int id)
        {
            var userLikeComment = _commentService.UnLikeComment(id, CurrentUser.Id);
            if (userLikeComment != null)
                return GetById(id);
            return BadRequest();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var dbObject = _commentService.GetById(id);
            if (dbObject == null || (CurrentUser.Id != dbObject.AuthorId && !Roles.IsAdministrator(HttpContext.User)))
            {
                return Forbid();
            }
            _commentService.Delete(id);
            return Ok();
        }
    }
}

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
    [Route("api/tags")]
    public class TagController: BaseController
    {
        private readonly ITagService _tagService;
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public TagController(ITagService tagService, IMapper mapper, DataContext context): base(context)
        {
            _tagService = tagService;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<TagResponseDto>> GetAll()
        {
            var tags = _tagService.Get(null);
            var dtos = _mapper.Map<IList<TagResponseDto>>(tags);
            if (CurrentUser != null)
            {
                var ids = dtos.Select(x => x.Id);
                var userTags = _context.UserTags.Where(x => ids.Contains(x.TagId) && x.UserId == CurrentUser.Id);

                foreach (var item in dtos)
                {
                    item.Followed = userTags.Any(x => x.TagId == item.Id && x.UserId == CurrentUser.Id);
                }
            }
            return Ok(dtos.OrderByDescending(x => x.PostCount));
        }

        [Authorize]
        [HttpGet("get-following-tags")]
        public ActionResult<IEnumerable<TagResponseDto>> GetFollowingTags()
        {
            var tags = _tagService.GetFollowingTagsByUser(CurrentUser.Id);
            var dtos = _mapper.Map<IList<TagResponseDto>>(tags);
            if (CurrentUser != null)
            {
                var ids = dtos.Select(x => x.Id);
                var userTags = _context.UserTags.Where(x => ids.Contains(x.TagId) && x.UserId == CurrentUser.Id);

                foreach (var item in dtos)
                {
                    item.Followed = userTags.Any(x => x.TagId == item.Id && x.UserId == CurrentUser.Id);
                }
            }
            return Ok(dtos.OrderByDescending(x => x.PostCount));
        }

        [HttpGet("{id}")]
        public ActionResult<TagResponseDto> GetById(int id)
        {
            var tag = _tagService.GetById(id);
            var dto = _mapper.Map<TagResponseDto>(tag);
            if (CurrentUser != null)
            {
                dto.Followed = _context.UserTags.Any(x => x.TagId == dto.Id && x.UserId == CurrentUser.Id);
            }
            return Ok(dto);
        }

        [HttpGet("get-by-name/{tagName}")]
        public ActionResult<TagResponseDto> GetByName(string tagName)
        {
            var tag = _tagService.GetByName(tagName);
            var dto = _mapper.Map<TagResponseDto>(tag);
            if (CurrentUser != null)
            {
                dto.Followed = _context.UserTags.Any(x => x.TagId == dto.Id && x.UserId == CurrentUser.Id);
            }
            return Ok(dto);
        }

        [Authorize]
        [HttpPost]
        public ActionResult<TagResponseDto> Create(TagCreateDto model)
        {
            var tag = _mapper.Map<Tag>(model);
            tag.AuthorId = CurrentUser.Id;
            tag.CreateAt = DateTime.UtcNow;
            _tagService.Create(tag);
            return Ok(GetById(tag.Id));
        }

        [Authorize]
        [HttpPut("{id}")]
        public ActionResult<TagResponseDto> Update(int id, TagCreateDto model)
        {
            var tag = _tagService.Update(id, model);
            return Ok(GetById(tag.Id));
        }

        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _tagService.Delete(id);
            return Ok();
        }

        [Authorize]
        [HttpPut("{id}/follow-tag")]
        public ActionResult FollowTag(int id)
        {
            var userTag = _tagService.FollowTag(id, CurrentUser.Id);
            if (userTag != null)
                return Ok();
            return BadRequest();
        }

        [Authorize]
        [HttpPut("{id}/unfollow-tag")]
        public ActionResult UnFollowTag(int id)
        {
            var userTag = _tagService.UnFollowTag(id, CurrentUser.Id);
            if (userTag != null)
                return Ok();
            return BadRequest();
        }
    }
}

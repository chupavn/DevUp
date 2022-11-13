using AutoMapper;
using Microsoft.EntityFrameworkCore;
using DevUp.Data;
using DevUp.Dtos;
using DevUp.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DevUp.Services
{
    public interface ITagService
    {
        Tag Create(Tag tag);
        IEnumerable<Tag> Get(int? id);
        IEnumerable<Tag> GetFollowingTagsByUser(string userId);
        Tag GetById(int id);
        Tag GetByName(string name);
        Tag Update(int id, TagCreateDto model);
        void Delete(int id);
        UserTag FollowTag(int tagId, string userId);
        UserTag UnFollowTag(int tagId, string userId);
    }

    public class TagService : ITagService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public TagService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public Tag Create(Tag tag)
        {
            _context.Tags.Add(tag);
            _context.SaveChanges();
            return tag;
        }

        public Tag Update(int id, TagCreateDto model)
        {
            var tag = GetById(id);

            // copy model to tag and save
            _mapper.Map(model, tag);
            tag.UpdateAt = DateTime.UtcNow;
            _context.Tags.Update(tag);
            _context.SaveChanges();

            return tag;
        }

        public IEnumerable<Tag> Get(int? id)
        {
            var tags = _context.Tags.Include(x => x.Articles).Where(x => !id.HasValue || x.Id == id);
            return tags;
        }

        public IEnumerable<Tag> GetFollowingTagsByUser(string userId)
        {
            var tags = _context.UserTags.Include(x => x.Tag).Include(x => x.Tag.Articles).Where(x => x.UserId == userId).Select(x => x.Tag);
            return tags;
        }

        public Tag GetById(int id)
        {
            var tag = _context.Tags.Find(id);
            if (tag == null) throw new KeyNotFoundException("Tag not found");
            return tag;
        }

        public Tag GetByName(string name)
        {
            var tag = _context.Tags.Include(x => x.Articles).FirstOrDefault(x => x.Name == name);
            if (tag == null) throw new KeyNotFoundException("Tag not found");
            return tag;
        }

        public void Delete(int id)
        {
            var tag = GetById(id);
            _context.Tags.Remove(tag);
            _context.SaveChanges();
        }

        public UserTag FollowTag(int tagId, string userId)
        {
            var tag = GetById(tagId);
            if (tag == null) return null;
            var userTagExists = _context.UserTags.FirstOrDefault(x => x.TagId == tagId && x.UserId == userId);
            if (userTagExists != null)
            {
                return userTagExists;
            }

            var userTag = new UserTag
            {
                TagId = tagId,
                UserId = userId,
                CreateAt = DateTime.UtcNow,
            };
            _context.UserTags.Add(userTag);
            _context.SaveChanges();

            return userTag;

        }

        public UserTag UnFollowTag(int tagId, string userId)
        {
            var userTag = _context.UserTags.FirstOrDefault(x => x.TagId == tagId && x.UserId == userId);
            if (userTag == null) return null;
            _context.UserTags.Remove(userTag);
            _context.SaveChanges();

            return userTag;

        }

    }
}

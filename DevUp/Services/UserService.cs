using AutoMapper;
using DevUp.Data;
using DevUp.Dtos;
using DevUp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DevUp.Helpers;

namespace DevUp.Services
{
    public interface IUserService
    {
        ApplicationUser Create(ApplicationUser user);
        ApplicationUser GetUserByEmail(string email);
        ApplicationUser GetUserById(string id);
        ApplicationUser Update(string id, UserUpdateDto model);
        void Delete(string id);
    }

    public class UserService : IUserService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public ApplicationUser Create(ApplicationUser user)
        {
            if(_context.Users.Any(x => x.Email == user.Email))
            {
                throw new AppException($"Email '{user.Email}' is already registered");
            }
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

        public ApplicationUser Update(string id, UserUpdateDto model)
        {
            var user = GetUserById(id);

            // copy model to user and save
            _mapper.Map(model, user);
            _context.Users.Update(user);
            _context.SaveChanges();

            return user;
        }

        public ApplicationUser GetUserByEmail(string email)
        {
            return _context.Users.FirstOrDefault(x => x.Email == email);
        }

        public ApplicationUser GetUserById(string id)
        {
            var user = _context.Users.Find(id);
            if (user == null) throw new KeyNotFoundException("User not found");
            return user;
        }

        public void Delete(string id)
        {
            var user = GetUserById(id);
            _context.Users.Remove(user);
            _context.SaveChanges();
        }
    }
}

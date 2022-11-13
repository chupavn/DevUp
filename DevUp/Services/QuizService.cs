using AutoMapper;
using DevUp.Data;
using DevUp.Dtos;
using DevUp.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DevUp.Services
{
    public interface IQuizService
    {
        Quiz Create(Quiz quiz);
        IEnumerable<Quiz> Get(int? id);
        Quiz GetById(int id);
        Quiz Update(int id, QuizUpdateDto model);
        void Delete(int id);
    }

    public class QuizService : IQuizService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public QuizService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public Quiz Create(Quiz quiz)
        {
            _context.Quizzes.Add(quiz);
            _context.SaveChanges();
            return quiz;
        }

        public Quiz Update(int id, QuizUpdateDto model)
        {
            var quiz = GetById(id);

            // copy model to quiz and save
            _mapper.Map(model, quiz);
            quiz.UpdateAt = DateTime.UtcNow;
            _context.Quizzes.Update(quiz);
            _context.SaveChanges();

            return quiz;
        }

        public IEnumerable<Quiz> Get(int? id)
        {
            var quizzes = _context.Quizzes.Where(x => !id.HasValue || x.Id == id);
            return quizzes;
        }

        public Quiz GetById(int id)
        {
            var quiz = _context.Quizzes.Find(id);
            if (quiz == null) throw new KeyNotFoundException("Quiz not found");
            return quiz;
        }

        public void Delete(int id)
        {
            var quiz = GetById(id);
            _context.Quizzes.Remove(quiz);
            _context.SaveChanges();
        }
    }
}

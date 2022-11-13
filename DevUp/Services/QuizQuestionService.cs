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
    public interface IQuizQuestionService
    {
        QuizQuestion Create(QuizQuestion quizQuestion);
        IEnumerable<QuizQuestion> Get(int? id = null, int? quizId = null, bool active = false);
        QuizQuestion GetById(int id);
        QuizQuestion Update(int id, QuizQuestionUpdateDto model);
        void Delete(int id);
    }

    public class QuizQuestionService : IQuizQuestionService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public QuizQuestionService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public QuizQuestion Create(QuizQuestion quizQuestion)
        {
            _context.QuizQuestions.Add(quizQuestion);
            _context.SaveChanges();
            return quizQuestion;
        }

        public QuizQuestion Update(int id, QuizQuestionUpdateDto model)
        {
            var quizQuestion = GetById(id);

            // copy model to quiz question and save
            _mapper.Map(model, quizQuestion);
            quizQuestion.UpdateAt = DateTime.UtcNow;
            _context.QuizQuestions.Update(quizQuestion);
            _context.SaveChanges();

            return quizQuestion;
        }

        public IEnumerable<QuizQuestion> Get(int? id, int? quizId, bool includeInActive = false)
        {
            var quizQuestions = _context.QuizQuestions.Include(x => x.Quiz)
                .WhereIf(id.HasValue, x => x.Id == id)
                .WhereIf(quizId.HasValue, x => x.QuizId == quizId)
                .WhereIf(!includeInActive, x => x.Active);
            return quizQuestions;
        }

        public QuizQuestion GetById(int id)
        {
            var quizQuestion = _context.QuizQuestions.Find(id);
            if (quizQuestion == null) throw new KeyNotFoundException("Quiz question not found");
            return quizQuestion;
        }

        public void Delete(int id)
        {
            var quizQuestion = GetById(id);
            _context.QuizQuestions.Remove(quizQuestion);
            _context.SaveChanges();
        }
    }
}

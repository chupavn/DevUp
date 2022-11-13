using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DevUp.Data;
using DevUp.Dtos;
using DevUp.Models;
using DevUp.Services;
using System;
using System.Collections.Generic;
using DevUp.Helpers;

namespace DevUp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/quizquestions")]
    public class QuizQuestionController: BaseController
    {        
        private readonly IQuizQuestionService _quizQuestionService;
        private readonly IMapper _mapper;

        public QuizQuestionController(IQuizQuestionService quizQuestionService, IMapper mapper, DataContext context): base(context)
        {
            _quizQuestionService = quizQuestionService;
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<IEnumerable<QuizQuestionResponseDto>> GetAll(int? id = null, int? quizId = null, bool includeInActive = false)
        {
            var quizQuestions = _quizQuestionService.Get(id, quizId, includeInActive);
            return Ok(_mapper.Map<IList<QuizQuestionResponseDto>>(quizQuestions));
        }

        [HttpGet("{id}")]
        public ActionResult<QuizQuestionResponseDto> GetById(int id)
        {
            var quizQuestion = _quizQuestionService.GetById(id);
            return Ok(_mapper.Map<QuizQuestionResponseDto>(quizQuestion));
        }

        [HttpPost]
        public ActionResult<QuizQuestionResponseDto> Create(QuizQuestionCreateDto model)
        {
            var quizQuestion = _mapper.Map<QuizQuestion>(model);
            quizQuestion.CreateAt = DateTime.UtcNow;
            _quizQuestionService.Create(quizQuestion);
            return Ok(_mapper.Map<QuizQuestionResponseDto>(quizQuestion));
        }

        [HttpPut("{id}")]
        public ActionResult<QuizQuestionResponseDto> Update(int id, QuizQuestionUpdateDto model)
        {
            var quiz = _quizQuestionService.Update(id, model);
            return Ok(_mapper.Map<QuizQuestionResponseDto>(quiz));
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _quizQuestionService.Delete(id);
            return Ok();
        }
    }
}

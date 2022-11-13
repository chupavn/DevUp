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
    [Authorize]
    [ApiController]
    [Route("api/quizzes")]
    public class QuizController: BaseController
    {
        private readonly IQuizService _quizService;
        private readonly IMapper _mapper;

        public QuizController(IQuizService quizService, IMapper mapper, DataContext context): base(context)
        {
            _quizService = quizService;
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<IEnumerable<QuizResponseDto>> GetAll()
        {
            var quizzes = _quizService.Get(null);
            return Ok(_mapper.Map<IList<QuizResponseDto>>(quizzes));
        }

        [HttpGet("{id}")]
        public ActionResult<QuizResponseDto> GetById(int id)
        {
            var quiz = _quizService.GetById(id);
            return Ok(_mapper.Map<QuizResponseDto>(quiz));
        }

        [HttpPost]
        public ActionResult<QuizResponseDto> Create(QuizCreateDto model)
        {
            var quiz = _mapper.Map<Quiz>(model);
            quiz.HostId = CurrentUser.Id;
            quiz.Slug = model.Title.GenerateSlug();
            quiz.Score = 0;
            quiz.CreateAt = DateTime.UtcNow;
            _quizService.Create(quiz);
            return Ok(_mapper.Map<QuizResponseDto>(quiz));
        }

        [HttpPut("{id}")]
        public ActionResult<QuizResponseDto> Update(int id, QuizUpdateDto model)
        {
            model.Slug = model.Title.GenerateSlug();
            var quiz = _quizService.Update(id, model);
            return Ok(_mapper.Map<QuizResponseDto>(quiz));
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _quizService.Delete(id);
            return Ok();
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using DevUp.Controllers;
using DevUp.Data;
using System.Net.Http.Headers;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using DevUp.Services;

namespace DevUp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/upload")]
    public class UploadController : BaseController
    {
        private readonly DataContext _context;
        private readonly IUploadService _uploadService;

        public UploadController(DataContext context, IUploadService uploadService) : base(context)
        {
            _context = context;
            _uploadService = uploadService;
        }

        [HttpPost]
        public IActionResult Upload(List<IFormFile> files)
        {
            try
            {
                var file = files[0];
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var stream = file.OpenReadStream();
                    var uploadResult = _uploadService.Upload(fileName, stream);

                    return Ok(uploadResult);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost("upload-avatar")]
        public IActionResult UploadAvatar(List<IFormFile> files)
        {
            try
            {
                var file = files[0];
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var stream = file.OpenReadStream();
                    var uploadResult = _uploadService.UploadAvatar(fileName, stream);

                    return Ok(uploadResult);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
}

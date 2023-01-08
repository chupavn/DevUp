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
using System.Net;

namespace DevUp.Controllers
{
    [Authorize]
    [Route("api/upload")]
    public class UploadController : BaseController
    {
        private readonly IUploadService _uploadService;

        public UploadController(DataContext context, IUploadService uploadService) : base(context)
        {
            _uploadService = uploadService;
        }

        [HttpPost]
        public async Task<IActionResult> Upload([FromForm] List<IFormFile> files)
        {
            try
            {
                var file = files[0];
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var stream = file.OpenReadStream();
                    var uploadResult = await _uploadService.UploadAsync(fileName, stream);
                    if (uploadResult.StatusCode == HttpStatusCode.OK) return Ok(uploadResult);
                    return StatusCode((int)HttpStatusCode.InternalServerError, "Upload failure");
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
        public async Task<IActionResult> UploadAvatar([FromForm] List<IFormFile> files)
        {
            try
            {
                var file = files[0];
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var stream = file.OpenReadStream();
                    var uploadResult = await _uploadService.UploadAvatarAsync(fileName, stream);

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

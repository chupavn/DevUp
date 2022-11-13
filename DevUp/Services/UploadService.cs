using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using DevUp.Helpers;
using System.Collections.Generic;
using System.IO;

namespace DevUp.Services
{
    public interface IUploadService
    {
        ImageUploadResult Upload(string fileName, Stream stream);

        ImageUploadResult UploadAvatar(string fileName, Stream stream);
    }

    public class UploadService : IUploadService
    {
        private readonly Account _account;
        private readonly Cloudinary _cloudinary;
        private readonly AppSettings _appSettings;

        public UploadService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
            _account = new Account(
                _appSettings.CloudinaryName,
                _appSettings.CloudinaryApiKey,
                _appSettings.CloudinaryApiSecret);

            _cloudinary = new Cloudinary(_account);
        }

        private ImageUploadResult _Upload(string fileName, Stream stream, string folder)
        {
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(fileName, stream),
                Folder = folder,
                Transformation = new Transformation().Quality("auto"),
            };
            return _cloudinary.Upload(uploadParams);
        }

        public ImageUploadResult Upload(string fileName, Stream stream)
        {
            return _Upload(fileName, stream, _appSettings.CloudinaryDefaultFolder);
        }

        public ImageUploadResult UploadAvatar(string fileName, Stream stream)
        {
            return _Upload(fileName, stream, _appSettings.CloudinaryAvatarFolder);
        }
    }
}
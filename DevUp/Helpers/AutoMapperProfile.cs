using AutoMapper;
using DevUp.Dtos;
using DevUp.Models;

namespace DevUp.Helpers
{
    public class AutoMapperProfile : Profile
    {
        // mappings between model and entity objects
        public AutoMapperProfile()
        {
            CreateMap<UserRegisterDto, ApplicationUser>();
            CreateMap<UserUpdateDto, ApplicationUser>();
            CreateMap<ApplicationUser, UserUpdateDto>();
            CreateMap<ApplicationUser, UserResponse>();
            CreateMap<ApplicationUser, UserProfileResponse>();

            CreateMap<QuizCreateDto, Quiz>();
            CreateMap<Quiz, QuizResponseDto>();
            CreateMap<QuizUpdateDto, Quiz>();

            CreateMap<QuizQuestionCreateDto, QuizQuestion>();
            CreateMap<QuizQuestion, QuizQuestionResponseDto>();
            CreateMap<QuizQuestionUpdateDto, QuizQuestion>();

            CreateMap<ArticleCreateDto, Article>().ForMember(dest => dest.Tags, opt => opt.Ignore());
            CreateMap<Article, ArticleResponseDto>()
                .ForMember(dest =>
                    dest.ReadingListCount,
                    opt => opt.MapFrom(src => src.ReadingLists.Count))
                .ForMember(dest =>
                    dest.LikedCount,
                    opt => opt.MapFrom(src => src.UserLikeArticles.Count));
            CreateMap<ArticleResponseDto, Article>();
            CreateMap<ArticleUpdateDto, Article>().ForMember(dest => dest.Tags, opt => opt.Ignore());

            CreateMap<TagCreateDto, Tag>();
            CreateMap<Tag, TagResponseDto>()
                .ForMember(dest =>
                dest.PostCount,
                opt => opt.MapFrom(src => src.Articles.Count));
            CreateMap<TagResponseDto, Tag>();
            CreateMap<TagUpdateDto, Tag>();

            CreateMap<CommentCreateDto, Comment>();
            CreateMap<Comment, CommentResponseDto>()
                .ForMember(dest =>
                        dest.LikedCount,
                    opt => opt.MapFrom(src => src.UserLikeComments.Count));
            CreateMap<CommentUpdateDto, Comment>();

            //CreateMap<UpdateRequest, Account>()
            //    .ForAllMembers(x => x.Condition(
            //        (src, dest, prop) =>
            //        {
            //            // ignore null & empty string properties
            //            if (prop == null) return false;
            //            if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;

            //            // ignore null role
            //            if (x.DestinationMember.Name == "Role" && src.Role == null) return false;

            //            return true;
            //        }
            //    ));
        }
    }
}
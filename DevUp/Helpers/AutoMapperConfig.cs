using AutoMapper;

namespace DevUp.Helpers
{
    public class AutoMapperConfig
    {
        public static IMapper Initialize()
        {
            var mapperConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new AutoMapperProfile());
            });
            return mapperConfig.CreateMapper();
        }
    }
}

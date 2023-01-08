using Autofac;
using DevUp.Helpers;
using Microsoft.AspNetCore.StaticFiles;

namespace DevUp
{
    public class DevUpModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(typeof(DevUpModule).Assembly)
                .WithPublicConstructors()
                .AsDefaultInterface()
                .AsSelf();

            builder.RegisterType<FileExtensionContentTypeProvider>().As<IContentTypeProvider>().InstancePerLifetimeScope();

            builder.RegisterType<MemoryCacheClient>().As<ICacheClient>();

        }
    }
}

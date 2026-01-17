using System;
using System.Reflection;

namespace Api.Repositories;

public static class RepositoriesBuilder
{
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        var repos = Assembly.GetExecutingAssembly().GetTypes().Where(w => w.Name.Contains("Repository", StringComparison.OrdinalIgnoreCase));
        foreach (var resp in repos)
        {
            services.AddTransient(resp);
        }
        return services;
    }
}

using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Api.Utils;

public class CorsPolicy
{
    public string Name { get; set; }
    public string[] Origins { get; set; }
    public string[] Methods { get; set; }
    public string[] Headers { get; set; }
}

public static class AppSettingsCorsBuilder
{
    public static IServiceCollection AddCorsFromSettings(this IServiceCollection services,
        List<CorsPolicy> corsPolicies)
    {
        services.AddCors((options) =>
        {
            foreach (var corsPolicy in corsPolicies)
            {
                options.AddPolicy(corsPolicy.Name, policy =>
                {
                    switch (corsPolicy.Origins)
                    {
                        case ["Any"]:
                            policy.AllowAnyOrigin();
                            break;
                        case { Length: > 0 }:
                            policy.WithOrigins(corsPolicy.Origins);
                            break;
                    }

                    switch (corsPolicy.Methods)
                    {
                        case ["Any"]:
                            policy.AllowAnyMethod();
                            break;
                        case { Length: > 0 }:
                            policy.WithMethods(corsPolicy.Methods);
                            break;
                    }

                    switch (corsPolicy.Headers)
                    {
                        case ["Any"]:
                            policy.AllowAnyHeader();
                            break;
                        case { Length: > 0 }:
                            policy.WithHeaders(corsPolicy.Methods);
                            break;
                    }
                });
            }
        });
        return services;
    }

    public static IApplicationBuilder UseCorsFromSettings(this IApplicationBuilder builder)
    {
        var corsPolicies = builder.ApplicationServices.GetService<IConfiguration>().GetSection("Cors")
            .Get<List<CorsPolicy>>();

        foreach (var corsPolicy in corsPolicies)
        {
            builder.UseCors(corsPolicy.Name);
        }
        return builder;
    }
}
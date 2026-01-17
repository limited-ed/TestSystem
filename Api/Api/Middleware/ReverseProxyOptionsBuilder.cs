using System;

namespace Api.Middleware;

public static class ReverseProxyOptionsBuilder
{
    public static IServiceCollection AddReverseProxyOpyions(this IServiceCollection services, Action<ReverseProxyOptions> options)
    {
        var opt = new ReverseProxyOptions();
        services.AddTransient<ReverseProxyOptions>(servicePtovider =>
        {
            options(opt);
            return opt;
        });
        return services;
    }

}

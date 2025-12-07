using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Api.Authorization;
using Api.Data;
using Api.Middleware;
using Api.Middleware.ReverseProxyApplication;
using Api.Repositories;
using Api.SeedData;
using Api.Spa;
using Api.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
var configuration = builder.Configuration;

var provider = configuration.GetSection("Data:Provider").Value;
var connectionString = configuration.GetSection($"Data:{provider}").Value;
builder.Services.AddDbContext<DataContext>(options => _ = provider switch
{
    "SQLite" => options.UseSqlite(connectionString, o => o.MigrationsAssembly("Api.SQLite")),
    "PostgreSQL" => options.UseNpgsql(connectionString, o => o.MigrationsAssembly("Api.PostgreSQL")),
    _ => throw new Exception($"Unsupported provider: {provider}")
});
builder.Services.AddControllers().AddJsonOptions(o =>
{
    o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    o.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
    o.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    o.JsonSerializerOptions.WriteIndented = true;
    o.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
}).ConfigureApiBehaviorOptions(o =>
{
    o.SuppressModelStateInvalidFilter = true;
});

var publicKeyFilename = configuration.GetSection("JWTKey:PublicKey").Value;
if (string.IsNullOrWhiteSpace(publicKeyFilename))
{
    throw new Exception($"Missing JWTKey:PublicKey in appsettings.json");
}
var publicKey = System.IO.File.ReadAllText(publicKeyFilename);
var rsa = RSA.Create(1024);
rsa.ImportFromPem(publicKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidAudience = builder.Configuration["JWTKey:ValidAudience"],
        ValidIssuer = builder.Configuration["JWTKey:ValidIssuer"],
        ClockSkew = TimeSpan.Zero,
        IssuerSigningKey = new RsaSecurityKey(rsa),
    };
});
builder.Services.AddTransient<JwtUtils>();
builder.Services.Configure<JWTKey>(options =>
    {
        var conf = builder.Configuration.GetSection("JWTKey").Get<JWTKey>();
        options.TokenExpiryTimeInHour = conf.TokenExpiryTimeInHour;
        options.ValidAudience = conf.ValidAudience;
        options.ValidIssuer = conf.ValidIssuer;
        options.PrivateKey = conf.PrivateKey;
        options.PublicKey = conf.PublicKey;
    }
);
builder.Services.AddAuthorization(options => { });
builder.Services.AddRepositories();
builder.Services.AddHostedService<NodeBackgroundService>();
var corsPolicies = builder.Configuration.GetSection("Cors").Get<List<CorsPolicy>>();
builder.Services.AddCorsFromSettings(corsPolicies);
    
var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<DataContext>();
    context.Database.Migrate();

    await context.SeedData();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{

}

app.UseCorsFromSettings();

//app.UseHttpsRedirection();

app.UseAuthorization();
//app.UseReverseProxy();
app.MapControllers();


app.Run();
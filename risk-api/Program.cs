using System.Collections.Concurrent;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using risk.Database;
using risk.Database.Models;
using risk.Services;
using risk.SignalR;

var builder = WebApplication.CreateBuilder(args);

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.Development.json")
    .Build();

var connectionString = configuration.GetConnectionString("DB_CONNECTION");

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<UsersDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddDbContext<UsersDbContext>(options => options.UseMySQL(connectionString!));

builder.Services.AddMvc().AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null);

builder.Services.AddControllersWithViews();

builder.Services.AddSingleton<ConcurrentDictionary<string, CancellationTokenSource>>();
builder.Services.AddSingleton<ConcurrentDictionary<string, string>>();
builder.Services.AddSingleton<ConcurrentDictionary<Guid, List<List<Territory?>>>>();

builder.Services.AddTransient<EmailService>();
builder.Services.AddTransient<IMatchmakingService, MatchmakingService>();
builder.Services.AddSingleton<IGameBoardService, GameBoardService>();

builder.Services.AddSignalR();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(options => options
    .WithOrigins("http://localhost:3000", "http://localhost:3001")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());
app.UseAuthorization();

app.MapControllers();
app.MapHub<GameHub>("/gamehub");

app.Run();
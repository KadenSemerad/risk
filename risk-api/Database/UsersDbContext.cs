using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using risk.Database.Models;


namespace risk.Database;

public class UsersDbContext : IdentityDbContext<User>
{
    public UsersDbContext(DbContextOptions<UsersDbContext> options)
        : base(options)
    {
    }

    public DbSet<Friend> Friends { get; set; }

    public DbSet<UserStats> UserStats { get; set; }

    public DbSet<Game> Games { get; set; }
}
using exambackend.Models;
using Microsoft.EntityFrameworkCore;

namespace exambackend.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<QCM> QCMs { get; set; }
        public DbSet<Question> Questions { get; set; }

        public DbSet<Response> Responses { get; set; } 
      

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }

}

using exambackend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuration des services
builder.Services.AddControllers();

// 2. Ajout du DbContext (Entity Framework Core)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Configuration de CORS pour autoriser les requêtes depuis le frontend React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// 4. Configuration du pipeline HTTP

// Redirection HTTPS (important pour la production)
app.UseHttpsRedirection();

// Autorise les requêtes CORS depuis votre frontend
app.UseCors("AllowReactApp");

// Système d'autorisation
app.UseAuthorization();

// Mappage des contrôleurs
app.MapControllers();

app.Run();
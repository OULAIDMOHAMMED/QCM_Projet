using exambackend.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
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
            .AllowAnyHeader()
            .AllowCredentials());
});




builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "Auth.Cookie";
        options.LoginPath = "/api/auth/login";
        options.LogoutPath = "/api/auth/logout";
        options.ExpireTimeSpan = TimeSpan.FromMinutes(2); // Durée de vie du cookie
        options.SlidingExpiration = false; // Pas de renouvellement automatique
        options.Cookie.HttpOnly = true; // Protection contre XSS
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // HTTPS seulement
        options.Cookie.SameSite = SameSiteMode.Lax; // Protection CSRF
    });

var app = builder.Build();

// Redirection HTTPS (important pour la production)
app.UseHttpsRedirection();

// Autorise les requêtes CORS depuis votre frontend
app.UseCors("AllowReactApp");

app.UseAuthentication();
// Système d'autorisation
app.UseAuthorization();

// Mappage des contrôleurs
app.MapControllers();

app.Run();
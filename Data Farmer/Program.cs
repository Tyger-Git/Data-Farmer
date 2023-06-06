var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Add middleware to serve static files
app.UseStaticFiles();

// Setup a default route that serves your index.html
app.MapFallbackToFile("login.html");

app.Run();
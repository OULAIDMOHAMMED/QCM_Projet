namespace exambackend.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string name { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required string Role { get; set; }
    }
}
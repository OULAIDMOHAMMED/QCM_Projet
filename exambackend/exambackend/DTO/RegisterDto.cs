namespace exambackend.DTO
{
    public class RegisterDto
    {
        public required string name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; }
    }
}

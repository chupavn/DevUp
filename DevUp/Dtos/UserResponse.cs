using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Dtos
{
    public class UserResponse
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime? RegistrationDate { get; set; }
        public DateTime? BirthDay { get; set; }
        public string? Bio { get; set; }
        public string? Work { get; set; }
        public string? Location { get; set; }
        public string? Education { get; set; }
        public string? AvatarUrl { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
    }
}

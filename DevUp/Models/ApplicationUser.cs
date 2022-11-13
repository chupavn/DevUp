using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using Microsoft.AspNetCore.Identity;

namespace DevUp.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        [MaxLength(20)]
        public string? Language { get; set; }
        public DateTime? LastLoginTime { get; set; }
        public DateTime? RegistrationDate { get; set; }
        public DateTime? BirthDay { get; set; }
        public string? Bio { get; set; }
        public string? Work { get; set; }
        public string? Location { get; set; }
        public string? Education { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime? Deleted { get; set; }
    }

    public class ApplicationRole : IdentityRole
    {
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Dtos
{
    public class UserUpdateDto
    {
        [Required]
        public string Name { get; set; }
        public string AvatarUrl { get; set; }
        public DateTime? BirthDay { get; set; }
        public DateTime? LastLogin { get; set; }
    }
}

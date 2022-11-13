using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Dtos
{
    public class UserProfileResponse: UserResponse
    {
        public int ArticleCount { get; set; }
        public int CommentCount { get; set; }

    }
}

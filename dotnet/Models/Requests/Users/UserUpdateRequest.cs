using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Requests.Users
{
    public class UserUpdateRequest
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mi { get; set; }
        public int Yob { get; set; }
        public string AvatarUrl { get; set; }
    }
}

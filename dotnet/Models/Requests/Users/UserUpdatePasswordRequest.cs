using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Requests.Users
{
    public class UserUpdatePasswordRequest
    {
        public string Token { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class UserAuth
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public List<LookUp> Roles { get; set; }
    }
}

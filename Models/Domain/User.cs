using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class User : UserDetail
    {
        public int YOB { get; set; }
        public Boolean IsConfirmed { get; set; }
        public LookUp UserStatus { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public List<LookUp> Roles { get; set; }

    }
}

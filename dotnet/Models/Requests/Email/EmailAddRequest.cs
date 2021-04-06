using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.Email
{
    public class EmailAddRequest
    {
        [Required]
        public string From { get; set; }
        [Required]
        [EmailAddress]
        public string To { get; set; }
        [Required]
        public string Subject { get; set; }
        [Required]
        public string Body { get; set; }

    }
}

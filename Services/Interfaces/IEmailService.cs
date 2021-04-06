using Sabio.Models.Requests;
using Sabio.Models.Requests.Email;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
   public interface IEmailService
    {
        Task SendEmail(SendGridMessage msg);

        Task SampleEmail(EmailAddRequest email);

        Task SendRegistrationConfirmation(string email, string firstName, string token);

        Task SendPasswordResetEmail(string email, string token);

    }
}


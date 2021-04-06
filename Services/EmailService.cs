using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using Sabio.Data.Providers;
using Sabio.Models.AppSettings;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Email;
using Sabio.Services.Interfaces;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class EmailService : IEmailService
    {
        private AppKeys _appKeys;
        private IWebHostEnvironment _env;

        public EmailService(IOptions<AppKeys> appKeys, IWebHostEnvironment env)
        {
            _appKeys = appKeys.Value;
            _env = env;
        }

        public  async Task SendEmail(SendGridMessage msg)
        {
            var client = new SendGridClient(_appKeys.SendGridAppKey);
            var response = await client.SendEmailAsync(msg);

        }

        public async Task SampleEmail(EmailAddRequest emailModel)
        {

            string filePath = this.GetTestTemplate();
            SendGridMessage msg = new SendGridMessage();
            msg.From = new EmailAddress(emailModel.From);
            msg.HtmlContent = System.IO.File.ReadAllText(filePath);
            msg.Subject = emailModel.Subject;
            msg.PlainTextContent = emailModel.Body;
            msg.AddTo(emailModel.To);
            await SendEmail(msg);

        }

        public async Task SendRegistrationConfirmation(string email, string firstName, string token)
        {
            SendGridMessage msg = new SendGridMessage();
            
            msg.From = new EmailAddress("v2q2h8z7w6j0y6o1@sabionation.slack.com");
            msg.HtmlContent = GetRegistrationConfTemplate(token, firstName);
            msg.Subject = "Welcome to Host a Fan!";
            msg.AddTo(email);
            await SendEmail(msg);

        }

        public async Task SendPasswordResetEmail(string email, string token)
        {
            SendGridMessage msg = new SendGridMessage();

            msg.From = new EmailAddress("v2q2h8z7w6j0y6o1@sabionation.slack.com");
            msg.HtmlContent = GetPasswordResetTemplate(token, email);
            msg.Subject = "Password Reset";
            msg.AddTo(email);
            await SendEmail(msg);

        }

        private string GetTestTemplate()
        {
            return  _env.WebRootPath + "/EmailTemplates/ExampleEmail.html";
        }

        private string GetRegistrationConfTemplate(string token, string firstName)
        {
            string filePath = _env.WebRootPath + "/EmailTemplates/RegistrationConfirmation.html";
            string htmlContent = System.IO.File.ReadAllText(filePath);
            htmlContent = htmlContent.Replace("{{$Token}}", token).Replace("{{Name}}", firstName).Replace("{{HostAFanDomain}}", _appKeys.HostAFanDomain);
            return htmlContent;
        }

        private string GetPasswordResetTemplate(string token, string email)
        {
            string filePath = _env.WebRootPath + "/EmailTemplates/PasswordReset.html";
            string htmlContent = System.IO.File.ReadAllText(filePath);
            htmlContent = htmlContent.Replace("{{$Token}}", token).Replace("{{Email}}", email).Replace("{{HostAFanDomain}}", "https://localhost:3000/");
            return htmlContent;
        }

    }

}


namespace Services
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

        public async Task SendPasswordResetEmail(string email, string token)
        {
            SendGridMessage msg = new SendGridMessage();

            msg.From = new EmailAddress("v2q2h8z7w6j0y6o1@sabionation.slack.com");
            msg.HtmlContent = GetPasswordResetTemplate(token, email);
            msg.Subject = "Password Reset";
            msg.AddTo(email);
            await SendEmail(msg);
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

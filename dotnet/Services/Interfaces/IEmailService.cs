
namespace Services.Interfaces
{
   public interface IEmailService
    {
        Task SendEmail(SendGridMessage msg);

        Task SendPasswordResetEmail(string email, string token);

    }
}


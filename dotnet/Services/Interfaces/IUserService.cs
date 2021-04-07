
namespace Services
{
    public interface IUserService
    {
        int InsertToken(string token, int id, int tokenType);

        void VerifyToken(string token);

        bool VerifyTokenResetPassword(string token, string password);

        int GetUserIdByEmail(string email);

        int GetUserIdByToken(string token);

        void UpdatePassword(int id, string password, string confirmPassword);

        void UpdateUser(UserUpdateRequest model);
    }
}

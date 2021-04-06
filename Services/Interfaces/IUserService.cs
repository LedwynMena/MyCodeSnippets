using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Users;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public interface IUserService
    {
        int Create(object userModel);

        int RegisterUser(UserAddRequest model);

        int InsertToken(string token, int id, int tokenType);

        void VerifyToken(string token);

        bool VerifyTokenResetPassword(string token, string password);

        Paged<User> GetAllByPagination(int pageIndex, int pageSize);

        Paged<User> SearchUsers(int pageIndex, int pageSize, string query);

        Paged<User> SearchByRole(int pageIndex, int pageSize, string role);

        Paged<User> SearchByStatus(int pageIndex, int pageSize, string status);

        void UpdateStatus(UserUpdateStatusRequest model);

        UserAuth Login(UserLoginRequest model);

        UserAuth GetByEmail(string email);

        int GetUserIdByEmail(string email);

        int GetUserIdByToken(string token);

        void UpdatePassword(int id, string password, string confirmPassword);

        void UpdateUser(UserUpdateRequest model);

        User GetById(int id);

        Task<bool> LogInAsync(string email, string password);

        Task<bool> LogInTest(string email, string password, int id, string[] roles = null);
    }
}
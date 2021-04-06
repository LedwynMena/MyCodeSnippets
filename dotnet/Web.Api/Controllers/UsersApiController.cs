using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Enums;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Users;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersApiController : BaseApiController
    {
        private IUserService _service = null;
        private IAuthenticationService<int> _authService = null;
        private IEmailService _emailService = null;
        public UsersApiController(IUserService service
            , IEmailService emailService
            , ILogger<UsersApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
            _emailService = emailService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<int>> Register(UserAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int id = _service.RegisterUser(model);

                if (id > 0)
                {
                    string token = Guid.NewGuid().ToString();
                    int tokenType = (int)TokenType.NewUser;

                    _service.InsertToken(token, id, tokenType);

                    _emailService.SendRegistrationConfirmation(model.Email, model.FirstName, token);

                    ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                    result = Created201(response);
                }
                else 
                {
                    BaseResponse response = new ErrorResponse("Something went wrong. User not registered.");
                    result = StatusCode(404, response);
                }

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<User>>> GetAllByPagination(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<User> page = _service.GetAllByPagination(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Users not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<User>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<User>>> SearchUsers(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<User> page = _service.SearchUsers(pageIndex, pageSize, query);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Users not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<User>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("roles")]
        public ActionResult<ItemResponse<Paged<User>>> SearchByRole(int pageIndex, int pageSize, string role)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<User> page = _service.SearchByRole(pageIndex, pageSize, role);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Users with that role not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<User>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("status")]
        public ActionResult<ItemResponse<Paged<User>>> SearchByStatus(int pageIndex, int pageSize, string status)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<User> page = _service.SearchByStatus(pageIndex, pageSize, status);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Status not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<User>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }


        [HttpPut("statusupdate")]
        public ActionResult<SuccessResponse> UpdateStatus(UserUpdateStatusRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.UpdateStatus(model);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);

        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<ItemResponse<bool>>> Login(UserLoginRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                UserAuth currentUser = null;

                currentUser = _service.Login(model);

                if (currentUser != null)
                {
                    var userRoles = currentUser.Roles.Select(x => x.Name).ToArray();

                    IUserAuthData authUser = new UserBase
                    {
                        Id = currentUser.Id,
                        Name = currentUser.Email,
                        Roles = userRoles,
                        TenantId = "123ABC"
                    };

                    Claim fullName = new Claim("CustomClaim", "Host a Fan");
                    await _authService.LogInAsync(authUser, new Claim[] { fullName });

                    response = new SuccessResponse();
                }
                else
                {
                    code = 404;
                    response = new ErrorResponse("Incorrect email or password.");
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpPut("{token}")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<SuccessResponse>> VerifyToken(string token)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.VerifyToken(token);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("current")]
        public ActionResult<ItemResponse<IUserAuthData>> GetCurrentUser()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                IUserAuthData currentUser = _authService.GetCurrentUser();

                if(currentUser != null)
                {
                    int id = currentUser.Id;
                    User user = _service.GetById(id);
                   
                    response = new ItemResponse<User> { Item = user };

                }
                else
                {
                    code = 404;
                    response = new ErrorResponse("Current user not found.");
                    
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("logout")]
        public async Task<ActionResult<SuccessResponse>> LogoutAsync()
        {
            await _authService.LogOutAsync();
            SuccessResponse response = new SuccessResponse();
            return Ok200(response);
        }

        [HttpGet("forgotpassword/{email}")]
        [AllowAnonymous]
        public ActionResult<SuccessResponse> GetUserIdByEmail(string email)
        {
            int iCode = 200;
            BaseResponse response = null;
            int userId = 0;

            try
            {
                userId = _service.GetUserIdByEmail(email);

                if (userId > 0 )
                {
                    string token = Guid.NewGuid().ToString();
                    int tokenType = (int)TokenType.ResetPassword;

                    _service.InsertToken(token, userId, tokenType);

                   _emailService.SendPasswordResetEmail(email, token);

                    response = new SuccessResponse();
                }
                else
                {
                    iCode = 404;
                    response = new ErrorResponse("User account with this email not found.");
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ ex.Message }");
            }

            return StatusCode(iCode, response);
        }

        [HttpPut("updatepassword")]
        [AllowAnonymous]
        public ActionResult<SuccessResponse> ResetPassword(int id, UserUpdatePasswordRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int userId = _service.GetUserIdByToken(model.Token);

                if (userId > 0)
                {
                    bool successful = _service.VerifyTokenResetPassword(model.Token, model.Password);

                    if (successful)
                    {
                        response = new SuccessResponse();
                    }
                    else
                    {
                        iCode = 404;
                        response = new ErrorResponse("Could not locate UserId with this token");
                    }
                }
                else
                {
                     IUserAuthData currentUser = _authService.GetCurrentUser();

                        if (currentUser != null)
                        {
                            id = currentUser.Id;

                            _service.UpdatePassword(id, model.Password, model.ConfirmPassword);

                            response = new SuccessResponse();
                        }
                        else
                        {
                            iCode = 404;
                            response = new ErrorResponse("Could not locate UserId");
                        }
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ ex.Message }");
            }

            return StatusCode(iCode, response);
        }

        [HttpPut("updateuser")]
        public ActionResult<SuccessResponse> UpdateUser(UserUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.UpdateUser(model);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);

        }

    }
}

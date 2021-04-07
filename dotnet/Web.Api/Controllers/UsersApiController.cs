

namespace Web.Api.Controllers
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

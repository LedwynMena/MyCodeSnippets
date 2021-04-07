
namespace Web.Api.Controllers
{
    [Route("api/comments")]
    [ApiController]
    public class CommentApiController : BaseApiController
    {
        private ICommentService _service = null;
        private IAuthenticationService<int> _authService = null;
        public CommentApiController(ICommentService service
            , ILogger<CommentApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service; 
            _authService = authService;
        }


        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(CommentAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }

            return result;
        }


        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(CommentUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Update(model);

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
        public ActionResult<ItemsResponse<Comment>> Get()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                List<Comment> comments = _service.Get(userId); 

                if (comments == null)
                {
                    code = 404;
                    response = new ErrorResponse("Could not find comments matching search criteria.");
                }
                else
                {
                    response = new ItemsResponse<Comment> { Items = comments };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ ex.Message }");
            }

            return StatusCode(code, response);
        }


        [HttpGet("{entityId:int}/{entityTypeId:int}")]
        public ActionResult<ItemsResponse<Comment>> GetByEntity(int entityId, int entityTypeId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<Comment> comments = _service.GetByEntity(entityId, entityTypeId); 

                if (comments == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Could not find comments matching search criteria.");
                }
                else
                {
                    response = new ItemsResponse<Comment> { Items = comments };
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


        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> DeleteStatus(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.DeleteStatus(id);

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


namespace Services
{
    public interface ICommentService
    {
        int Add(CommentAddRequest model, int userId);
        void Update(CommentUpdateRequest model);
        List<Comment> Get(int createdBy);
        List<Comment> GetByEntity(int entityId, int entityTypeId);
        void DeleteStatus(int id);

    }
}

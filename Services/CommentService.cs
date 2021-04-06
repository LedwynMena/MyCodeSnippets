using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Comments;
using Sabio.Services.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace Sabio.Services
{
    public class CommentService : ICommentService
    {
        IDataProvider _data = null;
        IAuthenticationService<int> _authService = null;
        IUserDetailMapper _userDetailMapper = null;
        public CommentService(IDataProvider data, IAuthenticationService<int> authService, IUserDetailMapper userDetailMapper)
        {
            _data = data;
            _authService = authService;
            _userDetailMapper = userDetailMapper;
        }

        public int Add(CommentAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Comments_Insert]";
            _data.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection col)
            {
                MapAddWithValue(model, col);
                col.AddWithValue("@CreatedBy", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;

                int.TryParse(oId.ToString(), out id);
            });

            return id;
        }


        public void Update(CommentUpdateRequest model)
        {
            string procName = "[dbo].[Comments_Update]";
            _data.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection col)
            {
                MapAddWithValue(model, col);
                col.AddWithValue("@Id", model.Id);
            },
            returnParameters: null);
        }


        public static IEnumerable<Comment> BuildTree(Comment current, List<Comment> allItems)
        {
            var childs = allItems.Where(c => c.ParentId == current.Id).ToArray();
            foreach (var child in childs)
                child.Replies = (Comment[])BuildTree(child, allItems);
            current.Replies = childs;
            return childs;
        }


        public List<Comment> Get(int createdBy)
        {
            string procName = "[dbo].[Comments_Select_ByCreatedBy]";

            List<Comment> list = null;
            Comment root = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@CreatedBy", createdBy);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Comment comment = MapComment(reader, ref startingIndex);
                AddComment(ref list, ref root, comment);
            }
            );
            return list;
        }


        public void DeleteStatus(int id)
        {
            string procName = "[dbo].[Comments_Update_Status]";
            _data.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            },
            returnParameters: null);
        }


        public List<Comment> GetByEntity(int entityId, int entityTypeId)
        {
            string procName = "[dbo].[Comments_Select_ByEntityId]";

            List<Comment> list = null;
            Comment root = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@EntityId", entityId);
                paramCollection.AddWithValue("@EntityTypeId", entityTypeId);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Comment comment = MapComment(reader, ref startingIndex);
                AddComment(ref list, ref root, comment);
            }
            );

            return list;
        }

        private static void AddComment(ref List<Comment> list, ref Comment root, Comment comment)
        {
            if (list == null)
            {
                list = new List<Comment>();
            }
            if (root == null)
            {
                root = new Comment();
            }
            list.Add(comment);

            BuildTree(root, list);
        }

        public Comment MapComment(IDataReader reader, ref int index)
        {
            Comment aComment = new Comment();
            List<Comment> list = new List<Comment>();
            aComment.Replies = (Comment[])BuildTree(aComment, list);

            aComment.Id = reader.GetSafeInt32(index++);
            aComment.Subject = reader.GetSafeString(index++);
            aComment.Text = reader.GetSafeString(index++);
            aComment.ParentId = reader.GetSafeInt32(index++);
            aComment.EntityTypeId = reader.GetSafeInt32(index++);
            aComment.EntityId = reader.GetSafeInt32(index++);
            aComment.DateCreated = reader.GetDateTime(index++);
            aComment.DateModified = reader.GetDateTime(index++);
            aComment.CreatedBy = _userDetailMapper.MapUserDetail(reader, ref index);
            aComment.IsDeleted = reader.GetSafeBool(index++);

            return aComment;
        }


        public static void MapAddWithValue(CommentAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Subject", model.Subject);
            col.AddWithValue("@Text", model.Text);
            col.AddWithValue("@ParentId", model.ParentId);
            col.AddWithValue("@EntityTypeId", model.EntityTypeId);
            col.AddWithValue("@EntityId", model.EntityId);
        }

    }

}

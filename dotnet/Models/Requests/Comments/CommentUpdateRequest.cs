using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Requests.Comments
{
    public class CommentUpdateRequest : CommentAddRequest, IModelIdentifier
    {
        public int Id { get; set; }
    }
}

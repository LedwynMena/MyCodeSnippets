import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardContent, Button } from "@material-ui/core";

function CommentReply(props) {
  const aReply = props.comment;
  const currentUser = props.currentUser;

  const handleEditShow = () => {
    props.handleEditReplyShow(aReply)
  }

  return (
    <Card className="m-5">
      <CardContent className="p-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="text-warning font-size-lg">
            <FontAwesomeIcon icon={["fas", "star"]} />
            <FontAwesomeIcon icon={["fas", "star"]} />
            <FontAwesomeIcon icon={["fas", "star"]} />
            <FontAwesomeIcon icon={["fas", "star"]} />
            <FontAwesomeIcon icon={["fas", "star-half-alt"]} />
          </div>
          <div>
            <FontAwesomeIcon
              icon={["fas", "quote-right"]}
              className="text-dark font-size-xxl"
            />
          </div>
        </div>
        <blockquote className="mb-3 mt-2 font-weight-bold text-black-200 blockquote">
          {aReply.subject}
        </blockquote>
        <blockquote className="mb-3 mt-2 font-size-lg text-black-200 blockquote">
          {aReply.text}
        </blockquote>
        <div className="align-box-row">
          <div className="avatar-icon-wrapper avatar-icon-lg">
            <div className="avatar-icon rounded-circle">
              <img src={aReply.createdBy.avatarUrl} alt="..." />
            </div>
          </div>
          <div className="pl-2">
            <span className="d-block font-size-lg">
              {aReply.createdBy.firstName} {aReply.createdBy.mi ? `${aReply.createdBy.mi}. ` : " "}
              {aReply.createdBy.lastName}
              <small className="d-block text-black-50">
                {aReply.createdBy.email}
              </small>
            </span>
            {aReply.replies.length > 0 && (
              <FontAwesomeIcon
                icon={["fas", "comment-dots"]}
                className="font-size-xxl"
              />
            )}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
        {aReply.createdBy.id === currentUser.id && <Button
    type="submit"
    color="primary"
    variant="contained"
    className="text-white bg-amy-crisp m-2"
    size="large"
    onClick={handleEditShow}
  >
    {" "} Edit &nbsp;
    <FontAwesomeIcon icon={["fa", "edit"]} />{" "}
  </Button>}
              </div>
      </CardContent>
    </Card>
  );
}

CommentReply.propTypes = {
  handleEditReplyShow: PropTypes.func,
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    subject: PropTypes.string,
    text: PropTypes.string.isRequired,
    parentId: PropTypes.number.isRequired,
    createdBy: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string,
      email: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired,
    }).isRequired,
    replies: CommentReply.comment,
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    mi: PropTypes.string,
    email: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default CommentReply;

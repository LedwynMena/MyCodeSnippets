import React, { Fragment } from "react";
import PropTypes from "prop-types";
import CommentReply from "./CommentReply";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardContent, Button } from "@material-ui/core";

const CommentSingle = (props) => {
  const aComment = props.comment;
  const currentUser = props.currentUser;

  const handleShow = () => {
    props.handleShow(aComment.id);
  };

  const handleEditShow = () => {
    props.handleEditShow(aComment)
  }

  const handleEditReplyShow = (aComment) => {
    props.handleEditShow(aComment)
  }

  const mapReplies = (reply) => <CommentReply currentUser={currentUser} key={reply.id} comment={reply} handleEditReplyShow={handleEditReplyShow} />;

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-center">
        <Card className="m-5 bg-light " style={{ width: "55rem" }}>
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
              {aComment.subject}
            </blockquote>
            <blockquote className="mb-3 mt-2 font-size-lg text-black-200 blockquote">
              {aComment.text}
            </blockquote>
            <div className="align-box-row">
              <div className="avatar-icon-wrapper avatar-icon-lg">
                <div className="avatar-icon rounded-circle">
                  <img src={aComment.createdBy.avatarUrl} alt="..." />
                </div>
              </div>
              <div className="pl-2">
                <span className="d-block font-size-lg">
                  {aComment.createdBy.firstName} {aComment.createdBy.mi ? `${aComment.createdBy.mi}. ` : " "}
                  {aComment.createdBy.lastName}
                  <small className="d-block text-black-50">
                    {aComment.createdBy.email}
                  </small>
                </span>
                {aComment.replies.length > 0 && (
                  <FontAwesomeIcon
                    icon={["fas", "comment-dots"]}
                    className="font-size-xxl"
                  />
                )}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              {aComment.createdBy.id === currentUser.id && <Button
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
              <Button
                type="submit"
                color="primary"
                className="text-white bg-plum-plate m-2"
                variant="contained"
                size="large"
                onClick={handleShow}
              >
                {" "}
                Reply &nbsp;
                <FontAwesomeIcon icon={["fa", "reply"]} />
              </Button>
            </div>
            {aComment.replies.length > 0 && aComment.replies.map(mapReplies)}
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
};

CommentSingle.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    subject: PropTypes.string,
    text: PropTypes.string.isRequired,
    parentId: PropTypes.number,
    createdBy: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string,
      email: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired,
    }).isRequired,
    
    replies: CommentSingle.comment,
  }),
 currentUser: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    mi: PropTypes.string,
    email: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  }).isRequired,
  handleShow: PropTypes.func,
  handleEditShow: PropTypes.func,
};

export default CommentSingle;

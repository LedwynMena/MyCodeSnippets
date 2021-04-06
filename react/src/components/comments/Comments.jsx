import React, { Fragment } from "react";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import CommentSingle from "./CommentSingle";
import * as commentService from "../../services/commentService";
import hero3 from "../../assets/images/hero-bg/hero-3.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Button } from "@material-ui/core";
import { Card, CardContent, TextField } from "@material-ui/core";
import { Formik, Form } from "formik";
import { AddCommentSchema } from "../../schemas/commentSchema";
import Modal from "./Modal";
import toast from "toastr";

const formData = {
  id: "",
  subject: "",
  text: "",
  parentId: 0,
  entityTypeId: 1,
  entityId: 1,
}

const _logger = debug.extend("Comments");
class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData,
      open: false,
      replyParentId: 0,
      commentId: 0,
    };
  }

  componentDidMount() {
    commentService
      .getComments(this.state.formData.entityId, this.state.formData.entityTypeId)
      .then(this.onGetCommentsSuccess)
      .catch(this.onGetCommentsError);
  }

  onGetCommentsSuccess = (response) => {
    let parents = response.items.filter((c) => c.parentId === 0);
    this.setState({
        mappedComments: parents.map(this.mapComment),
        formData,
    });
  };

  handleChange = (event) => {
    const target = event.target;
    const name = target.name;

    this.setState((prevState) => {
      const formData = { ...prevState.formData, [name]: value };

      return { formData: formData };
    });
  };

  handleSubmit = (values, { resetForm }) => {
    const newComment = values; 
    newComment.createdBy =  this.props.currentUser;
    newComment.replies = []

    if(this.state.commentId > 0)
    {
      newComment.id = this.state.commentId
      commentService
      .editComment(newComment, this.state.commentId)
      .then(this.onEditCommentSuccess(newComment))
      .catch(this.onEditCommentError)
    } else {
    commentService
      .addComment(newComment)
      .then((response) => {
        newComment.id = response.item;
        return newComment;
      })
      .then(this.onAddCommentSuccess)
      .then(() => resetForm())
      .catch(this.onAddCommentError);
  }
};

  onAddCommentSuccess = (comment) => {
    toast.success("Successfully added comment!");

    this.setState(
      (prevState) => {
        const mappedComments = [...prevState.mappedComments];
        let newComment = this.mapComment(comment);
        comment.parentId = prevState.replyParentId;

        if (prevState.replyParentId > 0) {
          let indexOfParentComment = mappedComments.findIndex(
            (aComment) => Number(aComment.key) === comment.parentId
          );

          let parentCommentComp = mappedComments[indexOfParentComment];
          let parentComment = parentCommentComp.props.comment;
          parentComment.replies.unshift(comment);

          newComment = this.mapComment(parentComment);
          mappedComments[indexOfParentComment] = newComment;
        } else {
          mappedComments.unshift(newComment);
        }
        return {
          ...prevState,
          mappedComments,
          formData,
          open: false,
          replyParentId: 0,
          commentId: 0
        }
  }
  );
  }

  onEditCommentSuccess = (comment) => {
    toast.success("Successfully edited comment!");
    
    this.setState(
      (prevState) => {
         const mappedComments = [...prevState.mappedComments];
         let editedCommentObj = this.mapComment(comment)

         if (prevState.formData.parentId > 0) {
          let indexOfParentComment = mappedComments.findIndex(
            (aComment) => Number(aComment.key) === comment.parentId
          );

          let parentCommentComp = mappedComments[indexOfParentComment];
          let parentComment = parentCommentComp.props.comment;
            
          let indexOfReplyComment = parentComment.replies.findIndex(
            (aComment) => Number(aComment.id) === comment.id
          )
          
          parentComment.replies[indexOfReplyComment] = comment
          editedCommentObj = this.mapComment(parentComment)
          mappedComments[indexOfParentComment] = editedCommentObj;
         }
        else{
         let indexOfEditedComment = mappedComments.findIndex(
           (aComment) => Number(aComment.key) === comment.id
         );
          mappedComments[indexOfEditedComment] = editedCommentObj
        }
        return{
          ...prevState,
          mappedComments,
          formData,
          open: false,
          replyParentId: 0,
          commentId: 0
        }
      }
      
      );
  }

  handleClose = () => {
    this.setState({
      formData,
      open: false,
      replyParentId: 0,
      commentId: 0
        });
  };

  handleShow = (replyParentId) => {
    this.setState({
      replyParentId,
      open: true,
    });
  };

  handleEditShow = (comment) => {
    this.setState({
      formData: comment,
      commentId: comment.id,
      open: true,
    });
  };

  onGetCommentsError = () => {
    _logger("Could not retrieve comments");
  };

  onAddCommentError = () => {
    _logger("Could not add comment");
  };

  onEditCommentError = () => {
    _logger("Could not edit comment")
  }

  mapComment = (aComment) => {
    return (
      <CommentSingle
        key={aComment.id}
        comment={aComment}
        handleShow={this.handleShow}
        handleEditShow={this.handleEditShow}
        currentUser={this.props.currentUser}
      />
    );
  };

  render() {
    return (
      <Fragment>
        <Container className="py-5">
          <Formik
            enableReinitialize={true}
            validationSchema={AddCommentSchema}
            initialValues={this.state.formData}
            onSubmit={this.handleSubmit}
            onChange={this.handleChange}
          >
            {(props) => {
              const {
                values,
                touched,
                errors,
                handleSubmit,
                isValid,
                isSubmitting,
                handleChange,
                handleBlur,
              } = props;
              return (
                <div className="hero-wrapper bg-composed-wrapper bg-midnight-bloom pt-5">
                  <div className="flex-grow-1 w-100 d-flex align-items-center">
                    <div
                      className="bg-composed-wrapper--image"
                      style={{ backgroundImage: "url(" + hero3 + ")" }}
                    />
                    <div className="bg-composed-wrapper--bg bg-primary opacity-2" />
                    <div className="bg-composed-wrapper--content py-5">
                      <Container>
                        <div className="text-white text-center">
                          <h1 className="display-2 mb-2 px-4 font-weight-bold">
                            Comments
                          </h1>
                          <h3 className="font-size-lg line-height-md font-weight-medium d-block mb-0 text-white-50">
                            Here you can read and share your thoughts or
                            feedback with a comment, or even reply to an
                            existing comment!
                          </h3>
                        </div>
                        <Container>
                              <Form
                                onSubmit={handleSubmit}
                                onChange={handleChange}
                                className={"col-md-6 pt-4"}
                                style={{ margin: "40px " }}
                              >
                                <div>
                                  <label>
                                    <h5 className="text-white text-center display-2 mb-2 px-4 font-weight-medium">
                                      We just need a few details to add a
                                      Comment!
                                    </h5>
                                  </label>
                                </div>
                                <Card className="m-4 bg-light ">
                                  <CardContent className="p-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div className="text-warning font-size-lg">
                                        <FontAwesomeIcon
                                          icon={["fas", "star"]}
                                        />
                                        <FontAwesomeIcon
                                          icon={["fas", "star"]}
                                        />
                                        <FontAwesomeIcon
                                          icon={["fas", "star"]}
                                        />
                                        <FontAwesomeIcon
                                          icon={["fas", "star"]}
                                        />
                                        <FontAwesomeIcon
                                          icon={["fas", "star-half-alt"]}
                                        />
                                      </div>
                                      <div>
                                        <FontAwesomeIcon
                                          icon={["fas", "quote-right"]}
                                          className="text-dark font-size-xxl"
                                        />
                                      </div>
                                    </div>
                                    <blockquote className="my-3 text-black-200 blockquote">
                                      <div
                                        className="font-size-xxl"
                                        style={{ marginRight: "10px" }}
                                      >
                                        Subject
                                      </div>
                                      <TextField
                                        name="subject"
                                        values={values.subject}
                                        placeholder="Ex: Location"
                                        fullWidth
                                        className="m-2"
                                        id="standard-multiline-flexible"
                                      />
                                    </blockquote>
                                    <blockquote className="my-3 text-black-200 blockquote">
                                      <div
                                        className="font-size-xxl"
                                        style={{ marginRight: "10px" }}
                                      >
                                        Text{" "}
                                      </div>
                                      <TextField
                                        name="text"
                                        values={values.text}
                                        placeholder="Ex: Loved the area!"
                                        fullWidth
                                        className="m-2"
                                        id="standard-multiline-flexible"
                                        multiline
                                        onBlur={handleBlur}
                                        rowsMax="5"
                                        onChange={handleChange}
                                      />
                                      {errors.text && touched.text && (
                                        <span className="input-feedback text-danger">
                                          {errors.text}
                                        </span>
                                      )}
                                    </blockquote>
                                  </CardContent>
                                </Card>
                                <Button
                                  type="submit"
                                  color="primary"
                                  disabled={!isValid || isSubmitting}
                                  variant="contained"
                                  size="large"
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "60px",
                                  }}
                                >
                                  Add Comment
                                </Button>
                              </Form>
                          <div className="row  ">
                            {this.state.mappedComments}
                          </div>
                        </Container>
                      </Container>
                    </div>
                  </div>
                </div>
              );
            }}
          </Formik>
          <div>
            {this.state.open && (
              <Modal
                handleSubmit={this.handleSubmit}
                handleChange={this.handleChange}
                handleShow={this.handleShow}
                handleEditShow={this.handleEditShow}
                handleClose={this.handleClose}
                open={this.state.open}
                commentId={this.state.commentId}
                formData={this.state.formData}
              ></Modal>
            )}
          </div>
        </Container>
      </Fragment>
    );
  }
}

Comments.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    mi: PropTypes.string,
    email: PropTypes.string,
    avatarUrl: PropTypes.string,
  })
}

export default Comments;

import React, {Fragment} from "react";
import PropTypes from "prop-types";
 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 import {
   Dialog,
   Button,
   TextField,
   Card,
   CardContent,
 } from "@material-ui/core";
 import { Formik, Form } from "formik";
 import { AddCommentSchema } from "../../schemas/commentSchema";

const Modal = (props) => {

  const handleSubmit = (values, resetForm) => {
    props.handleSubmit(values, resetForm);
  };

  const handleChange = (event) => {
    props.handleChange(event);
  };

  const open = props.open;
  const formData = props.formData;
  const commentId = props.commentId;

  const handleClose = () => {
    props.handleClose();
  };

  return (
    <Fragment>
      <Dialog open={open} onClose={handleClose}>
      <Formik
          enableReinitialize={true}
          validationSchema={AddCommentSchema}
          initialValues={formData}
          onSubmit={handleSubmit}
          onChange={handleChange}
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
                    <Form
                      onSubmit={handleSubmit}
                      onChange={handleChange}
                      className="bg-light d-flex align-items-center justify-content-center"
                    >
                      <Card className="m-3" style={{ width: "6000px" }}>
                        <CardContent className="p-3" >
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="text-warning font-size-lg">
                              <FontAwesomeIcon icon={["fas", "star"]} />
                              <FontAwesomeIcon icon={["fas", "star"]} />
                              <FontAwesomeIcon icon={["fas", "star"]} />
                              <FontAwesomeIcon icon={["fas", "star"]} />
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
                          </div>{
                              commentId > 0 && !formData.parentId &&
                              <blockquote className="my-3 text-black-200 blockquote">
                              <div
                                className="font-size-xxl"
                                style={{ marginRight: "10px" }}
                              >
                                Subject
                              </div>
                              <TextField
                                name="subject"
                                onChange={handleChange}
                                value={values.subject}
                                placeholder="Ex: Location"
                                fullWidth
                                className="m-2"
                                id="standard-multiline-flexible"
                              />
                            </blockquote>
                          }
                          <blockquote className="my-3 text-black-200 blockquote">
                            <div
                              className="font-size-xxl"
                              style={{ marginRight: "10px" }}
                            >
                              Text{" "}
                            </div>
                            <TextField
                              name="text"
                              value={values.text}
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
                          <div style={{ textAlign: "right" }}>
                  <Button
                    type="button"
                    color="primary"
                    className="text-white bg-warning m-2"
                    variant="contained"
                    size="large"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    color="primary"
                    className="text-white bg-plum-plate m-2"
                    variant="contained"
                    size="large"
                    disabled={!isValid || isSubmitting}
                  >
                  {commentId > 0 ? "Edit Comment" : "Add reply"}
                  </Button>
                </div>
                        </CardContent>
                      </Card>
                    </Form>
            );
          }}
        </Formik>
      </Dialog>
    </Fragment>
   );
 };

 Modal.propTypes = {
   handleSubmit: PropTypes.func,
   handleChange: PropTypes.func,
   handleClose: PropTypes.func,
   open: PropTypes.bool,
   commentId: PropTypes.number,
   formData: PropTypes.shape({
     parentId: PropTypes.number
   }),
   handleBlur: PropTypes.func,
   values: PropTypes.shape({
    subject: PropTypes.string,
     text: PropTypes.string.isRequired,
   }),
   errors: PropTypes.shape({
     text: PropTypes.string,
   }),
  touched: PropTypes.shape({
     text: PropTypes.string,
   }),
   isValid: PropTypes.bool,
   isSubmitting: PropTypes.bool,
 };

export default Modal;

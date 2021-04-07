import React, { Fragment } from 'react';
import PropTypes from "prop-types";
import { resetPassword } from "../../services/userService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  InputAdornment,
  IconButton,
  Card,
  Button,
  Tooltip,
  TextField
} from '@material-ui/core';
import hero3 from '../../assets/images/hero-bg/hero-3.jpg';
import { NavLink as RouterLink } from 'react-router-dom';
import { ResetPasswordSchema } from "../../schemas/resetPasswordSchema";
import { Formik, Form } from "formik";
import toast from "toastr";
import debug from "debug";

const _logger = debug.extend("PasswordReset");

class PasswordReset extends React.Component {
    constructor(props){
        super(props);
        this.state = {
             formData: {
                password: "",
                confirmPassword: "",
                token: props.location.search.slice(7)
            },
        }
    }
    
handleSubmit = (values) => {
    resetPassword(values)
        .then(this.onResetPasswordSuccess)
        .catch(this.onResetPasswordError)
}
    
onResetPasswordSuccess = () => {
    toast.success("Successfully reset password!");

    if(this.props.currentUser.id)
    {
    this.props.history.push("/user/settings")
    } else {
    this.props.history.push("/register?view=login")
    }
}

onResetPasswordError = (response) => {
   toast.error("Sorry, could not reset password succcessfully")    
   _logger("Could not make ajax call", response)    
}

render(){
  return (
    <Fragment>
      <div className="app-wrapper bg-white">
        <div className="app-main">
          <Button
            size="large"
            color="secondary"
            variant="contained"
            className="text-white btn-go-back"
            component={RouterLink}
            to="/register?view=login">
            <span className="btn-wrapper--icon">
              <FontAwesomeIcon icon={['fas', 'arrow-left']} />
            </span>
            <span className="btn-wrapper--label">Back to Log In</span>
          </Button>
          {this.props.currentUser.id && 
          <Button
          size="large"
          color="secondary"
          style={{marginTop: "50px"}}
          variant="contained"
          className="text-white btn-go-back"
          component={RouterLink}
          to="/user/settings">
          <span className="btn-wrapper--icon">
            <FontAwesomeIcon icon={['fas', 'arrow-left']} />
          </span>
          <span className="btn-wrapper--label">Back to Profile Settings</span>
        </Button>}
          <div className="app-content p-0">
            <div className="app-inner-content-layout--main">
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--content">
                  <div className="hero-wrapper bg-composed-wrapper bg-arielle-smile min-vh-100">
                    <div className="flex-grow-1 w-100 d-flex align-items-center">
                      <div
                        className="bg-composed-wrapper--image"
                        style={{ backgroundImage: 'url(' + hero3 + ')' }}
                      />
                      <div className="bg-composed-wrapper--bg bg-night-sky opacity-5" />
                      <div className="bg-composed-wrapper--content text-center py-5">
                        <Grid
                          item
                          xl={5}
                          lg={6}
                          md={10}
                          sm={12}
                          className="mx-auto text-center text-white">
                          <h1 className="display-2 mb-3 px-4 font-weight-bold">
                            Reset Password
                          </h1>
                          <h3 className="font-size-lg line-height-sm font-weight-bold d-block px-3 mb-5 text-white-50">
                            Create your new password below and re-enter it to
                            confirm.
                          </h3>
                          <Formik
          enableReinitialize={true}
          validationSchema={ResetPasswordSchema}
          initialValues={this.state.formData}
          onSubmit={this.handleSubmit}
        >
          {(formikProps) => {
            const {
              values,
              touched,
              errors,
              handleSubmit,
              isValid,
              isSubmitting,
              handleChange,
              handleBlur,
            } = formikProps;
            return (
                    <Form
                      onSubmit={handleSubmit}
                      onChange={handleChange}
                    >
                          <Card className="p-5 mx-5 text-center">
                            <TextField
                              name="password"
                              type="password"
                              value={values.password}
                              fullWidth
                              className="mt-0"
                              placeholder="Enter New Password"
                              margin="dense"
                              variant="outlined"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.password && Boolean(errors.password)}
                              helperText={touched.password && errors.password}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FontAwesomeIcon icon={['fas', 'unlock-alt']} />
                                  </InputAdornment>
                                )
                              }}
                            />
                            <TextField
                              name="confirmPassword"
                              type="password"
                              value={values.confirmPassword}
                              fullWidth
                              className="mt-0"
                              placeholder="Confirm New Password"
                              margin="dense"
                              variant="outlined"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                              helperText={touched.confirmPassword && errors.confirmPassword}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FontAwesomeIcon icon={['fas', 'unlock-alt']} />
                                  </InputAdornment>
                                )
                              }}
                            />
                            <Button
                              variant="contained"
                              className="mt-4"
                              size="large"
                              color="primary"
                              type="submit"
                              disabled={!isValid || isSubmitting}
                              >
                              <span className="btn-wrapper--label">
                                Reset Password
                              </span>
                            </Button>
                          </Card>
                          </Form>
            );
          }}
        </Formik>
                        </Grid>
                      </div>
                    </div>
                    <div className="hero-footer pb-4">
                      <Tooltip arrow title="Facebook">
                        <IconButton
                          color="inherit"
                          size="medium"
                          variant="outlined"
                          className="text-white-50">
                          <FontAwesomeIcon
                            icon={['fab', 'facebook']}
                            className="font-size-md"
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip arrow title="Twitter">
                        <IconButton
                          color="inherit"
                          size="medium"
                          variant="outlined"
                          className="text-white-50">
                          <FontAwesomeIcon
                            icon={['fab', 'twitter']}
                            className="font-size-md"
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip arrow title="Google">
                        <IconButton
                          color="inherit"
                          size="medium"
                          variant="outlined"
                          className="text-white-50">
                          <FontAwesomeIcon
                            icon={['fab', 'google']}
                            className="font-size-md"
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip arrow title="Instagram">
                        <IconButton
                          color="inherit"
                          size="medium"
                          variant="outlined"
                          className="text-white-50">
                          <FontAwesomeIcon
                            icon={['fab', 'instagram']}
                            className="font-size-md"
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
}

PasswordReset.propTypes = {
    location: PropTypes.shape({
        search: PropTypes.string
    }),
    history: PropTypes.shape({
        push: PropTypes.func
    }),
    values: PropTypes.shape({
      password: PropTypes.string.isRequired,
      confirmPassword: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
    }),
    currentUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }),
  };

  export default PasswordReset;

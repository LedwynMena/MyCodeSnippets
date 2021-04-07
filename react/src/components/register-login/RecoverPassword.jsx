import React, { Fragment } from 'react';
import PropTypes from "prop-types";
import { getByEmail } from "../../services/userService";
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
import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';
import hero3 from '../../assets/images/hero-bg/hero-3.jpg';
import { NavLink as RouterLink } from 'react-router-dom';
import { RecoverPasswordSchema } from "../../schemas/recoverPasswordSchema";
import { Formik, Form } from "formik";
import toast from "toastr";
import debug from "debug";

const _logger = debug.extend("RecoverPassword");

export default function RecoverPassword() {
    const formData = {
        email: "",
    }

    const onResetPasswordClicked = (values) => {
    getByEmail(values.email)
        .then(onGetByEmailSuccess)
        .catch(onGetByEmailError)
    }
    
   const onGetByEmailSuccess = () => {
    toast.success("Successfully sent password reset request to this email!");
   }

 const onGetByEmailError = () => {
   _logger("Could not find user with this email")    
   }

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
                            Recover Password
                          </h1>
                          <h3 className="font-size-lg line-height-sm font-weight-medium d-block px-3 mb-5 text-white-50">
                            Enter your email address and we will
                            send you a link to reset your password.
                          </h3>
                          <Formik
          enableReinitialize={true}
          validationSchema={RecoverPasswordSchema}
          initialValues={formData}
          onSubmit={onResetPasswordClicked}
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
                    >
                          <Card className="p-5 mx-5 text-center">
                            <TextField
                              name="email"
                              value={values.email}
                              fullWidth
                              className="mt-0"
                              margin="dense"
                              variant="outlined"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.email && Boolean(errors.email)}
                              helperText={touched.email && errors.email}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <MailOutlineTwoToneIcon />
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

RecoverPassword.propTypes = {
    handleSubmit: PropTypes.func,
    handleChange: PropTypes.func,
    handleClose: PropTypes.func,
    handleBlur: PropTypes.func,
    values: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }),
    errors: PropTypes.shape({
        email: PropTypes.string,
    }),
   touched: PropTypes.shape({
    email: PropTypes.string,
    }),
    isValid: PropTypes.bool,
    isSubmitting: PropTypes.bool,
  };

import React, { Fragment } from 'react'
import PropTypes from "prop-types";
import { updateUser } from "../../services/userService";
import { Formik, Form } from "formik";
import { ProfileSettingsSchema } from "../../schemas/profileSettingsSchema";
import hero3 from '../../assets/images/hero-bg/hero-3.jpg';
import {
Grid,
Container,
Card,
CardContent,
Divider,
Button,
TextField,
  } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import FileUpload from "../FileUpload";
import toast from "toastr";
import debug from "debug";

const _logger = debug.extend("ProfileSettings");

class ProfileSettings extends React.Component {
    constructor(props){
    super(props);
    this.state = {
        profileSettingsFormData: {
            id: 0,
            firstName: "", 
            lastName: "",
            mi: "",
            yob: "",
            avatarUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            },
    }
}

componentDidMount () {
    if (this.props.currentUser.id > 0)
    { this.setState(()=>{
        return{
            profileSettingsFormData: {
                id: this.props.currentUser.id,
                firstName: this.props.currentUser.firstName, 
                lastName: this.props.currentUser.lastName,
                mi: this.props.currentUser.mi ? this.props.currentUser.mi : "",
                yob: this.props.currentUser.yob ? this.props.currentUser.yob : "",
                avatarUrl: this.props.currentUser.avatarUrl ? this.props.currentUser.avatarUrl : 
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                }
            }
    })
}
}

onUpdateProfileSubmit = (values) => {
    _logger(values)
    updateUser(values)
    .then(this.onUpdateUserSuccess)
    .catch(this.onUpdateUserError)
}

onUpdateUserSuccess = () => {
toast.success("Successfully updated profile!");
}

onUpdateUserError = (response) => {
toast.error("Sorry, the update was unsuccessful");
_logger("Could not update user", response)    
}

updateUrl = (response, setFieldValue) => {
    setFieldValue("avatarUrl", response[0]);
};

render(){

return (
    <Fragment>
        <div className="app-wrapper bg-white">
        <div className="app-main">
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
            <div className="mx-auto text-center text-white">
            <h1 className="display-2 mb-3 px-4 font-weight-bold">
            Update Profile
            </h1>
            <h3 className="font-size-lg line-height-sm font-weight-bold d-block px-3 mb-5 text-white-50">
            Here you can confirm or update profile details.
            </h3>
            </div>
            <Grid
            item
            xs={12}
            md={8}
            lg={7}
            className="d-flex align-items-center"
        >
            <Container maxWidth="sm">
            <div className="pt-5 pb-4">
            <Formik
                enableReinitialize={true}
                initialValues={this.state.profileSettingsFormData}
                validationSchema={ProfileSettingsSchema}
                onSubmit={this.onUpdateProfileSubmit}
                className="bg-light"
            >
                {(formikProps) => {
                const {
                    values,
                    touched,
                    errors,
                    setFieldValue,
                    handleSubmit,
                    handleChange,
                    isSubmitting,
                    handleBlur,
                } = formikProps;
                return (
                    <Card className="m-4 bg-light ">
                        <CardContent className="p-3">
                    <Form onSubmit={handleSubmit} >
                    <div className="avatar-icon-wrapper avatar-icon-lg" style={{ margin: "15px" }}>
                        <div className="avatar-icon rounded-circle">
                        <img src={values.avatarUrl} />
                        </div>
                    </div>
                        <div
                        style={{ marginBottom: "15px" }}
                        className="font-size-lg font-weight-bold"
                        >
                        Upload an image to update your profile photo!
                        <Divider className="my-4" />
                        <FileUpload
                        isMultiple={false}
                        updateUrl={(response) =>
                            this.updateUrl(response, setFieldValue)
                            }
                        ></FileUpload>
                        </div>
                    <div
                        style={{
                        display: "inline-flex",
                        width: "100%",
                        }}
                    >
                        <div className="mb-3 mr-4" style={{ width: "60%" }}>
                        <TextField
                            fullWidth
                            value={values.firstName}
                            id="outlined-basic"
                            label="First Name"
                            variant="outlined"
                            name="firstName"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.firstName && Boolean(errors.firstName)}
                            helperText={touched.firstName && errors.firstName}
                        />
                        </div>
                        </div>
                        <div
                        style={{
                        display: "inline-flex",
                        width: "100%",
                        }}
                    >
                        <div className="mb-3" style={{ width: "40%" }}>
                        <TextField
                            fullWidth
                            value={values.mi}
                            id="outlined-basic"
                            label="Middle Initial"
                            name="mi"
                            variant="outlined"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.mi && Boolean(errors.mi)}
                            helperText={touched.mi && errors.mi}
                        />
                        </div>
                    </div>
                        <div
                        style={{
                        display: "inline-flex",
                        width: "100%",
                        }}
                    >
                        <div className="mb-3 mr-4" style={{ width: "60%" }}>
                        <TextField
                            fullWidth
                            value={values.lastName}
                            id="outlined-basic"
                            label="Last Name"
                            variant="outlined"
                            name="lastName"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.lastName && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                        />
                        </div>
                        </div>
                    <div
                        style={{
                        display: "inline-flex",
                        width: "100%",
                        }}
                    >
                        <div className="mb-3 mr-4" style={{ width: "40%" }}>
                        <TextField
                            fullWidth
                            value={values.yob}
                            id="outlined-basic"
                            label="Year of Birth"
                            variant="outlined"
                            name="yob"
                            type="number"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.yob && Boolean(errors.yob)}
                            helperText={touched.yob && errors.yob}
                        />
                        </div>
                    </div>
                    <div className="text-center" style={{margin: "25px"}}>
                        <NavLink to="/passwordreset" >Click Here To Update Password</NavLink>
                        </div>
                    <div className="form-group pt-2 mb-4">
                        By clicking the <strong>Update Profile</strong> button below you
                        acknowledge the changes will be applied to your profile.
                    </div>
                    <Button
                        color="primary"
                        size="large"
                        variant="contained"
                        className="text-white bg-plum-plate mb-4"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        Update Profile
                    </Button>
                    </Form>
                    </CardContent>
                    </Card>
                );
                }}
            </Formik>
            </div>
                </Container>
                </Grid>
                </div>
                </div>
                </div>
                </div>
                </div>
                </div>
                </div>
                </div>
            </div>
        </Fragment>
)
    }
}

ProfileSettings.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        mi: PropTypes.string,
        email: PropTypes.string.isRequired,
        yob: PropTypes.number,
        avatarUrl: PropTypes.string,
        roles: PropTypes.shape[{
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired
        }]
})
};

export default ProfileSettings;

import * as Yup from "yup";

export const ResetPasswordSchema = Yup.object({
    password: Yup.string()
    .max(100, "Password must be 100 characters or less")
    .required("Required")
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Must contain at least 8 characters, including one lowercase, uppercase, and special character."
    ),
  confirmPassword: Yup.string()
    .max(100, "Password must be 100 characters or less")
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

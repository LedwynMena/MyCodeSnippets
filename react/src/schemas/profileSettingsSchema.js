import * as Yup from "yup";

const currentYear = new Date().getFullYear();
export const ProfileSettingsSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must be 100 characters or less.")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must be 100 characters or less.")
    .required("Required"),
  mi: Yup.string().max(2, "Middle initial cannot be more than 2 characters."),
  yob: Yup.number("Must be a number.")
    .min(1900, "Must be greater than 1899.")
    .max(currentYear, "Year cannot be in the future.")
    .typeError("Required"),
  avatarUrl: Yup.string(),
});

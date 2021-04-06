import * as Yup from "yup";

export const RecoverPasswordSchema = Yup.object({
  email: Yup.string().email("A valid email is required.").required("Required"),
});

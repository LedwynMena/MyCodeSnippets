import * as Yup from "yup";

const AddCommentSchema = Yup.object().shape({
    text: Yup.string().required("Required").max(3000, 'Maximum of 3000 characters'),
  });

  export {AddCommentSchema};
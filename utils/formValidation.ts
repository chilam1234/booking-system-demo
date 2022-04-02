import * as yup from "yup";

const ErrorMsg = {
  required: "This field is required",
};

export const validationsSchema = yup
  .object({
    room: yup.string().required(),
    remarks: yup.string().max(100),
    start: yup.date().typeError(ErrorMsg.required).required(),
    end: yup
      .date()
      .typeError(ErrorMsg.required)
      .required()
      .min(yup.ref("start"), "End Time must be later than start"),
  })
  .required();

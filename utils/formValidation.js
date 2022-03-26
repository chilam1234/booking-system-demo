import * as yup from 'yup'

export const validationsSchema = yup
  .object({
    room: yup.string().required(),
    remarks: yup.string().max(100),
    start: yup.date().required(),
    end: yup
      .date()
      .required()
      .min(yup.ref('start'), 'End must later than start'),
  })
  .required()

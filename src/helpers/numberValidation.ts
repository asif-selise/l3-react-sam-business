export const numberValidation = (
  minimum: number,
  validationMessage: string,
  requiredMessage: string
) => ({
  required: requiredMessage,
  pattern: {
    value: /^[0-9]+$/,
    message: validationMessage,
  },
  min: {
    value: minimum,
    message: validationMessage,
  },
});

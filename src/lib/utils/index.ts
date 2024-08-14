export function convertErrorZodResultToMsgArray(result: any) {
  let errorMessages: string[] = [];

  const errors = result.error.flatten().fieldErrors;

  // if (errors.name && errors.name.length > 0) {
  //   errorMessages = [ ...errorMessages, ...errors.name ];
  // }
  // if (errors.email && errors.email.length > 0) {
  //   errorMessages = [ ...errorMessages, ...errors.email ];
  // }
  // if (errors.password && errors.password.length > 0) {
  //   errorMessages = [ ...errorMessages, ...errors.password ];
  // }

  for (const [fieldName, fieldErrors] of Object.entries(errors) as any) {
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      errorMessages = [...errorMessages, ...fieldErrors];
    }
  }

  return errorMessages;
}




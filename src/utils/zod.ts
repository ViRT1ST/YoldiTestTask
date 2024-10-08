export function convertErrorZodResultToMsgArray(result: any) {
  let errorMessages: string[] = [];

  const errors = result.error.flatten().fieldErrors;

  for (const [fieldName, fieldErrors] of Object.entries(errors) as any) {
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      errorMessages = [...errorMessages, ...fieldErrors];
    }
  }

  return errorMessages;
}


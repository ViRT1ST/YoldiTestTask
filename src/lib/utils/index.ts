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

export function makeUserProviderStamp(provider: string, authEmail: string) {
  let providerStamp = '';

  switch (provider) {
    case 'google':
      providerStamp = 'Пользователь Google';
      break;
    case 'github':
      providerStamp = 'Пользователь GitHub';
      break;
    case 'credentials':
      providerStamp = authEmail || '';
      break;
  }

  return providerStamp;
};

export function classesBeautify(classes: string) {
  return classes.replace(/\s+/g, ' ').trim();
};

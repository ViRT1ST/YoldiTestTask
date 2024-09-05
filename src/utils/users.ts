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

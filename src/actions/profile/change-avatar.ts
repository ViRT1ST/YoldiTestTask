'use server';

import { changeProfileImage } from './change-image';

export async function changeProfileAvatar(formData: FormData) {
  await changeProfileImage({ formData, imageToChange: 'avatar' });
}

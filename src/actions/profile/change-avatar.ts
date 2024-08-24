'use server';

import { changeProfileImage } from '@/actions/profile/change-image';

export async function changeProfileAvatar(formData: FormData) {
  await changeProfileImage({ formData, imageToChange: 'avatar' });
}

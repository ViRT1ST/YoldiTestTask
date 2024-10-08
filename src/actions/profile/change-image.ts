'use server';

import { redirect } from 'next/navigation';

import type {
  SessionWithBaseData,
  SessionWithUpdateData,
  ErrorForRedirect
} from '@/types';
import { auth, unstable_update } from '@/lib/next-auth';
import cloudinary from '@/lib/cloudinary';
import pg from '@/lib/postgres/queries';

type Props = {
  formData: FormData;
  imageToChange: 'avatar' | 'cover';
};

export async function changeProfileImage({ formData, imageToChange }: Props) {
  const session = await auth() as SessionWithBaseData | null;
  const sessionUser = session?.user;
  const sessionUuid = sessionUser?.uuid;

  const image = formData.get('file') as File;

  let returnError: ErrorForRedirect = null;

  if (!image) {
    returnError = { message: 'Incorrect image', code: 400 };
  }

  // 2097152 is 2MB
  if (image?.size > 2097152) {
    returnError = { message: 'Image size must be less than 2MB', code: 400 };
  }

  const dbQuery = imageToChange === 'avatar'
    ? pg.changeProfileAvatar
    : pg.changeProfileCover;

  if (!returnError && sessionUuid && image) {
    try {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);
    
      const imageBase64 = imageData.toString('base64');
  
      // Make request to Cloudinary
       const result = await cloudinary.uploader.upload(
        `data:${image.type};base64,${imageBase64}`,
        { folder: 'portfolio' }
      );
  
      // Save image URL into DB
      const imageUrl = result.secure_url;
      await dbQuery(sessionUuid, imageUrl);

      if (imageToChange === 'avatar') {
        const updateData: SessionWithUpdateData = {
          user: {
            replace_data: {
              ...sessionUser,
              avatar: imageUrl || sessionUser.avatar
            }
          }
        };

        await unstable_update(updateData);
      }

    } catch (error: any) {
      returnError = {
        message: error?.message || 'Unknown error',
        code: error?.code || 500
      };
    }
  }

  const message = returnError?.message;
  const code = returnError?.code;

  const redirectUrl = message && code
    ? `/page/profile?error=${message}&code=${code}`
    : `/page/profile`;

  redirect(redirectUrl);
}





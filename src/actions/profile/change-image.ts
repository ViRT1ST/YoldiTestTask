'use server';

import { redirect } from 'next/navigation';

import type {
  SessionWithBaseData,
  SessionWithUpdateData,
  ErrorForRedirect
} from '@/types';
import { auth, unstable_update } from '@/lib/auth/next-auth';
import cloudinary from '@/lib/cloudinary/config';
import dbQueries from '@/lib/db/queries';

interface ChangeProfileImageProps {
  formData: FormData;
  imageToChange: 'avatar' | 'cover';
}

export async function changeProfileImage({ formData, imageToChange }: ChangeProfileImageProps) {
  const session = await auth() as SessionWithBaseData;
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
    ? dbQueries.changeProfileAvatar
    : dbQueries.changeProfileCover;

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
    ? `/yoldi/profile?error=${message}&code=${code}`
    : `/yoldi/profile`;

  redirect(redirectUrl);
}





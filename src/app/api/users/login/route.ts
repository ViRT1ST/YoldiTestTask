import { successResponse, errorResponse } from '@/lib/backend/responses';
import bcrypt from '@/lib/backend/utils/bcrypt';
import validator from '@/lib/backend/validator';
import pg from '@/lib/backend/postgres';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : POST /api/users/login
Query Params : none
Headers:     : none
Body         : { email, password }
============================================================= */

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    const validEmail = validator.assertEmail(email);
    const validPassword = validator.assertPassword(password);

    const user = await pg.getUserByAuthEmail(validEmail);
    console.log('api user', user);

    if (!user) {
      throw new Error('User not found');
    }

    await bcrypt.checkPassword(validPassword, user.password);

    const data = {
      uuid: user.uuid,
      // credentials_email: user.email,
      name: user.profile_name,
    };

    return successResponse(200, data);

  } catch (error) {
    return errorResponse(error);
  }
};

import { successResponse, errorResponse } from '@/lib/backend/responses';
import validator from '@/lib/backend/validator';
import pg from '@/lib/backend/postgres';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : POST /api/users/
Query Params : none
Headers:     : none
Body         : { email, password }
============================================================= */

export const POST = async (req: Request) => {
  try {
    const { email, password, username } = await req.json();

    const validEmail = validator.assertEmail(email);
    const validPassword = validator.assertPassword(password);
    const validUsername = validator.assertString(username);

    await pg.createUserByAuthEmail(validEmail, validPassword, validUsername);
    const user = await pg.getUserByAuthEmail(validEmail);

    // const data = {
    //   uuid: user.uuid,
    //   email: user.email,
    //   username: user.username,
    // };

    return successResponse(200, { OK: true });

  } catch (error) {
    return errorResponse(error);
  }
};

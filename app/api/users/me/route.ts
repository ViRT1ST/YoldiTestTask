import { auth } from '@/lib/auth/next-auth';

import { successResponse, errorResponse } from '@/lib/backend/responses';
import pg from '@/lib/backend/postgres';

export const dynamic = 'force-dynamic';


import { getToken } from 'next-auth/jwt';

/* =============================================================
Endpoint     : GET /api/users/me
Query Params : none
Headers:     : authorization
Body         : none
============================================================= */

export const GET = async (req: Request) => {


  try {
    // Session info
    const session = await auth() as any;

    console.log(session);
    // user: {
    //   name: 'Grogu',
    //   email: 'grogu@gmail.com',
    //   id: 'e69d6716-f22f-4c60-9cee-f5adb1247965'
    // },
    // expires: '2024-05-12T12:16:00.318Z'

    const body = {
      success: true,
      data: {
        username: session.user.name,
        id: session.user.id,
        email: session.user.email
      }
    };

    return Response.json(body, { status: 200 });

  } catch (error) {
    const body = {
      success: false,
      data: null
    };

    return Response.json(body, { status: 500 });
  }
};


// export const GET = auth(async ({ auth }, req) => {
//   console.log('kkkkkkfsdfsdfsdfd----', auth?.user);

//   const token = await getToken({ req });

//   try {
//     const authToken = headers().get('authorization');


//     // const user = await pg.getUserByEmail(authToken);



//     const data = {
//       test: 'ddddd'
//     };


//     return successResponse(200, data);

//   } catch (error) {
//     return errorResponse(error);
//   }
// });

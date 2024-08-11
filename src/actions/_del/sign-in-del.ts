// 'use server';

// import { auth, signIn, unstable_update  } from '@/lib/auth/next-auth';

// export async function signInByGithub() {
//   return signIn('github', {
//     // redirectTo: 'http://localhost:3000/yoldi/profile/fffff',
//     redirect: true,
//   });
// }


// export async function signInByGoogle() {
//   return signIn('google', {
//     // redirectTo: 'http://localhost:3000/yoldi/profile/fffff',
//     redirect: true,
//   });
// }

// export async function signInByCredentials() {
//   return signIn('credentials', {
//     // redirectTo: 'http://localhost:3000/yoldi/profile/fffff',
//     redirect: true,
//   });
// }

// export async function authorizeUser() {

//   await unstable_update({
//     user: { name: 'Serverserver-manEEEE' }
//   });

//   redirect('/debug')
// }
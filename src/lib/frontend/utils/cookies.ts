import Cookies, { CookieSetOptions } from 'universal-cookie';

const daysToExpiration = 89;
const millisecondsToExpiration = daysToExpiration * 24 * 60 * 60 * 1000;

function getCookieOptions() {
  return {
    path: '/',
    sameSite: 'lax',
    expires: new Date(Date.now() + millisecondsToExpiration)
  } as CookieSetOptions;
}

function getCookies() {
  return new Cookies().getAll();
}

function createCookies(obj: object) {
  const cookies = new Cookies();

  Object.entries(obj).forEach(([key, value]) => {
    const cookieOptions = getCookieOptions();
    cookies.set(key, value, cookieOptions);
  });
}

function removeCookies(arr: string[]) {
  const cookies = new Cookies();
  
  arr.forEach((item) => cookies.remove(item, { path: '/' }));
}

export {
  getCookies,
  createCookies,
  removeCookies
};

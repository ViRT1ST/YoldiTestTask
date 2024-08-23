import { twJoin, twMerge } from 'tailwind-merge';
import Link from 'next/link';

import type { DbUser } from '@/types';
import dbQueries from '@/lib/db/queries';
import Avatar from '@/components/yoldi-ui/avatar';
import ContentLimiter from '@/components/body-children/content-limiter';
import { makeUserProviderStamp } from '@/lib/utils';

export default async function AccountList() {
  const dbUsers = await dbQueries.getAllUsers() || [];

  return (
    <ContentLimiter className="flex-col px-[20px]">
      <h1 className={twTitle}>Список аккаунтов</h1>

      {!dbUsers.length ? (
        <p>Нет аккаунтов</p>

      ) : (
        <ul className={twList}>
          {dbUsers.map((user: DbUser) => (
            <li key={user.id} className={twItem}>
              <Link className={twItemContainer} href={`/yoldi/profile/${user.alias_default}`}>

                <Avatar
                  className="w-[50px] h-[50px] ml-[1px]"
                  url={user.avatar}
                  name={user.name}
                  showBorder={true}
                />

                <div className={textContainer}>
                  <div className={twItemName}>
                    {user.name}
                  </div>

                  <div className={twItemProvider}>
                    {makeUserProviderStamp(user.default_auth_provider, user.auth_email)}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

    </ContentLimiter>
  );
}

const twTitle = twJoin(`
  mt-[48px] mb-[28px] text-[30px] font-bold font-medium
`);

const twList = twJoin(`
  flex flex-col
  border-b border-t border-[#E6E6E6]
`);

const twItem = twJoin(`
  w-full
  border-b border-[#E6E6E6] last:border-b-0
  h-[72px] sm:h-[70px] 
`);

const twItemContainer = twJoin(`
  h-full flex flex-row items-center
`);

const textContainer = twJoin(`
  h-full flex grow 
  flex-col sm:flex-row
  justify-center sm:justify-normal
  items-start sm:items-center
`);

const twItemName = twJoin(`
  pl-5 pt-[1px] font-medium
`);

const twItemProvider = twJoin(`
  pl-5 pt-[1px] 
  text-[#838383]
  text-left sm:text-right 
  grow-0 sm:grow
`);
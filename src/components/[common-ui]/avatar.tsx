import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

import { classesBeautify } from '@/lib/utils';

type Props = React.ComponentProps<'div'> & {
  url: string | null | undefined;
  name: string | null | undefined;
  showBorder?: boolean;
};

export default function Avatar({ url, name, showBorder = true, className, ...rest }: Props) {
  const nameFirstLetter = name?.charAt(0) || 'A';

  const classes = twMerge(
    twUserAvatarContainer, className, showBorder && 'border-[#E6E6E6] border-[1px]'
  );

  return (
    <div className={classes} { ...rest }>

      {url ? (
        <Image
          src={url}
          alt="User Avatar"
          className="h-full w-full"
          width={0}
          height={0}
          sizes="100vw"
          priority={true}
        /> 
      ) : (
        <div className={twNameFirstLetter}>
          {nameFirstLetter}
        </div>
      )}
    </div>
  );
}

const twUserAvatarContainer = classesBeautify(`
  w-[50px] h-[50px] flex justify-center items-center
  bg-[#F3F3F3] rounded-full overflow-hidden
`);

const twNameFirstLetter = classesBeautify(`
  w-fill h-full pl-[1px] pt-[1px] flex justify-center items-center
  text-[18px]
`);


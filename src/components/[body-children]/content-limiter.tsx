import { twMerge } from 'tailwind-merge';

type ContentLimiterProps = React.ComponentPropsWithoutRef<'main'>;

export default function ContentLimiter({ children, className, ...rest }: ContentLimiterProps) {
  return (
    <main {...rest} className={twMerge(
      'flex mx-auto w-full min-w-[280px] max-w-[860px] px-[30px]',
      className
    )}>
      {children}
    </main>
  );
}
import { twMerge } from 'tailwind-merge';

type Props = React.ComponentPropsWithoutRef<'main'>;

export default function ContentWrapper({ children, className, ...rest }: Props) {
  return (
    <main {...rest} className={twMerge('flex-grow flex bg-transparent', className)}>
      {children}
    </main>
  );
}
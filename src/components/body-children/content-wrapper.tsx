import { twMerge } from 'tailwind-merge';

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export default function ContentWrapper({
  children, className, ...rest
}: ContentWrapperProps) {
  return (
    <main {...rest} className={twMerge('flex-grow flex bg-transparent', className)}>
      {children}
    </main>
  );
}
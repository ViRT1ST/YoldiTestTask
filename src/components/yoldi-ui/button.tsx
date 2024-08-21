import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  colors?: 'light' | 'dark';
  size?: 'normal' | 'big';
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  [prop: string]: any;
};

export default function Button({
  colors = 'light',
  size = 'normal',
  disabled = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {

  const lightColorsStyles = [
    'text-black',
    'bg-white', 'hover:bg-transaparent',
    'border-[#d4d4d4]', 'hover:border-[#838383]',
  ].join(' ');

  const darkColorsStyles = [
    'text-white',
    'bg-black', 'hover:bg-stone-900',
    'border-black', 'hover:border-black',
  ].join(' ');

  const disabledColorsStyles = [
    colors === 'light' ? 'text-black' : 'text-[#f3f3f3]',
    'bg-[#d4d4d4]', 'hover:bg-[#d4d4d4]',
    'border-[#d4d4d4]', 'hover:border-[#d4d4d4]',
  ].join(' ');

  const normalSizeStyles = 'min-h-[40px] px-[21px] pt-[1px] leading-[26px] gap-[10px]';
  const bigSizeStyles = 'min-h-[50px] pt-[1px] pr-[1px]';

  return (
    <button
      className={twMerge(
        'flex flex-row justify-center items-center',
        'font-inter font-medium border rounded-[5px] cursor-pointer',
        colors === 'light' ? lightColorsStyles : darkColorsStyles,
        size === 'normal' ? normalSizeStyles : bigSizeStyles,
        disabled && disabledColorsStyles,
        className
      )}
      
      disabled={disabled}
      { ...rest }
    >      
      {children}
    </button>
  );
}


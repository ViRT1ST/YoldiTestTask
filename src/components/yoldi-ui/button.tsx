import { twMerge } from 'tailwind-merge';
import { classesBeautify } from '@/lib/utils';

type Props = React.ComponentProps<'button'> & {
  colors?: 'light' | 'dark';
  size?: 'normal' | 'big';
};

export default function Button({
  colors = 'light',
  size = 'normal',
  className,
  children,
  disabled,
  ...rest
}: Props) {

  const commonStyles = `
    flex flex-row justify-center items-center
    font-inter font-medium border rounded-[5px] cursor-pointer
  `;

  const lightColorsStyles = `
    text-black
    bg-white hover:bg-transaparent
    border-[#d4d4d4] hover:border-[#838383]
  `;

  const darkColorsStyles = `
    text-white
    bg-black hover:bg-stone-900
    border-black hover:border-black
  `;

  const disabledColorsStyles = `
    ${colors === 'light' ? 'text-black' : 'text-[#f3f3f3]'}
    bg-[#d4d4d4] hover:bg-[#d4d4d4]
    border-[#d4d4d4] hover:border-[#d4d4d4]
  `;

  const normalSizeStyles = 'min-h-[40px] px-[21px] pt-[1px] leading-[26px] gap-[10px]';
  const bigSizeStyles = 'min-h-[50px] pt-[1px] pr-[1px]';

  const finalStyles = twMerge(
    commonStyles,
    colors === 'light' ? lightColorsStyles : darkColorsStyles,
    size === 'normal' ? normalSizeStyles : bigSizeStyles,
    disabled && disabledColorsStyles,
    className
  );

  return (
    <button className={finalStyles} disabled={disabled} { ...rest }>      
      {children}
    </button>
  );
}


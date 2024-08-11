import clsx from 'clsx';

interface ButtonLargeProps {
  light?: boolean;
  children: React.ReactNode;
  className: string;
  disabled?: boolean;
  [prop: string]: any;
};

export default function ButtonLarge({
  light = false, children, className, disabled, ...rest
}: ButtonLargeProps) {
  
  return (
    <button className={clsx(
      'min-h-[50px] pt-[1px] pr-[1px] cursor-pointer',
      'rounded-[5px] font-inter font-medium',
      !disabled && !light &&
        'bg-black text-white border-0 hover:bg-stone-900',
      !disabled && light &&
        'bg-white text-black border border-[#D4D4D4] hover:border-[#838383]',
      disabled &&
        'bg-[#d4d4d4] text-[#f3f3f3] border-0',
      className
    )}
    disabled={disabled}
    { ...rest }
    >      
      {children}
    </button>
  );
}


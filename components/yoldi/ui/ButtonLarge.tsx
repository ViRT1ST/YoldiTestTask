import tw from 'tailwind-styled-components';

type props = {
  children: React.ReactNode;
  light?: boolean;
  [prop:string]: any;
};

export default function ButtonLarge({ children, light = false, ...rest }: props) {
  return (
    <Button $light={light} {...rest}>      
      {children}
    </Button>
  );
}

const Button = tw.button<({ $light?: boolean })>`
  min-h-[50px] pt-[1px] pr-[1px]
  rounded-[5px]
  font-inter font-medium
  ${(p) => p.$light
    ? 'bg-white text-black border border-black'
    : 'bg-black text-white border-0'
  }
`;
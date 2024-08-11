import tw from 'tailwind-styled-components';

export default function ButtonNormal({
  children,
  ...rest
}: {  
  children: React.ReactNode;
  [prop:string]: any;
}) {
  return (
    <Button {...rest}>      
      {children}
    </Button>
  );
}

const Button = tw.button`
  h-[40px] px-[21px] pt-[1px]
  flex flex-row justify-center items-center gap-[10px]
  border-[#D4D4D4] border-[1px] rounded
  font-inter font-medium leading-[26px]
`;
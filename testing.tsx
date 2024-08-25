import React from 'react';

type Props = React.ComponentProps<'button'>;

export const Button = ({ className, ...rest }: Props) => {
  return (
    <button {...rest} className={`default-classname ${className}`}></button>
  );
};

const Parent = () => {
  return <Button onClick={() => {}} type="button"></Button>;
};

import React from 'react';
import {cva, VariantProps} from 'class-variance-authority';

const switchButtonClass = cva(
  'p-2 text-2xl text-text border-2 rounded-md mx-2',
  {
    variants: {
      state: {
        true: 'border-primary bg-primaryLight',
        false: 'border-disable bg-disableLight',
      },
    },
    defaultVariants: {
      state: false,
    },
  },
);

interface PropsButton {
  name: string;
  onClick: () => void;
}

interface Props extends PropsButton, VariantProps<typeof switchButtonClass> {}

const SwitchButton: React.FC<Props> = ({name, state, onClick}) => {
  return (
    <>
      <button className={switchButtonClass({state})} onClick={onClick}>
        {name}
      </button>
    </>
  );
};

export default SwitchButton;

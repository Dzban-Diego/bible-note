import React, {useState} from 'react';
import {templateType} from '../utils/initAtoms';

type item = {
  id: number;
  text: string;
  value: templateType;
};

interface Props {
  label: string;
  items: item[];
  value: item;
  onChange: (v: item) => void;
}

const Select: React.FC<Props> = ({label, items, value, onChange}) => {
  const [showOptions, setShowOptions] = useState(false);

  const renderList = (items: item[]) => {
    return items.map((item) => (
      <button
        className={
          'relative p-2 text-2xl text-text border-2 rounded-md border-disable bg-disableLight hover:border-primary hover:bg-primaryLight w-full'
        }
        onClick={() => {
          setShowOptions(false)
          onChange(item)
        }}
        key={item.id}>
        {item.text}
      </button>
    ));
  };

  return (
    <div
      className={
        'relative p-2 text-2xl text-text border-2 rounded-md border-disable bg-disableLight hover:border-primary hover:bg-primaryLight mx-2 w-52'
      }>
      <button
        className={'text-white text-text mx-2'}
        onClick={() => setShowOptions(!showOptions)}>
        <label>{label}</label>
        <p>{value.text}</p>
      </button>
      {showOptions && (
        <div className="absolute bg-black rounded left-0">
          {renderList(items)}
        </div>
      )}
    </div>
  );
};

export default Select;

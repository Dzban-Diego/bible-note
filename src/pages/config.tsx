import {NextPage} from 'next';
import React from 'react';
import Config from '../Components/Config';
import SwitchButton from '../Components/SwitchButton';
import {useRouter} from 'next/router';

const ConfigPage: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <SwitchButton name={'wróć'} onClick={() => router.push('/')} />

      <Config isMobile={false} />
    </>
  );
};

export default ConfigPage;

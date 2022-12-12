import React, {useEffect, useState} from 'react';
import {useAtom} from 'jotai';
import SwitchButton from './SwitchButton';
import {
  multiVerseAtom,
  redirectAtom,
  templateAtom,
  templateType,
} from '../utils/initAtoms';
import {ClientOnly} from './ClientOnly';
import {useRouter} from 'next/router';
import Select from './Select';

interface Props {
  isMobile: boolean;
}

const Config: React.FC<Props> = ({isMobile}) => {
  const [redirect, setRedirect] = useAtom(redirectAtom);
  const [multiVerse, setMultiVerse] = useAtom(multiVerseAtom);
  const [template, setTemplate] = useAtom(templateAtom);
  const [templateOption, setTemplateOption] = useState<templateOptinType>({
    id: 1,
    text: 'Markdown',
    value: 'markdown',
  });
  const router = useRouter();

  const templateOptions: templateOptinType[] = [
    {id: 1, text: 'Markdown', value: 'markdown'},
    {id: 2, text: 'Text', value: 'text'},
    {id: 3, text: 'Link', value: 'link'},
    {id: 4, text: 'Link Makdown', value: 'markdown-link'},
  ];

  useEffect(() => {
    if (template) {
      const currentTemplate = templateOptions.find(
        (option) => option.value === template,
      );
      if (currentTemplate) {
        setTemplateOption(currentTemplate);
      }
    }
  }, [template]);

  if (isMobile) {
    return (
      <SwitchButton name={'Opcje'} onClick={() => router.push('/config')} />
    );
  }

  type templateOptinType = {
    id: number;
    text: string;
    value: templateType;
  };

  const handleTemplateChange = (v: templateOptinType) => {
    setTemplateOption(v);
    setTemplate(v.value);
  };

  return (
    <ClientOnly>
      <div className={' w-full flex'}>
        <SwitchButton
          name={'Przekieruj do Biblii'}
          onClick={() => setRedirect(!redirect)}
          state={redirect}
        />
        <SwitchButton
          name={'Kilka wersetów'}
          onClick={() => setMultiVerse(!multiVerse)}
          state={multiVerse}
        />
        <Select
          label={'Wzór'}
          items={templateOptions}
          value={templateOption}
          onChange={(v) => handleTemplateChange(v)}
        />
      </div>
    </ClientOnly>
  );
};

export default Config;

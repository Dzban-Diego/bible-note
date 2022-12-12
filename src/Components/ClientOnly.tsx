import React from 'react';

interface Props {
  children: React.ReactElement;
}

export const ClientOnly: React.FC<Props> = ({children, ...delegated}) => {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
};

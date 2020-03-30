import React from 'react';

interface Props {}
const EmptyLayout: React.FC<Props> = props => {
  return <div>{props.children}</div>;
};
export default EmptyLayout;

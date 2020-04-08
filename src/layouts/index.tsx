import React from 'react';
import BlogLayout from './blog';
import EmptyLayout from './empty';
import CommonLayout from './theme/common';

interface Props {
  location: any;
}
const Layouts: React.FC<Props> = props => {
  const path = props.location.pathname;
  if (['/', '/login', '/register', '/retrieve'].indexOf(path) > -1) {
    return <EmptyLayout {...props} />;
  } else if (['/blog'].indexOf(path) > -1) {
    return <CommonLayout {...props} />;
  }
  return <BlogLayout {...props} />;
};
export default Layouts;

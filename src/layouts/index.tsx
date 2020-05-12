import React from 'react';
import BlogLayout from './blog';
import EmptyLayout from './empty';
import CommonLayout from './theme/common';

interface Props {
  location: any;
}
const Layouts: React.FC<Props> = props => {
  const path = props.location.pathname;
  if (['/blog', '/userCenter', '/editor/ueditorWrap'].indexOf(path) > -1) {
    return <CommonLayout {...props} />;
  } else if (['/myBlog', ''].indexOf(path) > -1) {
    return <BlogLayout {...props} />;
  }
  return <EmptyLayout {...props} />;
};
export default Layouts;

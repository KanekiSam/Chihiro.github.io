import React, { useEffect } from 'react';
import BlogLayout from './blog';
import EmptyLayout from './empty';
import CommonLayout from './theme/common';
import { connect } from 'dva';

interface Props {
  location: any;
  dispatch: any;
}
const Layouts: React.FC<Props> = props => {
  useEffect(() => {
    props.dispatch({ type: 'user/getUserInfo' });
  }, []);
  const path = props.location.pathname;
  if (['/blog', '/userCenter', '/editor/ueditorWrap'].indexOf(path) > -1) {
    return <CommonLayout {...props} />;
  } else if (['/myBlog', ''].indexOf(path) > -1) {
    return <BlogLayout {...props} />;
  }
  return <EmptyLayout {...props} />;
};
export default connect()(Layouts);

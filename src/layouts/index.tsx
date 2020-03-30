import React from 'react';
import BlogLayout from './blog';
import EmptyLayout from './empty';

interface Props {
  location: any;
}
const Layouts: React.FC<Props> = props => {
  const path = props.location.pathname;
  return (
    <div>
      {path == '/' ? <EmptyLayout {...props} /> : <BlogLayout {...props} />}
    </div>
  );
};
export default Layouts;

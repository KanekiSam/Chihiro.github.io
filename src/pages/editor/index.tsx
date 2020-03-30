import React from 'react';
import ReactUeditor from 'ifanrx-react-ueditor';

interface Props {}
const Editor: React.FC<Props> = props => {
  return (
    <ReactUeditor
      config={{ zIndex: 1001 }}
      //   onChange={this.updateEditorContent}
      plugins={['uploadImage', 'insertCode']}
      //   uploadImage={this.uploadImage}
      ueditorPath="/static/uf8-php"
      value="Hello World!"
    />
  );
};
export default Editor;

import React, { useState } from 'react';
import ReactUeditor from 'ifanrx-react-ueditor';

interface Props {}
const Editor: React.FC<Props> = props => {
  const [progress, setProgress] = useState(-1);
  const updateEditorContent = () => {};
  const uploadImage = (e: any) => {
    return new Promise(function(resolve, reject) {
      resolve(window.URL.createObjectURL(e.target.files[0]));
    });
  };
  const uploadVideo = (e: any) => {
    return new Promise(function(resolve, reject) {
      let i = 0;
      let instance = setInterval(() => {
        if (i !== 100) {
          setProgress(++i);
        }
      }, 50);
      setTimeout(() => {
        resolve(
          'https://cloud-minapp-1131.cloud.ifanrusercontent.com/1eBb1SeNlayvGEKT.mp4',
        );
        setProgress(-1);
        clearInterval(instance);
      }, 5100);
    });
  };

  const uploadAudio = (e: any) => {
    return new Promise(function(resolve, reject) {
      resolve(
        'https://cloud-minapp-1131.cloud.ifanrusercontent.com/1eEUtZNsjiOiHbWW.mp3',
      );
    });
  };
  return (
    <div id="container">
      <ReactUeditor
        debug
        ueditorPath="./ueditor"
        plugins={[
          'uploadImage',
          'insertCode',
          'uploadVideo',
          'uploadAudio',
          'insertLink',
        ]}
        uploadImage={uploadImage}
        uploadVideo={uploadVideo}
        uploadAudio={uploadAudio}
        onChange={updateEditorContent}
        progress={progress}
        multipleImagesUpload={false}
      />
    </div>
  );
};
export default Editor;

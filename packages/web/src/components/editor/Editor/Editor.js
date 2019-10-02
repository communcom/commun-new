/* eslint-disable react/no-multi-comp */

import React, { PureComponent, forwardRef } from 'react';
import CommunEditor from 'commun-editor';
import ToastsManager from 'toasts-manager';
import { validateAndUpload } from 'utils/uploadImage';

import './setKeyGenerator';

class Editor extends PureComponent {
  onUploadImage = async file => {
    if (file) {
      try {
        return await validateAndUpload(file);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        // ToastsManager.error('Image uploading failed:', err.message);
      }
    }

    return null;
  };

  onShowToast = (err, info) => {
    if (err) {
      ToastsManager.error(err);
      return;
    }
    ToastsManager.info(info);
  };

  render() {
    // eslint-disable-next-line react/prop-types
    const { forwardedRef, ...props } = this.props;

    return (
      <CommunEditor
        ref={forwardedRef}
        {...props}
        uploadImage={this.onUploadImage}
        onShowToast={this.onShowToast}
      />
    );
  }
}

export default forwardRef((props, ref) => <Editor {...props} forwardedRef={ref} />);

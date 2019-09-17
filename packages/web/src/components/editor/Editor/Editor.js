import React, { PureComponent, Element, forwardRef } from 'react';
import PropTypes from 'prop-types';
import RichHtmlEditor from 'rich-html-editor';
import ToastsManager from 'toasts-manager';
import { validateAndUpload } from 'utils/uploadImage';

import './setKeyGenerator';

class Editor extends PureComponent {
  static propTypes = {
    forwardedRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
  };

  static defaultProps = {
    forwardedRef: null,
  };

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
    const { forwardedRef, ...props } = this.props;

    return (
      <RichHtmlEditor
        ref={forwardedRef}
        {...props}
        uploadImage={this.onUploadImage}
        onShowToast={this.onShowToast}
      />
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
export default forwardRef((props, ref) => <Editor {...props} forwardedRef={ref} />);

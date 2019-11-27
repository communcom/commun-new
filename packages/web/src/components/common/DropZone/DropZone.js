import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDropZone from 'react-dropzone';
import ToastsManager from 'toasts-manager';

import { uploadImage } from 'utils/images/upload';

const MAX_FILE_SIZE = 3 * 1024 * 1024;

export default class DropZone extends PureComponent {
  static propTypes = {
    onlyImages: PropTypes.bool,
    onUpload: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onlyImages: false,
  };

  state = {
    isLoading: false,
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  onDrop = async files => {
    const file = files[0];

    if (!file) {
      ToastsManager.error('Unsupported file type');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      ToastsManager.error('Too big file, max allowed size is 3MB');
      return;
    }

    let url;

    this.setState({
      isLoading: true,
    });

    try {
      url = await uploadImage(files[0]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Uploading failed:', err);
      ToastsManager.error('Image uploading failed');
      return;
    }

    try {
      if (!this.unmount) {
        const { onUpload } = this.props;
        await onUpload(url);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    if (!this.unmount) {
      this.setState({
        isLoading: false,
      });
    }
  };

  render() {
    const { onUpload, onlyImages, children, ...props } = this.props;
    const { isLoading } = this.state;

    return (
      <ReactDropZone
        {...props}
        accept={onlyImages ? ['image/jpeg', 'image/png', 'image/gif'] : null}
        multiple={false}
        onDrop={this.onDrop}
      >
        {passProps => children({ ...passProps, isLoading })}
      </ReactDropZone>
    );
  }
}

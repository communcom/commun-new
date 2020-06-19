import React, { PureComponent } from 'react';
import ReactDropZone from 'react-dropzone';
import PropTypes from 'prop-types';
import ToastsManager from 'toasts-manager';

import { MAX_UPLOAD_FILE_SIZE } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { uploadImage } from 'utils/images/upload';

@withTranslation()
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
    const { t } = this.props;
    const file = files[0];

    if (!file) {
      ToastsManager.error(t('components.dropzone.toastsMessages.unsupported'));
      return;
    }

    if (file.size > MAX_UPLOAD_FILE_SIZE) {
      ToastsManager.error(
        t('components.dropzone.toastsMessages.too_big', {
          size: Math.floor(MAX_UPLOAD_FILE_SIZE / (1024 * 1024)),
        })
      );
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
      ToastsManager.error(t('components.dropzone.toastsMessages.failed∏'));
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

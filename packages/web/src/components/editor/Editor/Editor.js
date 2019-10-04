/* eslint-disable react/no-multi-comp */

import React, { PureComponent, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CommunEditor from 'commun-editor';
import ToastsManager from 'toasts-manager';

import { validateAndUpload } from 'utils/uploadImage';

const CommunEditorStyled = styled(CommunEditor)`
  .tag,
  .mention {
    color: ${({ theme }) => theme.colors.contextBlue};

    &:hover {
      color: ${({ theme }) => theme.colors.contextBlueHover};
    }
  }
`;

class Editor extends PureComponent {
  static propTypes = {
    onLinkFound: PropTypes.func,
    getEmbed: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onLinkFound: null,
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

  handleLink = async node => {
    if (!this.mounted) {
      // Игнорируем нахождение ссылок сразу после открытия редактора,
      // потому что в начале находятся ссылки которые уже были в тексте.
      return;
    }

    const { onLinkFound, getEmbed } = this.props;

    if (!onLinkFound) {
      return;
    }

    try {
      const url = node.data.get('href');
      const info = await getEmbed({ url });

      onLinkFound({
        type: info.type === 'link' ? 'website' : info.type,
        content: url,
        attributes: info,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Handle link fetch error :', err);
    }
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
      <CommunEditorStyled
        ref={forwardedRef}
        {...props}
        handleLink={this.handleLink}
        uploadImage={this.onUploadImage}
        onShowToast={this.onShowToast}
      />
    );
  }
}

export default forwardRef((props, ref) => <Editor {...props} forwardedRef={ref} />);

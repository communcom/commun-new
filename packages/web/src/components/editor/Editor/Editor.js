/* eslint-disable react/no-multi-comp */

import React, { PureComponent, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CommunEditor from 'commun-editor';
import ToastsManager from 'toasts-manager';

import { validateAndUpload } from 'utils/images/upload';
import { baseStyles } from 'components/common/BodyRender';

const CommunEditorStyled = styled(CommunEditor)`
  ${baseStyles};

  /* Указаны параметры break-all и break-word для того чтобы если браузер
     не поддерживает значение break-word, то чтобы применилось хотябы break-all. */
  word-break: break-all;
  word-break: break-word;

  .tag,
  .mention {
    color: ${({ theme }) => theme.colors.blue};

    &:hover {
      color: ${({ theme }) => theme.colors.blueHover};
    }
  }
`;

class Editor extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['basic', 'article', 'comment']),
    onLinkFound: PropTypes.func,
    getEmbed: PropTypes.func.isRequired,
  };

  static defaultProps = {
    type: 'basic',
    onLinkFound: null,
  };

  componentDidMount() {
    this.mounted = true;
  }

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

  handleLink = (node, callback) => {
    if (!this.mounted) {
      // Игнорируем нахождение ссылок сразу после открытия редактора,
      // потому что в начале находятся ссылки которые уже были в тексте.
      return;
    }

    const { type, onLinkFound, getEmbed } = this.props;

    if (type === 'article' || onLinkFound) {
      setTimeout(async () => {
        let url;
        let embedInfo;

        try {
          url = node.data.get('href');
          embedInfo = await getEmbed({ url });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Handle link fetch error:', err);
          return;
        }

        if (!this.mounted || !embedInfo) {
          return;
        }

        const embed = {
          type: embedInfo.type === 'link' ? 'website' : embedInfo.type,
          content: url,
          attributes: embedInfo,
        };

        // Для статей embed отдается обратно в редактор, для рендера внутри поста.
        if (type === 'article') {
          callback(embed);
        } else if (onLinkFound) {
          onLinkFound(embed);
        }
      }, 0);
    }
  };

  showToast = (err, info) => {
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
        showToast={this.showToast}
      />
    );
  }
}

export default forwardRef((props, ref) => <Editor {...props} forwardedRef={ref} />);

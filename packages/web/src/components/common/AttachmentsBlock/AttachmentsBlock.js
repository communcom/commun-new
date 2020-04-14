import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { NodeType } from 'types';

import IframeContainer from 'components/common/IframeContainer';
import LazyLoad from 'components/common/LazyLoad';

import ImageAttachment from './ImageAttachment';
import WebSiteAttachment from './WebSiteAttachment';
import InstagramAttachment from './InstagramAttachment';

const Wrapper = styled.div`
  width: 100%;
`;

export default class AttachmentsBlock extends Component {
  static propTypes = {
    attachments: PropTypes.shape({
      content: PropTypes.arrayOf(NodeType).isRequired,
    }),
    isCard: PropTypes.bool,
    isComment: PropTypes.bool,
    autoPlay: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    attachments: undefined,
    isCard: false,
    isComment: false,
    autoPlay: false,
    onClick: undefined,
  };

  shouldComponentUpdate(nextProps) {
    const { attachments } = this.props;

    return attachments !== nextProps.attachments;
  }

  renderAttach = attach => {
    const { isCard, isComment, autoPlay, onClick } = this.props;

    switch (attach.type) {
      case 'image':
        return (
          <ImageAttachment
            attach={attach}
            isComment={isComment}
            autoPlay={autoPlay}
            onClick={onClick}
          />
        );
      case 'rich':
      case 'video':
      case 'embed': {
        if (attach.type === 'embed' && attach?.attributes?.providerName === 'instagram') {
          return <InstagramAttachment attachment={attach} isCard={isCard} isComment={isComment} />;
        }

        return (
          <IframeContainer
            html={attach.attributes.html}
            provider={attach.attributes.providerName}
          />
        );
      }

      case 'website':
        return <WebSiteAttachment attachment={attach} isCard={isCard} />;

      default:
        return null;
    }
  };

  render() {
    const { attachments, className } = this.props;

    if (!attachments || attachments.content.length === 0) {
      return null;
    }

    const firstAttach = attachments.content[0];

    return (
      <Wrapper className={className}>
        <LazyLoad height={266} offset={300}>
          {this.renderAttach(firstAttach)}
        </LazyLoad>
      </Wrapper>
    );
  }
}

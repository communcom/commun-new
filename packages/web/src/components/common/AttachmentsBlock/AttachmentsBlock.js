import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { NodeType } from 'types';
import { proxifyImageUrl } from 'utils/images/proxy';

import IframeContainer from 'components/common/IframeContainer';
import LazyLoad from 'components/common/LazyLoad';
import WebSiteAttachment from './WebSiteAttachment';

const Wrapper = styled.div`
  width: 100%;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  max-width: 100%;

  border-radius: 10px;
  cursor: pointer;

  ${is('isComment')`
    max-height: 250px;
    width: auto;
  `}
`;

export default class AttachmentsBlock extends Component {
  static propTypes = {
    attachments: PropTypes.shape({
      content: PropTypes.arrayOf(NodeType).isRequired,
    }),
    isCard: PropTypes.bool,
    isComment: PropTypes.bool,
    imageWidth: PropTypes.number.isRequired,

    onClick: PropTypes.func,
  };

  static defaultProps = {
    attachments: undefined,
    isCard: false,
    isComment: false,
    onClick: undefined,
  };

  shouldComponentUpdate(nextProps) {
    const { attachments } = this.props;

    return attachments !== nextProps.attachments;
  }

  renderAttach = attach => {
    const { isCard, onClick, isComment, imageWidth } = this.props;

    switch (attach.type) {
      case 'image':
        return (
          <Image
            src={proxifyImageUrl(attach.content, { size: `${imageWidth}x0` })}
            isComment={isComment}
            onClick={onClick}
          />
        );
      case 'rich':
      case 'video':
      case 'embed':
        return (
          <IframeContainer
            html={attach.attributes.html}
            provider={attach.attributes.providerName}
          />
        );

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

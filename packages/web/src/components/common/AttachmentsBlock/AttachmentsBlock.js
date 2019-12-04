import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LazyLoad from 'react-lazyload';

import { NodeType } from 'types';
import { proxifyImageUrl } from 'utils/images/proxy';

import IframeContainer from 'components/common/IframeContainer';
import WebSiteAttachment from './WebSiteAttachment';

const Wrapper = styled.div`
  width: 100%;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  border-radius: 10px;
  cursor: pointer;
`;

export default class AttachmentsBlock extends Component {
  static propTypes = {
    attachments: PropTypes.shape({
      content: PropTypes.arrayOf(NodeType).isRequired,
    }),
    isModal: PropTypes.bool,

    onClick: PropTypes.func,
  };

  static defaultProps = {
    attachments: undefined,
    isModal: false,
    onClick: undefined,
  };

  shouldComponentUpdate(nextProps) {
    const { attachments } = this.props;

    return attachments !== nextProps.attachments;
  }

  renderAttach = attach => {
    const { onClick } = this.props;

    switch (attach.type) {
      case 'image':
        return <Image src={proxifyImageUrl(attach.content)} onClick={onClick} />;

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
        return <WebSiteAttachment attachment={attach} />;

      default:
        return null;
    }
  };

  render() {
    const { attachments, isModal, className } = this.props;

    if (!attachments || attachments.content.length === 0) {
      return null;
    }

    const firstAttach = attachments.content[0];

    return (
      <Wrapper className={className}>
        <LazyLoad resize once height={266} offset={300} overflow={isModal}>
          {this.renderAttach(firstAttach)}
        </LazyLoad>
      </Wrapper>
    );
  }
}

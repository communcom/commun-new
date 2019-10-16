import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LazyLoad from 'react-lazyload';

import { NodeType } from 'types';

import WebSiteAttachment from './WebSiteAttachment';

const Wrapper = styled.div``;

const Image = styled.img`
  display: block;
  width: 100%;
  border-radius: 10px;
  cursor: pointer;
`;

const IframeContainer = styled.div`
  border-radius: 10px;
  overflow: hidden;
`;

export default class AttachmentsBlock extends Component {
  static propTypes = {
    attachments: PropTypes.shape({
      content: PropTypes.arrayOf(NodeType).isRequired,
    }),
    onClick: PropTypes.func,
  };

  static defaultProps = {
    attachments: undefined,
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
        return <Image src={attach.content} onClick={onClick} />;

      case 'video':
        return (
          <LazyLoad resize once height={266} offset={300}>
            <IframeContainer dangerouslySetInnerHTML={{ __html: attach.attributes.html }} />
          </LazyLoad>
        );

      case 'website':
        return <WebSiteAttachment attachment={attach} />;

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

    return <Wrapper className={className}>{this.renderAttach(firstAttach)}</Wrapper>;
  }
}
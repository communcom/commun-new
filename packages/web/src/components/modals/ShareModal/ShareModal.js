import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { extendedPostType } from 'types/common';
import ShareBlock from 'components/common/ShareBlock';
import {
  Wrapper,
  BackButton,
  CloseButtonStyled,
  DescriptionHeader,
  ModalName,
} from 'components/modals/common/DescriptionModal.styled';

const WrapperStyled = styled(Wrapper)`
  flex-basis: 450px;
`;

export default class ShareModal extends PureComponent {
  static propTypes = {
    post: extendedPostType.isRequired,
    close: PropTypes.func.isRequired,
  };

  onCloseClick = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { post } = this.props;
    const shareUrl = `${document.location.origin}${post.url}`;

    return (
      <WrapperStyled role="dialog">
        <DescriptionHeader>
          <BackButton onClick={this.onCloseClick} />
          <ModalName>Share link</ModalName>
          <CloseButtonStyled onClick={this.onCloseClick} />
        </DescriptionHeader>
        <ShareBlock title={post.document.attributes.title} url={shareUrl} />
      </WrapperStyled>
    );
  }
}

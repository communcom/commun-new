import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';

import { extendedPostType } from 'types/common';
import ShareBlock from 'components/common/ShareBlock';
import {
  Wrapper,
  CloseButtonStyled,
  DescriptionHeader,
  ModalName,
} from 'components/modals/common/DescriptionModal.styled';

const WrapperStyled = styled(Wrapper)`
  flex-basis: 390px;
  height: auto;
  padding: 20px 10px;
  margin: auto 0 5px;
  border-radius: 15px;

  @media (min-width: 360px) {
    padding: 20;
  }

  ${up.mobileLandscape} {
    margin: 0;
  }
`;

const DescriptionHeaderStyled = styled(DescriptionHeader)`
  justify-content: space-between;
`;

const ModalNameStyled = styled(ModalName)`
  font-size: 18px;
  line-height: 24px;
`;

const CloseButton = styled(CloseButtonStyled)`
  display: flex;
`;

export default class ShareModal extends PureComponent {
  static propTypes = {
    currentUserId: PropTypes.string.isRequired,
    post: extendedPostType.isRequired,
    close: PropTypes.func.isRequired,
  };

  onCloseClick = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { post, currentUserId } = this.props;
    const shareUrl = `${document.location.origin}${post.url}${
      currentUserId ? `?invite=${currentUserId}` : ''
    }`;

    return (
      <WrapperStyled role="dialog">
        <DescriptionHeaderStyled>
          <ModalNameStyled>Share</ModalNameStyled>
          <CloseButton onClick={this.onCloseClick} />
        </DescriptionHeaderStyled>
        <ShareBlock title={post.document.attributes.title} url={shareUrl} />
      </WrapperStyled>
    );
  }
}

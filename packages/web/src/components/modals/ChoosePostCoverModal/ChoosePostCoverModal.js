import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, CloseButton } from '@commun/ui';
import ChooseCommunity from 'components/common/ChooseCommunity';
import ChoosePostCover from 'components/editor/ChoosePostCover';

const Wrapper = styled.div`
  flex-basis: 502px;
  padding: 15px 15px 8px;
  border-radius: 10px;
  background-color: #fff;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0 15px;
`;

const HeaderTitle = styled.span`
  line-height: 22px;
  font-size: 16px;
  font-weight: 600;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3px;
`;

export default class ChoosePostCoverModal extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
  };

  inputRef = createRef();

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    communityId: this.props.communityId,
    coverUrl: null,
  };

  onCommunityChange = communityId => {
    this.setState({
      communityId,
    });
  };

  onPostClick = () => {
    const { close } = this.props;
    const { communityId, coverUrl } = this.state;

    close({
      communityId,
      coverUrl,
    });
  };

  onClearClick = () => {
    this.inputRef.current.value = '';

    this.setState({
      coverUrl: null,
    });
  };

  onCloseClick = () => {
    const { close } = this.props;
    close();
  };

  onCoverChange = coverUrl => {
    this.setState({
      coverUrl,
    });
  };

  render() {
    const { communityId, coverUrl } = this.state;

    return (
      <Wrapper>
        <ModalHeader>
          <HeaderTitle>Prepare for publication</HeaderTitle>
          <CloseButton onClick={this.onCloseClick} />
        </ModalHeader>
        <ChoosePostCover coverUrl={coverUrl} onChange={this.onCoverChange} />
        <ModalFooter>
          <ChooseCommunity communityId={communityId} onChange={this.onCommunityChange} />
          <Button primary small onClick={this.onPostClick}>
            Post
          </Button>
        </ModalFooter>
      </Wrapper>
    );
  }
}

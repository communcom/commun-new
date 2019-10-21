import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import throttle from 'lodash.throttle';

import Avatar from 'components/common/Avatar';
import PostForm from 'components/common/PostForm';

import {
  ADDITIONAL_BREAKPOINT_MOBILE,
  Wrapper,
  Left,
  Right,
  ClosedEditorPlaceholder,
  AddImg,
  IconAddImg,
  EditorWrapper,
  BackgroundShadow,
} from './WhatsNewOpener.styled';

const AvatarStyled = styled(Avatar)`
  margin-right: 10px;
  width: 30px;
  height: 30px;
`;

export default class WhatsNewOpener extends Component {
  static propTypes = {
    isCommunity: PropTypes.bool,
    loggedUserId: PropTypes.string,
  };

  static defaultProps = {
    isCommunity: false,
    loggedUserId: null,
  };

  state = {
    isMobileScreen: false,
    isExtEditorOpen: false,
    isChoosePhoto: false,
  };

  editorRef = createRef();

  checkEditorPosition = throttle(() => {
    const { bottom } = this.editorRef?.current.getBoundingClientRect();

    if (bottom && bottom < 0) {
      this.closeExtendedEditor();
    }
  }, 500);

  checkScreenSize = throttle(() => {
    const { isMobileScreen } = this.state;
    const windowWidth = window.innerWidth;

    if (windowWidth <= ADDITIONAL_BREAKPOINT_MOBILE && !isMobileScreen) {
      this.setState({ isMobileScreen: true });
    }
    if (windowWidth > ADDITIONAL_BREAKPOINT_MOBILE && isMobileScreen) {
      this.setState({ isMobileScreen: false });
    }
  }, 500);

  componentDidMount() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  }

  componentDidUpdate(_, prevState) {
    const { isExtEditorOpen } = this.state;

    if (isExtEditorOpen && prevState.isExtEditorOpen !== isExtEditorOpen) {
      window.addEventListener('scroll', this.checkEditorPosition);
    }

    if (!isExtEditorOpen && prevState.isExtEditorOpen !== isExtEditorOpen) {
      window.removeEventListener('scroll', this.checkEditorPosition);
    }
  }

  componentWillUnmount() {
    const { isExtEditorOpen } = this.state;

    if (isExtEditorOpen) {
      window.removeEventListener('scroll', this.checkEditorPosition);
      this.checkEditorPosition.cancel();
    }

    window.removeEventListener('resize', this.checkScreenSize);
    this.checkScreenSize.cancel();
  }

  openExtendedEditor = () => {
    this.setState({ isExtEditorOpen: true });
  };

  openExtEditorPhoto = () => {
    this.setState({ isExtEditorOpen: true, isChoosePhoto: true });
  };

  clickBackgroundShadow = () => {
    const { isMobileScreen } = this.state;

    if (isMobileScreen) {
      return;
    }
    this.closeExtendedEditor();
  };

  closeExtendedEditor = () => {
    this.setState({ isExtEditorOpen: false, isChoosePhoto: false });
  };

  renderEditor() {
    const { isCommunity, loggedUserId } = this.props;
    const { isExtEditorOpen, isChoosePhoto } = this.state;

    if (isExtEditorOpen) {
      return (
        <PostForm
          isCommunity={isCommunity}
          isChoosePhoto={isChoosePhoto}
          onClose={this.closeExtendedEditor}
        />
      );
    }

    return (
      <EditorWrapper>
        <Left>
          <AvatarStyled userId={loggedUserId} useLink />
          <ClosedEditorPlaceholder
            name="feed__open-editor"
            aria-label="Open editor"
            onClick={this.openExtendedEditor}
          >
            What&apos;s new?
          </ClosedEditorPlaceholder>
        </Left>
        <Right>
          <AddImg communityPage={isCommunity} onClick={this.openExtEditorPhoto}>
            <IconAddImg name="photo" />
          </AddImg>
        </Right>
      </EditorWrapper>
    );
  }

  render() {
    const { loggedUserId } = this.props;
    const { isExtEditorOpen } = this.state;

    if (!loggedUserId) {
      return null;
    }

    return (
      <>
        {isExtEditorOpen && <BackgroundShadow onClick={this.clickBackgroundShadow} />}
        <Wrapper ref={this.editorRef} open={isExtEditorOpen ? 1 : 0}>
          {this.renderEditor()}
        </Wrapper>
      </>
    );
  }
}

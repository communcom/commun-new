import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import throttle from 'lodash.throttle';

import { up } from '@commun/ui';
import { HEADER_HEIGHT, HEADER_DESKTOP_HEIGHT } from 'components/common/Header';
import { getScrollContainer } from 'utils/ui';
import PostForm from 'components/common/PostForm';

export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;

  ${up.mobileLandscape} {
    position: relative;
    top: unset;
    bottom: unset;
    left: unset;
    right: unset;
  }
`;

const InnerWrapper = styled.div`
  height: 100%;
  background-color: #fff;

  ${up.mobileLandscape} {
    height: auto;
    border-radius: 6px;
  }
`;

const BackgroundShadow = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 100;

  ${up.mobileLandscape} {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

export default class CreatePostInline extends PureComponent {
  static propTypes = {
    withPhoto: PropTypes.bool,
    withArticle: PropTypes.bool,
    dontScroll: PropTypes.bool.isRequired,
    isDesktop: PropTypes.bool.isRequired,

    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    withPhoto: false,
    withArticle: false,
  };

  editorRef = createRef();

  checkEditorPosition = throttle(() => {
    const { onClose } = this.props;

    const { bottom } = this.editorRef.current.getBoundingClientRect();

    if (bottom < 0) {
      onClose();
    }
  }, 500);

  componentDidMount() {
    const { dontScroll, isDesktop } = this.props;

    if (dontScroll) {
      return;
    }

    const scrollContainer = getScrollContainer(this.editorRef.current);
    const headerHeight = isDesktop ? HEADER_DESKTOP_HEIGHT + 24 : HEADER_HEIGHT + 20;

    const offsetFromDocTop =
      scrollContainer.scrollTop + this.editorRef.current.getBoundingClientRect().top - headerHeight;

    scrollContainer.scrollTo({
      top: offsetFromDocTop,
    });

    this.delayedScrollId = setTimeout(() => {
      this.delayedScrollId = null;
      window.addEventListener('scroll', this.checkEditorPosition);
    }, 1000);
  }

  componentWillUnmount() {
    const { onClose } = this.props;

    if (this.delayedScrollId) {
      clearTimeout(this.delayedScrollId);
    } else {
      window.removeEventListener('scroll', this.checkEditorPosition);
      this.checkEditorPosition.cancel();
    }

    onClose();
  }

  onBackgroundClick = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { withPhoto, withArticle, onClose } = this.props;

    return (
      <>
        <BackgroundShadow onClick={this.onBackgroundClick} />
        <Wrapper>
          <InnerWrapper ref={this.editorRef}>
            <PostForm inline isChoosePhoto={withPhoto} isArticle={withArticle} onClose={onClose} />
          </InnerWrapper>
        </Wrapper>
      </>
    );
  }
}

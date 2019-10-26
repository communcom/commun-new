import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import throttle from 'lodash.throttle';

import { up } from '@commun/ui';
import { getScrollContainer } from 'utils/ui';

import PostForm from 'components/common/PostForm';

export const Wrapper = styled.div`
  position: fixed;
  top: 64px;
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
    height: 0;
  }
`;

const InnerWrapper = styled.div`
  background-color: #fff;

  ${up.tablet} {
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

const TOP_GAP = 84;

export default class CreatePostInline extends PureComponent {
  static propTypes = {
    withPhoto: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    withPhoto: false,
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
    const scrollContainer = getScrollContainer(this.editorRef.current);

    const offsetFromDocTop =
      scrollContainer.scrollTop + this.editorRef.current.getBoundingClientRect().top - TOP_GAP;

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
    const { withPhoto, onClose } = this.props;

    return (
      <>
        <BackgroundShadow onClick={this.onBackgroundClick} />
        <Wrapper>
          <InnerWrapper ref={this.editorRef}>
            <PostForm isChoosePhoto={withPhoto} onClose={onClose} />
          </InnerWrapper>
        </Wrapper>
      </>
    );
  }
}

/* eslint-disable react/destructuring-assignment */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';
import { Icon } from '@commun/icons';

import PostForm from 'components/common/PostForm';
import ScrollFix from 'components/common/ScrollFix';

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: #fff;

  ${up.mobileLandscape} {
    position: relative;
    top: unset;
    bottom: unset;
    left: unset;
    right: unset;
    flex-basis: 500px;
    max-height: 80vh;
    border-radius: 6px;
  }
`;

const ArticleWrapper = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 100;

  ${up.mobileLandscape} {
    overflow: auto;
    overflow-x: hidden;
  }
`;

const ScrollFixStyled = styled(ScrollFix)`
  display: flex;
  justify-content: center;
  flex-grow: 1;
  min-height: 100%;
`;

const CloseButton = styled.button`
  display: none;

  ${up.mobileLandscape} {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 30px;
    right: 30px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.lightGrayBlue};
  }
`;

const CrossIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const EditorContainer = styled.div`
  display: flex;
  flex-grow: 1;

  ${up.mobileLandscape} {
    flex-grow: 0;
    flex-direction: column;
    flex-basis: 700px;
  }
`;

export default class NewPostEditor extends PureComponent {
  static propTypes = {
    withPhoto: PropTypes.bool,
    isArticle: PropTypes.bool,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    withPhoto: false,
    isArticle: false,
  };

  state = {
    mode: this.props.isArticle ? 'article' : undefined,
  };

  onModeChange = mode => {
    this.setState({
      mode,
    });
  };

  render() {
    const { withPhoto, close } = this.props;
    const { mode } = this.state;

    if (mode === 'article') {
      return (
        <ArticleWrapper>
          <ScrollFixStyled>
            <EditorContainer>
              <PostForm
                isChoosePhoto={withPhoto}
                isArticle
                wrapperMode={mode}
                onModeChange={this.onModeChange}
                onClose={close}
              />
            </EditorContainer>
            <CloseButton title="Close" onClick={close}>
              <CrossIcon />
            </CloseButton>
          </ScrollFixStyled>
        </ArticleWrapper>
      );
    }

    return (
      <Wrapper>
        <PostForm
          isChoosePhoto={withPhoto}
          wrapperMode={mode}
          onModeChange={this.onModeChange}
          onClose={close}
        />
      </Wrapper>
    );
  }
}

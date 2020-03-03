import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ToggleFeature } from '@flopflip/react-redux';

import { Icon } from '@commun/icons';
import { styles, up } from '@commun/ui';

import { FEATURE_ARTICLE } from 'shared/featureFlags';
import Avatar from 'components/common/Avatar';
import CreatePostInline from 'components/common/CreatePostInline';

export const Wrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
  background-color: #fff;
  ${styles.breakWord};

  ${up.tablet} {
    border-radius: 6px;
  }
`;

const AvatarStyled = styled(Avatar)`
  margin-right: 10px;
  width: 30px;
  height: 30px;
`;

const Left = styled.div`
  display: flex;
  flex-grow: 1;
`;

const Right = styled.div`
  display: flex;
  align-items: center;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const ClosedEditorPlaceholder = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  flex-grow: 1;
  font-size: 15px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.gray};
  cursor: text;
`;

const ActionButton = styled.button`
  display: flex;
  padding: 3px;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;
  cursor: pointer;
  overflow: hidden;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const IconAddImg = styled(Icon)`
  width: 20px;
  height: 20px;
`;

const IconAddArticle = styled(Icon)`
  width: 24px;
  height: 24px;
`;

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  padding: 12px 16px;
`;

export default class WhatsNewOpener extends Component {
  static propTypes = {
    loggedUserId: PropTypes.string,
    isMobile: PropTypes.bool.isRequired,
    openModalEditor: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
  };

  state = {
    isEditorOpen: false,
    withPhoto: false,
    withArticle: false,
  };

  openExtendedEditor = () => {
    const { isMobile, openModalEditor } = this.props;

    if (isMobile) {
      openModalEditor();
      return;
    }

    this.setState({
      isEditorOpen: true,
      withPhoto: false,
      withArticle: false,
    });
  };

  openExtendedEditorPhoto = () => {
    const { isMobile, openModalEditor } = this.props;

    if (isMobile) {
      openModalEditor({
        withPhoto: true,
      });
      return;
    }

    this.setState({
      isEditorOpen: true,
      withPhoto: true,
    });
  };

  openExtendedEditorArticle = () => {
    const { isMobile, openModalEditor } = this.props;

    if (isMobile) {
      openModalEditor({
        withArticle: true,
      });
      return;
    }

    this.setState({
      isEditorOpen: true,
      withArticle: true,
    });
  };

  onInlineEditorClose = () => {
    this.setState({
      isEditorOpen: false,
      withPhoto: false,
    });
  };

  render() {
    const { loggedUserId } = this.props;
    const { isEditorOpen, withPhoto, withArticle } = this.state;

    return (
      <>
        {isEditorOpen ? (
          <CreatePostInline
            withPhoto={withPhoto}
            withArticle={withArticle}
            onClose={this.onInlineEditorClose}
          />
        ) : null}
        <Wrapper>
          <EditorWrapper>
            <Left>
              <AvatarStyled userId={loggedUserId} useLink isEditor />
              <ClosedEditorPlaceholder
                name="feed__open-editor"
                aria-label="Open editor"
                onClick={this.openExtendedEditor}
              >
                What&apos;s new?
              </ClosedEditorPlaceholder>
            </Left>
            <Right>
              <ToggleFeature flag={FEATURE_ARTICLE}>
                <ActionButton onClick={this.openExtendedEditorArticle}>
                  <IconAddArticle name="article" />
                </ActionButton>
              </ToggleFeature>
              <ActionButton onClick={this.openExtendedEditorPhoto}>
                <IconAddImg name="photo" />
              </ActionButton>
            </Right>
          </EditorWrapper>
        </Wrapper>
      </>
    );
  }
}

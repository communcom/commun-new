import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { styles, up } from '@commun/ui';
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

const AddImg = styled.button`
  display: flex;
  padding: 3px;
  margin-left: 6px;
  color: ${({ theme }) => theme.colors.blue};
  transition: color 0.15s;
  cursor: pointer;
  overflow: hidden;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const IconAddImg = styled(Icon)`
  width: 19px;
  height: 19px;
  cursor: pointer;
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
  };

  static defaultProps = {
    loggedUserId: null,
  };

  state = {
    isEditorOpen: false,
    withPhoto: false,
  };

  openExtendedEditor = () => {
    this.setState({
      isEditorOpen: true,
      withPhoto: false,
    });
  };

  openExtendedEditorPhoto = () => {
    this.setState({
      isEditorOpen: true,
      withPhoto: true,
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
    const { isEditorOpen, withPhoto } = this.state;

    if (!loggedUserId) {
      return null;
    }

    return (
      <>
        {isEditorOpen ? (
          <CreatePostInline withPhoto={withPhoto} onClose={this.onInlineEditorClose} />
        ) : null}
        <Wrapper>
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
              <AddImg onClick={this.openExtendedEditorPhoto}>
                <IconAddImg name="photo" />
              </AddImg>
            </Right>
          </EditorWrapper>
        </Wrapper>
      </>
    );
  }
}

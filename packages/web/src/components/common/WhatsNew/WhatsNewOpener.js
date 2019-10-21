import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { styles, up } from '@commun/ui';
import Avatar from 'components/common/Avatar';

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
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
  color: ${({ theme }) => theme.colors.contextGrey};
  cursor: text;
`;

const AddImg = styled.button`
  display: flex;
  padding: 3px;
  margin-left: 6px;
  color: ${({ theme }) => theme.colors.contextBlue};
  transition: color 0.15s;
  cursor: pointer;
  overflow: hidden;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
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
    openEditor: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
  };

  openExtendedEditor = () => {
    const { openEditor } = this.props;
    openEditor();
  };

  openExtendedEditorPhoto = () => {
    const { openEditor } = this.props;
    openEditor({
      withPhoto: true,
    });
  };

  render() {
    const { loggedUserId } = this.props;

    if (!loggedUserId) {
      return null;
    }

    return (
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
    );
  }
}

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { transparentize } from 'polished';

import { Router } from 'shared/routes';
import { POST_DRAFT_KEY } from 'shared/constants';
import { getPostPermlink } from 'utils/common';
import { wait } from 'utils/time';
import { displayError } from 'utils/toastsMessages';
import { checkIsEditorEmpty } from 'utils/editor';
import { postType, communityType, userType } from 'types/common';
import { Dropdown, Loader, CircleLoader, CONTAINER_DESKTOP_PADDING } from '@commun/ui';
import { PostEditor } from 'components/editor';
import Embed from 'components/Embed';
import Avatar from 'components/Avatar';
import { HEADER_DESKTOP_HEIGHT } from 'components/Header/constants';
import EditorForm from 'components/EditorForm';

import {
  AddImgModal,
  CloseEditor,
  CrossIcon,
  Wrapper,
  FileInput,
  IconAddImg,
  IconEmoji,
} from './PostForm.styled';

const AvatarModalStyled = styled(Avatar)`
  margin-right: 16px;
`;

const PostEditorStyled = styled(PostEditor)`
  flex: 1;
`;

const SubmitButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 42px;
  border-radius: 4px;

  line-height: 18px;
  font-size: 15px;
  text-align: center;
  letter-spacing: -0.41px;
  white-space: nowrap;

  color: #fff;

  background-color: ${({ theme, communityPage }) =>
    communityPage ? theme.colors.communityColor : theme.colors.contextBlue};
  transition: background-color 0.15s;

  &:hover,
  &:focus {
    background-color: ${({ theme, communityPage }) =>
      communityPage ? theme.colors.communityColorHover : theme.colors.contextBlueHover};
  }

  &:disabled {
    appearance: none;
    background-color: ${({ theme, communityPage }) =>
      transparentize(
        0.5,
        communityPage ? theme.colors.communityColorHover : theme.colors.contextBlue
      )};
  }
`;

const SubmitButtonText = styled.span`
  ${is('isInvisible')`
    visibility: hidden;
  `};
`;

const LoaderStyled = styled(Loader)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 12px 16px 0;
  overflow-y: auto;
`;

const OpenEditorWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const AttachmentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  flex-grow: 1;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  overflow: hidden;
`;

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ActionsWrapperTop = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 48px;
  padding: 0 16px;
`;

const ActionsWrapperBottom = styled.div`
  display: flex;
  flex-direction: row;
  height: 64px;
  padding: 8px 16px;
  margin-bottom: 16px;
`;

const ActionsWrapperLeft = styled.div`
  display: flex;
  flex: 1;
`;

const ActionsWrapperRight = styled.div``;

const SelectCommunityStub = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  height: 48px;
  cursor: default;
`;

const SelectStyled = styled(Dropdown)`
  flex: 1;
  margin-right: 16px;
`;

export default class PostForm extends EditorForm {
  static propTypes = {
    fetchPost: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired,
    isCommunity: PropTypes.bool,
    isEdit: PropTypes.bool,
    post: postType,
    myCommunities: PropTypes.arrayOf(communityType),
    currentUser: userType,
    isChoosePhoto: PropTypes.bool,
    waitForTransaction: PropTypes.func.isRequired,
    getCommunityById: PropTypes.func.isRequired,
    fetchMyCommunities: PropTypes.func.isRequired,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    isCommunity: false,
    isEdit: false,
    isChoosePhoto: false,
    post: null,
    currentUser: null,
    myCommunities: null,
    onClose: null,
  };

  static DRAFT_KEY = POST_DRAFT_KEY;

  state = {
    isSubmitting: false,
    body: null,
    isImageLoading: false,
    editorMode: 'basic',
    communityId: null,
    ...this.getInitialValue(this.props.post),
  };

  fileInputRef = createRef();

  wrapperRef = createRef();

  async componentDidMount() {
    const { isChoosePhoto, isCommunity, fetchMyCommunitiesIfEmpty } = this.props;

    if (isCommunity) {
      window.scrollTo({
        top:
          this.wrapperRef.current.getBoundingClientRect().top +
          window.pageYOffset -
          HEADER_DESKTOP_HEIGHT -
          CONTAINER_DESKTOP_PADDING,
        behavior: 'smooth',
      });
    }

    if (isChoosePhoto) {
      this.fileInputRef.current.click();
    }

    fetchMyCommunitiesIfEmpty();
  }

  onCommunityChange = communityId => {
    this.setState({
      communityId,
    });
  };

  handleSubmit = async newPost => {
    const {
      isEdit,
      currentUser,
      post,
      fetchPost,
      createPost,
      updatePost,
      onClose,
      waitForTransaction,
      getCommunityById,
    } = this.props;
    const { communityId } = this.state;

    if (!communityId) {
      // eslint-disable-next-line no-undef,no-alert
      alert('Select a community');
      return;
    }

    this.setState({
      isSubmitting: true,
    });

    const { title } = newPost.attributes;
    const body = JSON.stringify(newPost);

    try {
      // if editing post
      if (isEdit) {
        const result = await updatePost({
          communityId,
          contentId: post.contentId,
          title,
          body,
        });

        await waitForTransaction(result.transaction_id);
        await fetchPost(post.contentId);

        onClose();
      } else {
        const result = await createPost({
          communityId,
          permlink: getPostPermlink(title),
          title,
          body,
        });

        this.removeDraft();

        try {
          await waitForTransaction(result.transaction_id);
        } catch (err) {
          // В случае ошибки ожидания транзакции немного ждем и всё равно пытаемся перейти на пост
          await wait(1000);
        }

        const msgId = result.processed.action_traces[0].act.data.message_id;

        const community = getCommunityById(communityId);

        Router.pushRoute('post', {
          communityAlias: community.alias,
          username: currentUser.username,
          permlink: msgId.permlink,
        });
      }
    } catch (err) {
      displayError('Post submitting is failed', err);

      this.setState({
        isSubmitting: false,
      });
    }
  };

  renderAttachments = () => {
    const { attachments } = this.state;

    if (!attachments || !attachments.length) {
      return null;
    }

    return (
      <AttachmentsWrapper>
        {attachments.map(attach => (
          <Embed key={attach.id} data={attach} onClose={this.handleResourceRemove} />
        ))}
      </AttachmentsWrapper>
    );
  };

  render() {
    const { isCommunity, isEdit, currentUser, myCommunities, onClose } = this.props;
    const { isSubmitting, body, isImageLoading, initialValue, communityId } = this.state;

    const isDisabledPosting = isSubmitting || checkIsEditorEmpty(body);

    return (
      <Wrapper ref={this.wrapperRef}>
        <CloseEditor aria-label="Close editor" onClick={onClose}>
          <CrossIcon name="cross" />
        </CloseEditor>
        <ScrollWrapper>
          <OpenEditorWrapper>
            {isImageLoading ? <CircleLoader /> : null}
            <AvatarModalStyled userId={currentUser?.userId} useLink />
            <PostEditorStyled
              id="post-editor"
              initialValue={initialValue}
              onChange={this.handleChange}
              onLinkFound={this.handleLinkFound}
            />
          </OpenEditorWrapper>
          {this.renderAttachments()}
        </ScrollWrapper>

        <ActionsWrapper>
          <ActionsWrapperTop>
            <ActionsWrapperLeft>
              <FileInput
                ref={this.fileInputRef}
                id="add-photo-editor-open"
                type="file"
                accept="image/*"
                aria-label="Add file"
                onChange={this.handleTakeFile}
              />
              <AddImgModal htmlFor="add-photo-editor-open" communityPage={isCommunity}>
                <IconAddImg name="photo" />
              </AddImgModal>
            </ActionsWrapperLeft>
            <ActionsWrapperRight>
              <IconEmoji name="emotion" width={20} height={20} />
            </ActionsWrapperRight>
          </ActionsWrapperTop>
          <ActionsWrapperBottom>
            {myCommunities && myCommunities.length === 0 ? (
              <SelectCommunityStub>No joined communities</SelectCommunityStub>
            ) : (
              <SelectStyled
                disabled={isEdit && false}
                value={communityId}
                items={
                  myCommunities
                    ? myCommunities.map(com => ({
                        label: com.name,
                        value: com.communityId,
                      }))
                    : []
                }
                onSelect={this.onCommunityChange}
              />
            )}
            <SubmitButton
              name="post-form__submit"
              disabled={isDisabledPosting || !communityId}
              communityPage={isCommunity}
              onClick={this.post}
            >
              <SubmitButtonText isInvisible={isSubmitting}>
                {isEdit ? 'Save' : 'Send'}
              </SubmitButtonText>
              {isSubmitting ? <LoaderStyled /> : null}
            </SubmitButton>
          </ActionsWrapperBottom>
        </ActionsWrapper>
      </Wrapper>
    );
  }
}

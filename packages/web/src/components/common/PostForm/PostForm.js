import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Router } from 'shared/routes';
import { POST_DRAFT_KEY } from 'shared/constants';
import { getPostPermlink } from 'utils/common';
import { wait } from 'utils/time';
import { displayError } from 'utils/toastsMessages';
import { checkIsEditorEmpty } from 'utils/editor';
import { postType, communityType, userType } from 'types/common';
import { styles, up, CircleLoader, CONTAINER_DESKTOP_PADDING } from '@commun/ui';
import { Icon } from '@commun/icons';
import { PostEditor } from 'components/editor';
import Embed from 'components/common/Embed';
import Avatar from 'components/common/Avatar';
import { HEADER_DESKTOP_HEIGHT } from 'components/common/Header';
import EditorForm from 'components/common/EditorForm';
import AsyncButton from 'components/common/AsyncButton';
import ChooseCommunity from 'components/common/ChooseCommunity';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 100%;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  cursor: pointer;
`;

const ActionTextButton = styled(ActionButton)`
  width: unset;
  padding: 0 15px 0 10px;
  border-radius: 40px;
`;

const ActionText = styled.span`
  font-size: 15px;
`;

const AddImgIconWrapper = styled.span`
  position: relative;
  display: flex;
  color: #000;
  cursor: pointer;
  overflow: hidden;
`;

const AddImgIcon = styled(Icon).attrs({ name: 'photo' })`
  width: 20px;
  height: 20px;
`;

const ArticleIcon = styled(Icon).attrs({ name: 'article' })`
  width: 24px;
  height: 24px;
  margin-right: 7px;
`;

const FileInputWrapper = styled.label`
  display: block;
`;

const FileInput = styled.input`
  ${styles.visuallyHidden};
`;

const CrossIcon = styled(Icon).attrs({
  size: '12px',
})``;

const CloseEditor = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 15px;
  top: -40px;
  width: 24px;
  height: 24px;
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 50%;
  cursor: pointer;

  &:hover,
  &:focus {
    border: 1px solid #fff;
  }

  & ${CrossIcon} {
    color: #fff;
  }

  ${up.tablet} {
    display: none;
  }
`;

const AvatarModalStyled = styled(Avatar)`
  margin-right: 15px;
`;

const PostEditorStyled = styled(PostEditor)`
  flex: 1;
`;

const ScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 12px 15px 0;
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
  align-items: center;
  height: 48px;
  padding: 0 15px;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const ActionsWrapperBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 8px 15px 0;
  margin-bottom: 8px;
`;

const Splitter = styled.span`
  width: 2px;
  height: 15px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
`;

export default class PostForm extends EditorForm {
  static propTypes = {
    post: postType,
    community: communityType,
    currentUser: userType,
    isCommunity: PropTypes.bool,
    isEdit: PropTypes.bool,
    isChoosePhoto: PropTypes.bool,

    waitForTransaction: PropTypes.func.isRequired,
    getCommunityById: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    fetchPost: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isCommunity: false,
    isEdit: false,
    isChoosePhoto: false,
    post: null,
    currentUser: null,
    onClose: null,
  };

  static DRAFT_KEY = POST_DRAFT_KEY;

  state = {
    isSubmitting: false,
    body: null,
    isImageLoading: false,
    editorMode: 'basic',
    communityId: null,
    ...this.getInitialValue(this.props.post?.document),
  };

  fileInputRef = createRef();

  wrapperRef = createRef();

  async componentDidMount() {
    const { isChoosePhoto, isCommunity, fetchMyCommunitiesIfEmpty, community } = this.props;

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

    if (community) {
      this.setState({
        communityId: community.communityId,
      });
    }
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

  renderImageButton() {
    return (
      <FileInputWrapper>
        <FileInput
          ref={this.fileInputRef}
          type="file"
          accept="image/*"
          aria-label="Add file"
          onChange={this.handleTakeFile}
        />
        <AddImgIconWrapper>
          <ActionButton as="span">
            <AddImgIcon />
          </ActionButton>
        </AddImgIconWrapper>
      </FileInputWrapper>
    );
  }

  render() {
    const { isEdit, currentUser, onClose } = this.props;
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
            <ActionButton>
              <ActionText>18+</ActionText>
            </ActionButton>
            {this.renderImageButton()}
            <Splitter />
            <ActionTextButton>
              <ArticleIcon />
              <ActionText>Article</ActionText>
            </ActionTextButton>
          </ActionsWrapperTop>
          <ActionsWrapperBottom>
            <ChooseCommunity
              communityId={communityId}
              disabled={isEdit}
              onSelect={this.onCommunityChange}
            />
            <AsyncButton
              primary
              name="post-form__submit"
              disabled={isDisabledPosting || !communityId}
              onClick={this.post}
            >
              {isEdit ? 'Save' : 'Post'}
            </AsyncButton>
          </ActionsWrapperBottom>
        </ActionsWrapper>
      </Wrapper>
    );
  }
}

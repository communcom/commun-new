/* stylelint-disable no-descending-specificity */

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { styles, up, CircleLoader, CloseButton, CONTAINER_DESKTOP_PADDING } from '@commun/ui';
import { Icon } from '@commun/icons';
import { Router } from 'shared/routes';
import { POST_DRAFT_KEY, ARTICLE_DRAFT_KEY } from 'shared/constants';
import { getPostPermlink } from 'utils/common';
import { wait } from 'utils/time';
import { displayError } from 'utils/toastsMessages';
import { checkIsEditorEmpty } from 'utils/editor';
import { postType, communityType, userType } from 'types/common';

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
  padding: 0 16px 55px;

  ${up.mobileLandscape} {
    padding: 0;
  }
`;

const ArticleHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 15px;
  margin: 20px 0 10px;

  ${up.mobileLandscape} {
    flex-direction: row;
    align-items: center;
  }
`;

const AuthorBlock = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  flex-shrink: 0;
`;

const AvatarStyled = styled(Avatar)`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

const ArticleActions = styled.div`
  margin-left: 25px;
`;

const TopActions = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
`;

const CurrentUsername = styled.p`
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
`;

const ChooseCommunityStyled = styled(ChooseCommunity)`
  margin-bottom: 6px;
`;

const CloseButtonStyled = styled(CloseButton)`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
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

const AuthorAvatarStyled = styled(Avatar)`
  margin-right: 15px;
`;

const PostEditorStyled = styled(PostEditor)`
  display: flex;
  min-height: 55px;
  flex-grow: 1;
  flex-shrink: 0;

  & > [data-slate-editor]::after {
    content: '';
    display: block;
    padding-bottom: 30px;

    ${up.mobileLandscape} {
      content: unset;
      padding-bottom: 0;
    }
  }
`;

const ScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;

  ${up.mobileLandscape} {
    padding: 0 15px;
  }
`;

const AuthorLine = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0 10px;
`;

const AuthorName = styled.span`
  margin: -1px 0 1px;
  font-size: 14px;
  font-weight: 600;
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
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 100%;
  height: 55px;
  padding: 0 16px;
  box-shadow: 0px -6px 16px rgba(56, 60, 71, 0.07);
  border-radius: 24px 24px 0 0;
  background-color: ${({ theme }) => theme.colors.white};

  ${up.mobileLandscape} {
    position: static;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: unset;
    padding: unset;
    margin-top: 10px;
    box-shadow: unset;
    border-radius: unset;
    background-color: unset;
  }
`;

const ActionsWrapperTop = styled.div`
  display: flex;
  align-items: center;
  height: 40px;

  & > :not(:last-child) {
    margin-right: 10px;
  }

  ${up.mobileLandscape} {
    padding: 0 15px;
  }
`;

const ActionsWrapperBottom = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  ${up.mobileLandscape} {
    justify-content: space-between;
    height: 60px;
    padding: 0 15px;
    margin-bottom: 5px;
  }
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
    inline: PropTypes.bool,
    isArticle: PropTypes.bool,
    isEdit: PropTypes.bool,
    isChoosePhoto: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    wrapperMode: PropTypes.string,

    waitForTransaction: PropTypes.func.isRequired,
    getCommunityById: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    fetchPost: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired,
    onModeChange: PropTypes.func,
    setEditorState: PropTypes.func.isRequired,
    openModalEditor: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isCommunity: false,
    isEdit: false,
    wrapperMode: undefined,
    isChoosePhoto: false,
    post: null,
    currentUser: null,
    onClose: null,
  };

  state = {
    isSubmitting: false,
    body: null,
    isImageLoading: false,
    communityId: null,
    ...this.getInitialValue(this.props.post?.document),
  };

  fileInputRef = createRef();

  wrapperRef = createRef();

  postEditorRef = createRef();

  componentDidMount() {
    const {
      isChoosePhoto,
      isCommunity,
      community,
      isEdit,
      inline,
      isArticle,
      post,
      fetchMyCommunitiesIfEmpty,
      setEditorState,
    } = this.props;

    setEditorState({
      mode: isArticle ? 'article' : 'basic',
      isInline: inline,
    });

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

    if (isEdit && post?.community) {
      this.setState({
        communityId: post.community,
      });
    }
  }

  componentWillUnmount() {
    this.unmount = true;

    const { setEditorState } = this.props;
    setEditorState({ mode: null });
  }

  // Needs for EditorForm working.
  getDraftKey() {
    const { isArticle } = this.props;
    return isArticle ? ARTICLE_DRAFT_KEY : POST_DRAFT_KEY;
  }

  // Needs for EditorForm working.
  getEditorMode() {
    const { isArticle } = this.props;
    return isArticle ? 'article' : 'basic';
  }

  onArticleClick = () => {
    const { inline, openModalEditor, onModeChange, onClose } = this.props;

    this.saveCurrentAsArticleDraft(ARTICLE_DRAFT_KEY);

    if (inline) {
      onClose();
      openModalEditor({
        isArticle: true,
      });
    } else {
      onModeChange('article');
    }

    // const newUrl = `${Router.asPath.replace(/\?.+$/, '')}?editor=123`;
    // Router.pushRoute(newUrl, { shallow: true });

    // Remove all query params from url.
    // const newUrl = router.asPath.replace(/\?.+$/, '');
    // Router.pushRoute(newUrl, { shallow: true });
  };

  onCommunityChange = communityId => {
    this.setState({
      communityId,
    });
  };

  handleSubmit = async newPost => {
    const {
      isEdit,
      isArticle,
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

        // When publish article erase original post draft
        if (isArticle) {
          this.removeDraft(POST_DRAFT_KEY);
        }

        try {
          await waitForTransaction(result.transaction_id);
        } catch (err) {
          // В случае ошибки ожидания транзакции немного ждем и всё равно пытаемся перейти на пост
          await wait(1000);
        }

        if (onClose) {
          onClose();
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

      if (!this.unmount) {
        this.setState({
          isSubmitting: false,
        });
      }
    }
  };

  renderAttachments() {
    const { attachments } = this.state;

    if (!attachments || !attachments.length) {
      return null;
    }

    return (
      <AttachmentsWrapper>
        {attachments.map(attach => (
          <Embed key={attach.id} data={attach} onRemove={this.handleResourceRemove} />
        ))}
      </AttachmentsWrapper>
    );
  }

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

  renderPostButton() {
    const { isEdit } = this.props;
    const { isSubmitting, body, attachments, isImageLoading, communityId } = this.state;

    const isDisabled =
      !communityId ||
      isSubmitting ||
      isImageLoading ||
      checkIsEditorEmpty(body?.document, attachments);

    return (
      <AsyncButton primary small name="post-form__submit" disabled={isDisabled} onClick={this.post}>
        {isEdit ? 'Save' : 'Post'}
      </AsyncButton>
    );
  }

  render() {
    const { isEdit, isMobile, currentUser, isArticle, onClose } = this.props;
    const { isImageLoading, initialValue, communityId } = this.state;

    const isActionsOnTop = isMobile || isArticle;

    return (
      <Wrapper ref={this.wrapperRef}>
        {isArticle && !isMobile ? (
          <ArticleHeader>
            {currentUser ? (
              <AuthorBlock>
                <AvatarStyled userId={currentUser.userId} />
                <CurrentUsername>{currentUser.username}</CurrentUsername>
              </AuthorBlock>
            ) : null}
            <ChooseCommunity
              communityId={communityId}
              disabled={isEdit}
              onSelect={this.onCommunityChange}
            />
            <ArticleActions>{this.renderPostButton()}</ArticleActions>
          </ArticleHeader>
        ) : null}
        {isMobile ? (
          <>
            <TopActions>
              <CloseButtonStyled onClick={onClose} />
              {currentUser ? <CurrentUsername>{currentUser.username}</CurrentUsername> : null}
            </TopActions>
            <ChooseCommunityStyled
              communityId={communityId}
              disabled={isEdit}
              onSelect={this.onCommunityChange}
            />
          </>
        ) : null}
        <ScrollWrapper>
          {isImageLoading ? <CircleLoader /> : null}
          {isActionsOnTop || !currentUser ? null : (
            <AuthorLine>
              <AuthorAvatarStyled userId={currentUser.userId} useLink />
              <AuthorName>{currentUser.username}</AuthorName>
            </AuthorLine>
          )}
          <PostEditorStyled
            ref={this.postEditorRef}
            id="post-editor"
            isArticle={isArticle}
            initialValue={initialValue}
            onChange={this.handleChange}
            onLinkFound={this.handleLinkFound}
          />
          {this.renderAttachments()}
        </ScrollWrapper>
        {isMobile || !isArticle ? (
          <ActionsWrapper>
            <ActionsWrapperTop>
              <ActionButton>
                <ActionText>18+</ActionText>
              </ActionButton>
              {this.renderImageButton()}
              {isArticle ? null : (
                <>
                  <Splitter />
                  <ActionTextButton onClick={this.onArticleClick}>
                    <ArticleIcon />
                    <ActionText>Article</ActionText>
                  </ActionTextButton>
                </>
              )}
            </ActionsWrapperTop>
            <ActionsWrapperBottom>
              {isMobile || isArticle ? null : (
                <ChooseCommunity
                  communityId={communityId}
                  disabled={isEdit}
                  onSelect={this.onCommunityChange}
                />
              )}
              {!isActionsOnTop || isMobile ? this.renderPostButton() : null}
            </ActionsWrapperBottom>
          </ActionsWrapper>
        ) : null}
      </Wrapper>
    );
  }
}

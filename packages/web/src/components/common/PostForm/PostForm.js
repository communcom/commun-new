/* stylelint-disable no-descending-specificity */

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { ToggleFeature } from '@flopflip/react-redux';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { CloseButton, CONTAINER_DESKTOP_PADDING, SplashLoader, styles, up } from '@commun/ui';

import { communityType, postType, userType } from 'types/common';
import {
  ARTICLE_DRAFT_KEY,
  DISABLE_TOOLTIPS_KEY,
  IS_CHOOSE_COMMUNITY_TOOLTIP_SHOWED,
  ONBOARDING_TOOLTIP_TYPE,
  POST_DRAFT_KEY,
} from 'shared/constants';
import { FEATURE_ARTICLE } from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';
import { Router } from 'shared/routes';
import { getPostPermlink } from 'utils/common';
import { validateArticle, validatePost } from 'utils/editor';
import { getFieldValue } from 'utils/localStore';
import { wait } from 'utils/time';
import { displayError } from 'utils/toastsMessages';
import { getScrollContainer } from 'utils/ui';
import { SHOW_MODAL_SIGNUP } from 'store/constants';

import AsyncButton from 'components/common/AsyncButton';
import Avatar from 'components/common/Avatar';
import ChooseCommunity from 'components/common/ChooseCommunity';
import EditorForm from 'components/common/EditorForm';
import Embed from 'components/common/Embed';
import { HEADER_DESKTOP_HEIGHT } from 'components/common/Header';
import { PostEditor } from 'components/editor';
import ChoosePostCover from 'components/editor/ChoosePostCover';
import RewardForPostTooltip from 'components/tooltips/RewardsForPostTooltip';

const TOP_ACTIONS_HEIGHT = 44;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 100%;
  padding: 0 15px 15px;

  ${is('isAddBottomGap')`
    padding: 0 15px 55px;
  `};

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
  height: ${TOP_ACTIONS_HEIGHT}px;
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
  position: relative;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  cursor: pointer;

  ${is('isActive')`
    color: #fff;
    background-color: ${({ theme }) => theme.colors.blue};
  `};

  &:hover,
  &:focus {
    &::before {
      content: attr(aria-label);
      position: absolute;
      bottom: calc(100% + 10px);
      left: -15px;
      z-index: 6;
      display: block;
      width: max-content;
      max-width: 152px;
      padding: 5px;
      font-size: 12px;
      line-height: 16px;
      background-color: #24242c;
      color: #fff;
      border-radius: 6px;

      ${up.mobileLandscape} {
        top: calc(100% + 10px);
        bottom: unset;
        left: -15px;
      }
    }

    &::after {
      position: absolute;
      bottom: calc(100% + 6px);
      left: calc(50% - 6px);
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      background-color: #24242c;
      transform: rotate(-45deg);

      ${up.mobileLandscape} {
        top: calc(100% + 6px);
        bottom: unset;
        left: calc(50% - 6px);
      }
    }
  }
`;

const ActionTextButton = styled(ActionButton)`
  width: unset;
  padding: 0 15px 0 10px;
  border-radius: 40px;
`;

const ActionText = styled.span`
  font-size: 15px;
`;

const AddImgIcon = styled(Icon).attrs({ name: 'photo' })`
  width: 20px;
  height: 20px;
  pointer-events: none;
`;

const ArticleIcon = styled(Icon).attrs({ name: 'article' })`
  width: 24px;
  height: 24px;
  margin-right: 7px;
  pointer-events: none;
`;

const FileInputWrapper = styled.label`
  display: block;
`;

const FileInput = styled.input`
  ${styles.visuallyHidden};
`;

const AuthorAvatarStyled = styled(Avatar)`
  margin-right: 10px;
`;

const PostEditorStyled = styled(PostEditor)`
  display: flex;
  min-height: 116px;
  flex-shrink: 0;

  ${up.mobileLandscape} {
    flex-grow: 1;
  }

  & > [data-slate-editor]::after {
    content: '';
    display: block;
    height: 30px;

    ${up.mobileLandscape} {
      content: unset;
      height: 0;
    }
  }

  & .editor__placeholder {
    font-size: 17px;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const ScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;

  ${up.mobileLandscape} {
    padding: 15px 15px 0;
  }
`;

const AuthorLine = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0 10px;
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

const ChoosePostContainer = styled.div`
  flex-grow: 1;
  margin: 3px 0 20px;
`;

const BigPostButton = styled(AsyncButton).attrs({ primary: true })`
  width: 100%;
  height: 50px;
  font-size: 14px;
`;

const PostButtonWrapper = styled.div`
  position: relative;
`;

@withRouter
@withTranslation()
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
    getCommunities: PropTypes.func.isRequired,
    checkAuth: PropTypes.func.isRequired,
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

  fileInputRef = createRef();

  wrapperRef = createRef();

  constructor(props) {
    super(props);

    const { post } = this.props;

    this.state = this.prepareState({
      isSubmitting: false,
      body: null,
      isImageLoading: false,
      communityId: null,
      coverUrl: null,
      isCoverChoosing: false,
      isChooseCommunityTooltipOpen: true,
      isRewardsForPostTooltipOpen: true,
      isNsfw: post?.tags?.includes('nsfw') || false,
      ...this.getInitialValue(post?.document),
    });
  }

  componentDidMount() {
    const {
      isChoosePhoto,
      isCommunity,
      isArticle,
      inline,
      currentUser,
      fetchMyCommunitiesIfEmpty,
      getCommunities,
      setEditorState,
    } = this.props;

    setEditorState({
      mode: isArticle ? 'article' : 'basic',
      isInline: inline,
    });

    if (isCommunity) {
      getScrollContainer().scrollTo({
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

    if (currentUser) {
      fetchMyCommunitiesIfEmpty();
    } else {
      getCommunities();
    }

    if (isArticle && inline) {
      this.onArticleClick();
    }
  }

  prepareState(state) {
    const { community, isEdit, post } = this.props;

    if (isEdit && post?.communityId) {
      // eslint-disable-next-line no-param-reassign
      state.communityId = post.communityId;
      return state;
    }

    if (community && !state.communityId) {
      // eslint-disable-next-line no-param-reassign
      state.communityId = community.communityId;
      return state;
    }

    return state;
  }

  componentWillUnmount() {
    this.unmount = true;

    const { setEditorState } = this.props;
    setEditorState({ mode: null });

    super.componentWillUnmount();
  }

  // Needs for EditorForm working.
  getDraftKey() {
    const { isArticle, isEdit } = this.props;
    const key = isArticle ? ARTICLE_DRAFT_KEY : POST_DRAFT_KEY;

    return `${key}${isEdit ? 'Edit' : ''}`;
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
    this.setState(
      {
        communityId,
      },
      this.saveDraft
    );
  };

  onCoverChange = coverUrl => {
    this.setState({
      coverUrl,
    });
  };

  onNsfwClick = () => {
    const { isNsfw } = this.state;

    this.setState({
      isNsfw: !isNsfw,
    });
  };

  onCloseChooseCommunityTooltip = () => {
    this.setState({
      isChooseCommunityTooltipOpen: false,
    });
  };

  onCloseRewardsForPostTooltip = () => {
    this.setState({
      isRewardsForPostTooltipOpen: false,
    });
  };

  prePost = async () => {
    const { isEdit, isArticle, isMobile } = this.props;
    const { communityId } = this.state;

    if (!isEdit && isArticle) {
      const { choosePostCover } = this.props;

      if (isMobile) {
        this.setState({
          isCoverChoosing: true,
        });
        return;
      }

      const results = await choosePostCover({ communityId });

      if (!results) {
        return;
      }

      // eslint-disable-next-line consistent-return
      return new Promise(resolve => {
        this.setState(
          {
            communityId: results.communityId,
            coverUrl: results.coverUrl,
          },
          () => {
            resolve(this.post());
          }
        );
      });
    }

    // eslint-disable-next-line consistent-return
    return this.post();
  };

  handleSubmit = async ({ document, tags }) => {
    const {
      router,
      isEdit,
      isArticle,
      // currentUser,
      post,
      fetchPost,
      createPost,
      updatePost,
      onClose,
      waitForTransaction,
      getCommunityById,
      checkAuth,
      t,
    } = this.props;
    const { communityId, coverUrl, isNsfw } = this.state;

    if (!communityId) {
      // eslint-disable-next-line no-undef,no-alert
      displayError(t('components.post_form.toastsMessages.select_community'));
      return;
    }

    if (isNsfw && !tags.includes('nsfw')) {
      tags.unshift('nsfw');
    }

    this.setState({
      isSubmitting: true,
    });

    try {
      await checkAuth({ allowLogin: true, type: SHOW_MODAL_SIGNUP });

      const { title } = document.attributes;

      if (isEdit) {
        const result = await updatePost({
          communityId,
          contentId: post.contentId,
          title,
          body: JSON.stringify(document),
          tags,
        });

        this.clearDraft();

        await waitForTransaction(result.transaction_id);
        await fetchPost(post.contentId);

        onClose();
      } else {
        if (isArticle) {
          // eslint-disable-next-line no-param-reassign
          document.attributes.coverUrl = coverUrl;
        }

        const result = await createPost({
          communityId,
          permlink: getPostPermlink(title),
          title,
          body: JSON.stringify(document),
          tags,
        });

        this.clearDraft();

        try {
          await waitForTransaction(result.transaction_id);
        } catch (err) {
          // В случае ошибки ожидания транзакции немного ждем и всё равно пытаемся перейти на пост
          await wait(1000);
        }

        if (onClose) {
          onClose();
        }

        // const msgId = result.processed.action_traces[0].act.data.message_id;
        //
        // const community = getCommunityById(communityId);
        //
        // Router.pushRoute('/', {
        //   communityAlias: community.alias,
        //   username: currentUser.username,
        //   permlink: msgId.permlink,
        // });

        const { currentUser } = this.props;

        // redirect to final page
        if (communityId === 'FEED') {
          Router.pushRoute('profile', { username: currentUser.username });
        } else if (router.route === '/community') {
          const community = getCommunityById(communityId);
          Router.pushRoute('community', { communityAlias: community.alias });
        } else {
          Router.pushRoute('/');
        }
      }
    } catch (err) {
      displayError(t('components.post_form.toastsMessages.post_failed'), err);

      if (!this.unmount) {
        this.setState({
          isSubmitting: false,
        });
      }
    }
  };

  clearDraft() {
    const { isArticle } = this.props;

    this.removeDraftAndStopSaving();

    // When publish article erase original post draft
    if (isArticle) {
      this.removeDraft(POST_DRAFT_KEY);
    }
  }

  renderAttachments() {
    const { attachments } = this.state;

    if (!attachments || !attachments.length) {
      return null;
    }

    return (
      <AttachmentsWrapper>
        {attachments.map(attach => (
          <Embed key={attach.id} data={attach} isAttachment onRemove={this.handleAttachRemove} />
        ))}
      </AttachmentsWrapper>
    );
  }

  renderImageButton() {
    const { t } = this.props;

    return (
      <FileInputWrapper>
        <FileInput
          ref={this.fileInputRef}
          type="file"
          accept="image/*"
          aria-label={t('components.post_form.aria_add_image')}
          onChange={this.handleTakeFile}
        />
        <ActionButton as="span" aria-label={t('components.post_form.aria_add_image')}>
          <AddImgIcon />
        </ActionButton>
      </FileInputWrapper>
    );
  }

  renderPostButton() {
    const { currentUser, isEdit, isArticle, onClose, t } = this.props;
    const {
      isSubmitting,
      body,
      attachments,
      isImageLoading,
      communityId,
      isChooseCommunityTooltipOpen,
      isRewardsForPostTooltipOpen,
    } = this.state;

    let isDisabled = !communityId || isSubmitting || isImageLoading;

    const doc = body?.document;

    if (!isDisabled) {
      if (isArticle) {
        isDisabled = !doc || !validateArticle(doc);
      } else {
        isDisabled = !validatePost(doc, attachments);
      }
    }

    let title = t('components.post_form.post');

    if (isEdit) {
      title = t('common.save');
    } else if (!currentUser) {
      title = t('components.post_form.sign_up_post');
    }

    const isChooseCommunityTooltipAllowed =
      !communityId &&
      isChooseCommunityTooltipOpen &&
      !sessionStorage.getItem(IS_CHOOSE_COMMUNITY_TOOLTIP_SHOWED);

    const isRewardsForPostTooltipAllowed =
      !isDisabled &&
      isRewardsForPostTooltipOpen &&
      !getFieldValue(DISABLE_TOOLTIPS_KEY, ONBOARDING_TOOLTIP_TYPE.REWARDS_FOR_POST);

    return (
      <PostButtonWrapper>
        <AsyncButton
          primary
          small
          name="post-form__submit"
          isProcessing={isSubmitting}
          disabled={isDisabled}
          onClick={this.prePost}
        >
          {title}
        </AsyncButton>
        {!isChooseCommunityTooltipAllowed && isRewardsForPostTooltipAllowed ? (
          <RewardForPostTooltip
            isAuthorized={Boolean(currentUser)}
            onClose={this.onCloseRewardsForPostTooltip}
            onCloseEditor={onClose}
          />
        ) : null}
      </PostButtonWrapper>
    );
  }

  renderEditor() {
    const { isEdit, isMobile, currentUser, isArticle, onClose, t } = this.props;
    const {
      isImageLoading,
      initialValue,
      communityId,
      isSubmitting,
      isNsfw,
      isChooseCommunityTooltipOpen,
    } = this.state;

    const isActionsOnTop = isMobile || isArticle;

    return (
      <>
        <ScrollWrapper>
          {isImageLoading ? <SplashLoader /> : null}
          {isActionsOnTop ? null : (
            <AuthorLine>
              <AuthorAvatarStyled userId={currentUser?.userId} useLink allowEmpty />
              <AuthorName>
                {currentUser ? currentUser.username : t('components.post_form.you')}
              </AuthorName>
            </AuthorLine>
          )}
          <PostEditorStyled
            id="post-editor"
            readOnly={isSubmitting}
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
              <ActionButton
                aria-label={t('components.post_form.aria_nsfw')}
                isActive={isNsfw}
                onClick={this.onNsfwClick}
              >
                <ActionText>18+</ActionText>
              </ActionButton>
              {this.renderImageButton()}
              {isArticle || isEdit ? null : (
                <ToggleFeature flag={FEATURE_ARTICLE}>
                  <>
                    <Splitter />
                    <ActionTextButton
                      aria-label={t('components.post_form.aria_article')}
                      onClick={this.onArticleClick}
                    >
                      <ArticleIcon />
                      <ActionText>{t('components.post_form.article')}</ActionText>
                    </ActionTextButton>
                  </>
                </ToggleFeature>
              )}
            </ActionsWrapperTop>
            <ActionsWrapperBottom>
              {isMobile || isArticle ? null : (
                <ChooseCommunity
                  communityId={communityId}
                  disabled={isEdit}
                  onSelect={this.onCommunityChange}
                  isChooseCommunityTooltipOpen={isChooseCommunityTooltipOpen}
                  onCloseEditor={onClose}
                  onCloseChooseCommunityTooltip={this.onCloseChooseCommunityTooltip}
                />
              )}
              {!isActionsOnTop || isMobile ? this.renderPostButton() : null}
            </ActionsWrapperBottom>
          </ActionsWrapper>
        ) : null}
      </>
    );
  }

  renderCoverChoosing() {
    const { currentUser, t } = this.props;
    const { coverUrl } = this.state;

    return (
      <>
        <ChoosePostContainer>
          <ChoosePostCover coverUrl={coverUrl} onChange={this.onCoverChange} />
        </ChoosePostContainer>
        <BigPostButton onClick={this.post}>
          {currentUser ? t('components.post_form.post') : t('components.post_form.sign_up_post')}
        </BigPostButton>
      </>
    );
  }

  render() {
    const { isEdit, isMobile, currentUser, isArticle, onClose, t } = this.props;
    const { communityId, isCoverChoosing } = this.state;

    return (
      <Wrapper ref={this.wrapperRef} isAddBottomGap={!isCoverChoosing}>
        {isArticle && !isMobile ? (
          <ArticleHeader>
            <AuthorBlock>
              <AvatarStyled userId={currentUser?.userId} />
              <CurrentUsername>
                {currentUser ? currentUser.username : t('components.post_form.you')}
              </CurrentUsername>
            </AuthorBlock>
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
              mobileTopOffset={TOP_ACTIONS_HEIGHT}
              onSelect={this.onCommunityChange}
            />
          </>
        ) : null}
        {isCoverChoosing ? this.renderCoverChoosing() : this.renderEditor()}
      </Wrapper>
    );
  }
}

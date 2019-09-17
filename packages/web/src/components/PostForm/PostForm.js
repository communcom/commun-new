/* eslint-disable no-underscore-dangle */
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { transparentize } from 'polished';
import getSlug from 'speakingurl';
import update from 'immutability-helper';

import { Router } from 'shared/routes';
import { POST_DRAFT_KEY } from 'shared/constants';
import { validateAndUpload } from 'utils/uploadImage';
import { displayError } from 'utils/toastsMessages';
import { checkIsEditorEmpty, loadDraft, saveDraft, removeDraft } from 'utils/editor';
import { postType } from 'types/common';
import { Dropdown, Loader, CircleLoader, CONTAINER_DESKTOP_PADDING } from '@commun/ui';
import { PostEditor } from 'components/editor';
import Embed from 'components/Embed';
import Avatar from 'components/Avatar';

import { HEADER_DESKTOP_HEIGHT } from 'components/Header/constants';

import {
  AddImgModal,
  CloseEditor,
  CrossIcon,
  Wrapper,
  FileInput,
  IconAddImg,
  IconEmoji,
} from './PostForm.styled';

function slug(text) {
  return getSlug(text.replace(/[<>]/g, ''), { truncate: 128 })
    .replace(/_/g, '-')
    .replace(/-{2,}/g, '-');
}

const exampleItems = [
  {
    label: 'JavaScript',
    value: 'javascript',
  },
  {
    label: 'React',
    value: 'react',
  },
  {
    label: 'Redux',
    value: 'redux',
  },
];

const AvatarModalStyled = styled(Avatar)`
  margin-right: 16px;
`;

const PostEditorStyled = styled(PostEditor)`
  flex: 1;
  margin-top: 13px;
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

const EmbedsWrapper = styled.div`
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

const SelectStyled = styled(Dropdown)`
  flex: 1;
  margin-right: 16px;
`;

export default class PostForm extends Component {
  static propTypes = {
    fetchPost: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired,
    isCommunity: PropTypes.bool,
    isEdit: PropTypes.bool,
    post: postType,
    loggedUserId: PropTypes.string,
    waitForTransaction: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    isChoosePhoto: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isCommunity: false,
    isEdit: false,
    post: null,
    loggedUserId: null,
    onClose: null,
  };

  state = {
    isSubmitting: false,
    title: '',
    body: '',
    resources: [],
    isImageLoading: false,
  };

  fileInputRef = createRef();

  wrapperRef = createRef();

  componentDidMount() {
    const { post, isEdit, isChoosePhoto, isCommunity } = this.props;
    const draft = loadDraft(POST_DRAFT_KEY);

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

    if (isEdit && post) {
      const mappedResources = post.content?.embeds?.map(embed => ({
        id: embed?.id || embed?._id,
        ...(embed?.result || {}),
      }));
      this.setState({
        resources: mappedResources,
        body: post.content?.body?.full,
      });
    } else if (draft) {
      this.setState({
        body: draft?.body || '',
        resources: draft?.resources || [],
        title: draft?.title || '',
      });
    }
  }

  componentWillUnmount() {
    saveDraft.cancel();
  }

  getInitialValue() {
    const { isEdit, post } = this.props;
    const postDraft = loadDraft(POST_DRAFT_KEY);

    if (isEdit && post) {
      // for html slate serializer
      return `<h1>${post.content.title}</h1>${post.content.body.full}`;
    }

    if (postDraft) {
      return `<h1>${postDraft.title}</h1>${postDraft.body}`;
    }

    return '';
  }

  checkIsFormValueChanged = () => {
    const { isEdit, post } = this.props;
    const { body, resources } = this.state;

    if (isEdit && post) {
      return post.content?.body?.full !== body && post.content?.embeds?.length !== resources.length;
    }
    return false;
  };

  handleLinkFound = newResource => {
    const { resources } = this.state;
    const draft = loadDraft(POST_DRAFT_KEY) || {};

    if (resources.find(resource => resource.url === newResource.url)) {
      return;
    }

    const newEmbed = { ...newResource, id: Date.now() };
    const updatedDraft = update(draft || {}, {
      resources: draftResources =>
        update(draftResources || [], {
          $push: [newEmbed],
        }),
    });

    this.setState(
      {
        resources: update(resources || [], {
          $push: [newEmbed],
        }),
      },
      saveDraft(updatedDraft, POST_DRAFT_KEY)
    );
  };

  handleChange = (title, body) => {
    const { resources } = this.state;
    this.setState({ title, body }, saveDraft({ title, body, resources }, POST_DRAFT_KEY));
  };

  handleSubmit = async () => {
    // eslint-disable-next-line no-shadow
    const {
      isEdit,
      fetchPost,
      createPost,
      updatePost,
      post,
      onClose,
      waitForTransaction,
    } = this.props;
    const { title, body, resources } = this.state;

    this.setState({
      isSubmitting: true,
    });
    try {
      // if editing post
      if (isEdit) {
        const result = await updatePost({
          contentId: post.contentId,
          title,
          body,
          resources,
        });

        await waitForTransaction(result.transaction_id);
        await fetchPost(post.contentId);

        onClose();
        Router.pushRoute('post', post.contentId);
      } else {
        const permlink = slug(title, { lower: true });
        const result = await createPost({
          permlink,
          title,
          body,
          resources,
        });

        await waitForTransaction(result.transaction_id);
        removeDraft(POST_DRAFT_KEY);

        // eslint-disable-next-line camelcase
        const { author } = result.processed.action_traces[0].act.data.message_id;

        Router.pushRoute('post', {
          userId: author,
          permlink,
        });
      }
    } catch (err) {
      displayError('Post submitting is failed', err);

      this.setState({
        isSubmitting: false,
      });
    }
  };

  handleResourceRemove = id => {
    const { resources } = this.state;
    const draft = loadDraft(POST_DRAFT_KEY) || {};
    const filteredResources = resources.filter(resource => resource.id !== id);

    const updatedDraft = update(draft || {}, {
      resources: draftResources =>
        update(draftResources || [], {
          $set: filteredResources,
        }),
    });

    this.setState(
      {
        resources: filteredResources,
      },
      saveDraft(updatedDraft, POST_DRAFT_KEY)
    );
  };

  handleTakeFile = async e => {
    const file = e.target && e.target.files[0];

    if (file) {
      try {
        this.setState({ isImageLoading: true });
        const url = await validateAndUpload(file);
        if (url) {
          this.handleLinkFound({
            type: 'photo',
            url,
          });
        }
        this.setState({ isImageLoading: false });
      } catch (err) {
        displayError('Image uploading failed:', err);
        this.setState({ isImageLoading: false });
      }
    }
  };

  renderEmbeds = () => {
    const { resources } = this.state;

    if (!resources || !resources.length) {
      return null;
    }

    return (
      <EmbedsWrapper>
        {resources.map(resource => (
          <Embed key={resource.id} data={resource} onClose={this.handleResourceRemove} />
        ))}
      </EmbedsWrapper>
    );
  };

  render() {
    const { isCommunity, isEdit, loggedUserId, onClose } = this.props;
    const { isSubmitting, title, body, resources, isImageLoading } = this.state;

    const isDisabledPosting =
      isSubmitting ||
      !title ||
      checkIsEditorEmpty(body, resources) ||
      (isEdit && !this.checkIsFormValueChanged());

    return (
      <Wrapper ref={this.wrapperRef}>
        <CloseEditor aria-label="Close editor" onClick={onClose}>
          <CrossIcon name="cross" />
        </CloseEditor>
        <ScrollWrapper>
          <OpenEditorWrapper>
            {isImageLoading ? <CircleLoader /> : null}
            <AvatarModalStyled userId={loggedUserId} useLink />
            <PostEditorStyled
              id="post-editor"
              initialValue={this.getInitialValue()}
              onChange={this.handleChange}
              onLinkFound={this.handleLinkFound}
            />
          </OpenEditorWrapper>
          {this.renderEmbeds()}
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
                <IconAddImg name="photo-solid" />
              </AddImgModal>
            </ActionsWrapperLeft>
            <ActionsWrapperRight>
              <IconEmoji name="emotion" width={20} height={20} />
            </ActionsWrapperRight>
          </ActionsWrapperTop>
          <ActionsWrapperBottom>
            <SelectStyled disabled={isEdit} items={exampleItems} onSelect={() => {}} />
            <SubmitButton
              name="post-form__submit"
              disabled={isDisabledPosting}
              communityPage={isCommunity}
              onClick={this.handleSubmit}
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

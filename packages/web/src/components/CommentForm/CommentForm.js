import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ToastsManager from 'toasts-manager';
import update from 'immutability-helper';

import { COMMENT_DRAFT_KEY } from 'shared/constants';
import { commentType, contentIdType } from 'types/common';
import { checkPressedKey } from 'utils/keyPress';
import { displayError } from 'utils/toastsMessages';
import { checkIsEditorEmpty, loadDraft, saveDraft, removeDraft } from 'utils/editor';
import { Loader, KEY_CODES } from '@commun/ui';
import { formatContentId } from 'store/schemas/gate';
import { CommentEditor } from 'components/editor';
import Embed from 'components/Embed';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: ${props => (props.maxWidth ? `${props.maxWidth}px` : '100%')};
`;

const WrapperBlock = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.contextWhite};
  overflow: hidden;
`;

const WrapperEditor = styled.div`
  display: flex;
  flex: 1;
  max-width: 100%;
  align-items: center;
`;

const EmbedsWrapper = styled.div`
  margin: 16px;
`;

const EditorMock = styled.div`
  height: 36px;
  background-color: transparent;
`;

const LoaderStyled = styled(Loader)`
  padding-right: 16px;
  color: ${({ theme }) => theme.colors.contextBlue};
`;

const ActionsPanel = styled.div`
  display: flex;
  align-items: center;
  margin-top: 11px;
  padding: 6px 0;
`;

const ActionButton = styled.button.attrs({ type: 'button' })`
  margin-left: 16px;
  font-size: 13px;
  font-weight: 700;
  transition: color 0.15s;

  ${({ theme }) => `
    color: ${theme.colors.contextGrey};

    &:hover,
    &:focus {
      color: ${theme.colors.contextBlue};
    }
  `};
`;

export default class CommentForm extends Component {
  static propTypes = {
    contentId: contentIdType.isRequired,
    parentPostId: contentIdType,
    comment: commentType,
    isSSR: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool,
    isReply: PropTypes.bool,
    filterSortBy: PropTypes.string.isRequired,

    createComment: PropTypes.func.isRequired,
    updateComment: PropTypes.func.isRequired,
    fetchPost: PropTypes.func.isRequired,
    fetchPostComments: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    onDone: PropTypes.func,
  };

  static defaultProps = {
    parentPostId: null,
    comment: null,
    isEdit: false,
    isReply: false,
    onClose: null,
    onDone: null,
  };

  state = {
    wrapperMaxWidth: '',
    isSubmitting: false,
    body: '',
    resources: [],
  };

  editorRef = createRef();

  wrapperRef = createRef();

  componentDidMount() {
    const { isEdit, comment, contentId } = this.props;
    const permlink = formatContentId(contentId);
    const commentDraft = loadDraft(COMMENT_DRAFT_KEY, permlink);
    let wrapperMaxWidth = '';

    if (this.wrapperRef.current) {
      wrapperMaxWidth = this.wrapperRef.current.offsetWidth;
    }

    if (isEdit && comment) {
      this.setState({
        body: comment.content?.body?.full,
        wrapperMaxWidth,
      });
    } else if (commentDraft) {
      this.setState({
        body: commentDraft?.body || '',
        resources: commentDraft?.resources || [],
        wrapperMaxWidth,
      });
    }
  }

  componentWillUnmount() {
    saveDraft.cancel();
  }

  getInitialValue() {
    const { isEdit, comment, contentId } = this.props;

    if (isEdit && comment) {
      // for html slate serializer
      return comment.content?.body?.full;
    }

    const permlink = formatContentId(contentId);
    const commentDraft = loadDraft(COMMENT_DRAFT_KEY, permlink);

    if (commentDraft) {
      return commentDraft.body;
    }

    return '';
  }

  checkIsFormValueChanged = () => {
    const { isEdit, comment } = this.props;
    const { body, resources } = this.state;

    if (isEdit && comment) {
      return (
        comment.content?.body?.full !== body && comment.content?.embeds?.length !== resources.length
      );
    }
    return false;
  };

  handleLinkFound = newResource => {
    const { contentId } = this.props;
    const { resources } = this.state;
    const permlink = formatContentId(contentId);
    const draft = loadDraft(COMMENT_DRAFT_KEY, permlink);

    if (resources.some(resource => resource.url === newResource.url)) {
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
      saveDraft(updatedDraft, COMMENT_DRAFT_KEY)
    );
  };

  handleResourceRemove = id => {
    const { contentId } = this.props;
    const { resources } = this.state;
    const permlink = formatContentId(contentId);
    const draft = loadDraft(COMMENT_DRAFT_KEY, permlink);
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
      saveDraft(updatedDraft, COMMENT_DRAFT_KEY)
    );
  };

  renderEmbeds = () => {
    const { resources } = this.state;

    if (!resources || !resources.length) {
      return null;
    }

    return (
      <EmbedsWrapper>
        {resources.map(resource => (
          <Embed
            isCompact
            isInForm
            key={resource.id}
            data={resource}
            onClose={this.handleResourceRemove}
          />
        ))}
      </EmbedsWrapper>
    );
  };

  handleChange = body => {
    const { contentId } = this.props;
    const { resources } = this.state;

    if (contentId) {
      const permlink = formatContentId(contentId);
      this.setState({ body }, saveDraft({ body, resources, permlink }, COMMENT_DRAFT_KEY));
    } else {
      this.setState({ body });
    }
  };

  handleKeyDown = (e, editor, next) => {
    if (checkPressedKey(e) === KEY_CODES.ESC) {
      const { onClose } = this.props;

      if (!onClose) {
        return next();
      }

      return onClose();
    }

    if (checkPressedKey(e) !== KEY_CODES.ENTER) {
      return next();
    }

    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      return editor.insertText('\n');
    }

    return this.handleSubmit();
  };

  // eslint-disable-next-line consistent-return
  handleSubmit = async () => {
    const {
      contentId,
      parentPostId,
      isEdit,
      isReply,
      createComment,
      updateComment,
      fetchPost,
      fetchPostComments,
      onDone,
      waitForTransaction,
      filterSortBy,
    } = this.props;
    const { body, resources } = this.state;

    if (checkIsEditorEmpty(body, resources)) {
      return ToastsManager.error('Comment body cannot be empty!');
    }

    this.setState({
      isSubmitting: true,
    });

    try {
      let result;

      if (isEdit) {
        result = await updateComment({
          contentId,
          body,
          resources,
        });
      } else {
        result = await createComment({
          contentId,
          body,
          resources,
        });
      }

      // clear comment editor field
      if (this.editorRef.current) {
        this.editorRef.current.editor.moveToRangeOfDocument().delete();
      }
      removeDraft(COMMENT_DRAFT_KEY);
      await waitForTransaction(result.transaction_id);

      let postContentId = contentId;

      if ((isReply || isEdit) && parentPostId) {
        postContentId = parentPostId;
      }

      await Promise.all([
        fetchPost(postContentId),
        fetchPostComments({ contentId: postContentId, sortBy: filterSortBy }),
      ]);

      this.setState({
        resources: [],
        isSubmitting: false,
      });

      if (onDone) {
        onDone();
      }
    } catch (err) {
      displayError('Comment posting is failed', err);

      this.setState({
        isSubmitting: false,
      });
    }
  };

  render() {
    const { contentId, isSSR, isEdit, className, onClose } = this.props;
    const { isSubmitting, wrapperMaxWidth, body, resources } = this.state;

    const isDisabledPosting =
      isSubmitting ||
      checkIsEditorEmpty(body, resources) ||
      (isEdit && !this.checkIsFormValueChanged());

    if (isSSR) {
      return (
        <Wrapper className={className}>
          <EditorMock />
        </Wrapper>
      );
    }

    return (
      <Wrapper ref={this.wrapperRef} maxWidth={wrapperMaxWidth}>
        <WrapperBlock className={className}>
          <WrapperEditor>
            <CommentEditor
              forwardedRef={this.editorRef}
              id={formatContentId(contentId)}
              initialValue={this.getInitialValue()}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              onLinkFound={this.handleLinkFound}
            />
            {isSubmitting ? <LoaderStyled /> : null}
          </WrapperEditor>
          {this.renderEmbeds()}
        </WrapperBlock>
        {isEdit && (
          <ActionsPanel>
            <ActionButton name="comment-form__cancel-editing" onClick={onClose}>
              Cancel
            </ActionButton>
            <ActionButton
              name="comment-form__submit-editing"
              disabled={isDisabledPosting}
              onClick={this.handleSubmit}
            >
              Done
            </ActionButton>
          </ActionsPanel>
        )}
      </Wrapper>
    );
  }
}

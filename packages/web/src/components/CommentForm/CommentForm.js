import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ToastsManager from 'toasts-manager';

import { COMMENT_DRAFT_KEY } from 'shared/constants';
import { commentType, commentContentType, contentIdType } from 'types/common';
import { checkPressedKey } from 'utils/keyPress';
import { getCommentPermlink } from 'utils/common';
import { displayError } from 'utils/toastsMessages';
import { checkIsEditorEmpty } from 'utils/editor';
import { Loader, KEY_CODES } from '@commun/ui';
import { formatContentId } from 'store/schemas/gate';
import { CommentEditor } from 'components/editor';
import Embed from 'components/Embed';
import EditorForm from 'components/EditorForm';

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

export default class CommentForm extends EditorForm {
  static propTypes = {
    contentId: contentIdType.isRequired,
    parentCommentId: contentIdType.isRequired,
    parentPostId: contentIdType,
    comment: commentType,
    defaultValue: commentContentType,
    isSSR: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool,
    isReply: PropTypes.bool,

    createComment: PropTypes.func.isRequired,
    updateComment: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    fetchComment: PropTypes.func.isRequired,
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

  static DRAFT_KEY = COMMENT_DRAFT_KEY;

  state = {
    wrapperMaxWidth: '',
    isSubmitting: false,
    editorMode: 'comment',
    ...this.getInitialValue(this.props.comment, this.props.defaultValue),
  };

  editorRef = createRef();

  wrapperRef = createRef();

  componentDidMount() {
    if (this.wrapperRef.current) {
      const wrapperMaxWidth = this.wrapperRef.current.offsetWidth;

      this.setState({
        wrapperMaxWidth,
      });
    }
  }

  // checkIsFormValueChanged = () => {
  //   const { isEdit, comment } = this.props;
  //   const { body, resources } = this.state;
  //
  //   if (isEdit && comment) {
  //     return (
  //       comment.content?.body?.full !== body && comment.content?.embeds?.length !== resources.length
  //     );
  //   }
  //   return false;
  // };

  renderEmbeds = () => {
    const { attachments } = this.state;

    if (!attachments || !attachments.length) {
      return null;
    }

    return (
      <EmbedsWrapper>
        {attachments.map(attach => (
          <Embed
            key={attach.id}
            data={attach}
            isCompact
            isInForm
            onClose={this.handleResourceRemove}
          />
        ))}
      </EmbedsWrapper>
    );
  };

  handleKeyDown = (e, editor, next) => {
    const { onClose } = this.props;
    const code = checkPressedKey(e);

    switch (code) {
      case KEY_CODES.ESC:
        if (!onClose) {
          return next();
        }

        return onClose();

      case KEY_CODES.ENTER:
        e.preventDefault();

        if (e.ctrlKey || e.metaKey) {
          return editor.insertText('\n');
        }

        return this.post();

      default:
        return next();
    }
  };

  // eslint-disable-next-line consistent-return
  handleSubmit = async comment => {
    const {
      contentId,
      parentCommentId,
      parentPostId,
      loggedUserId,
      isEdit,
      createComment,
      updateComment,
      onDone,
      waitForTransaction,
      fetchComment,
    } = this.props;

    if (checkIsEditorEmpty(comment)) {
      return ToastsManager.error('Comment body cannot be empty!');
    }

    this.setState({
      isSubmitting: true,
    });

    const body = JSON.stringify(comment);

    try {
      let results;
      let fetchCommentParams;

      if (isEdit) {
        results = await updateComment({
          communityId: contentId.communityId,
          contentId,
          body,
        });

        fetchCommentParams = { contentId };
      } else {
        const parentContentId = parentCommentId || parentPostId;
        const permlink = getCommentPermlink(parentContentId);

        results = await createComment({
          communityId: parentContentId.communityId,
          parentId: parentContentId,
          permlink,
          body,
        });

        fetchCommentParams = {
          contentId: {
            permlink,
            userId: loggedUserId,
            communityId: parentContentId.communityId,
          },
          parentCommentId,
          parentPostId,
        };
      }

      this.removeDraft();

      await waitForTransaction(results.transaction_id);

      this.clearInput();

      this.setState({
        body: null,
        attachments: [],
        isSubmitting: false,
      });

      if (onDone) {
        onDone();
      }

      await fetchComment(fetchCommentParams);
    } catch (err) {
      displayError('Comment posting is failed', err);

      this.setState({
        isSubmitting: false,
      });
    }
  };

  clearInput() {
    if (this.editorRef.current && this.editorRef.current.editor) {
      this.editorRef.current.editor.moveToRangeOfDocument().delete();
    }
  }

  render() {
    const {
      contentId,
      parentCommentId,
      parentPostId,
      isSSR,
      isEdit,
      className,
      onClose,
    } = this.props;
    const { isSubmitting, wrapperMaxWidth, body, attachments, initialValue } = this.state;

    const isDisabledPosting = isSubmitting || checkIsEditorEmpty(body, attachments);

    if (isSSR) {
      return (
        <Wrapper className={className}>
          <EditorMock />
        </Wrapper>
      );
    }

    const parentContentId = parentCommentId || parentPostId;

    return (
      <Wrapper ref={this.wrapperRef} maxWidth={wrapperMaxWidth}>
        <WrapperBlock className={className}>
          <WrapperEditor>
            <CommentEditor
              forwardedRef={this.editorRef}
              id={formatContentId(contentId || parentContentId)}
              initialValue={initialValue}
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
              onClick={this.post}
            >
              Done
            </ActionButton>
          </ActionsPanel>
        )}
      </Wrapper>
    );
  }
}

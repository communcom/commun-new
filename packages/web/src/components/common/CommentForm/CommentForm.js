import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ToastsManager from 'toasts-manager';

import { Loader, KEY_CODES, styles } from '@commun/ui';
import { Icon } from '@commun/icons';
import { COMMENT_DRAFT_KEY } from 'shared/constants';
import { commentType, commentContentType, contentIdType } from 'types/common';
import { checkPressedKey } from 'utils/keyPress';
import { getCommentPermlink } from 'utils/common';
import { displayError } from 'utils/toastsMessages';
import { checkIsEditorEmpty } from 'utils/editor';
import { formatContentId } from 'store/schemas/gate';

import { CommentEditor } from 'components/editor';
import Embed from 'components/common/Embed';
import EditorForm from 'components/common/EditorForm';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: ${props => (props.maxWidth ? `${props.maxWidth}px` : '100%')};
`;

const FirstLineWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  & > :not(:last-child) {
    margin-right: 8px;
  }
`;

const WrapperBlock = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.background};
  overflow: hidden;
`;

const WrapperEditor = styled.div`
  display: flex;
  flex: 1;
  max-width: 100%;
  align-items: center;
`;

const EmbedsWrapper = styled.div`
  margin: 8px 16px;
`;

const EditorMock = styled.div`
  height: 36px;
  background-color: transparent;
`;

const LoaderStyled = styled(Loader)`
  padding-right: 16px;
  color: ${({ theme }) => theme.colors.blue};
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
    color: ${theme.colors.gray};

    &:hover,
    &:focus {
      color: ${theme.colors.blue};
    }
  `};
`;

const FileInput = styled.input`
  ${styles.visuallyHidden};

  &:hover + label,
  &:focus + label {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const IconAddImg = styled(Icon)`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const AddImgModal = styled.label`
  position: relative;
  display: flex;
  padding-top: 8px;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;
  overflow: hidden;
  cursor: pointer;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

export default class CommentForm extends EditorForm {
  static propTypes = {
    contentId: contentIdType,
    parentCommentId: contentIdType,
    parentPostId: contentIdType,
    comment: commentType,
    defaultValue: commentContentType,
    isHydration: PropTypes.bool.isRequired,
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
    ...this.getInitialValue(this.props.comment?.document, this.props.defaultValue),
  };

  editorRef = createRef();

  fileInputRef = createRef();

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
    const { isSubmitting } = this.state;
    const code = checkPressedKey(e);

    switch (code) {
      case KEY_CODES.ESC:
        if (!onClose) {
          return next();
        }

        return onClose();

      case KEY_CODES.ENTER:
        e.preventDefault();

        if (isSubmitting) {
          return false;
        }

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
      isHydration,
      isEdit,
      className,
      onClose,
    } = this.props;
    const { isSubmitting, wrapperMaxWidth, body, attachments, initialValue } = this.state;

    const isDisabledPosting = isSubmitting || checkIsEditorEmpty(body, attachments);

    if (isHydration) {
      return (
        <Wrapper className={className}>
          <EditorMock />
        </Wrapper>
      );
    }

    const parentContentId = parentCommentId || parentPostId;

    return (
      <Wrapper ref={this.wrapperRef} maxWidth={wrapperMaxWidth}>
        <FirstLineWrapper>
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
          <FileInput
            ref={this.fileInputRef}
            id="add-photo-editor-open"
            type="file"
            accept="image/*"
            aria-label="Add file"
            onChange={this.handleTakeFile}
          />
          <AddImgModal htmlFor="add-photo-editor-open">
            <IconAddImg name="photo" />
          </AddImgModal>
        </FirstLineWrapper>
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

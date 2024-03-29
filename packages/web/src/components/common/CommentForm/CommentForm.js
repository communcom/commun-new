import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Button, KEY_CODES, Loader, styles } from '@commun/ui';

import { commentDocumentType, contentIdType, extendedCommentType } from 'types/common';
import { COMMENT_DRAFT_KEY } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { getCommentPermlink } from 'utils/common';
import { validateComment } from 'utils/editor';
import { checkPressedKey } from 'utils/keyboard';
import { displayError } from 'utils/toastsMessages';
import { SHOW_MODAL_SIGNUP } from 'store/constants';
import { formatContentId } from 'store/schemas/gate';

import AsyncAction from 'components/common/AsyncAction';
import EditorForm from 'components/common/EditorForm';
import Embed from 'components/common/Embed';
import { CommentEditor } from 'components/editor';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: 100%;
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
  flex-direction: row;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  overflow: hidden;
`;

const Content = styled.div`
  flex-direction: column;
  flex: 1;
  max-width: 100%;
`;

const WrapperEditor = styled.div`
  display: flex;
  flex: 1;
  max-width: 100%;
  align-items: center;
`;

const EmbedsWrapper = styled.div`
  margin: 8px 16px 16px;

  & > div {
    max-width: calc(100% - 32px);
  }
`;

const EditorMock = styled.div`
  height: 36px;
  background-color: transparent;
`;

const LoaderStyled = styled(Loader)`
  padding: 5px 16px 5px 8px;
  color: ${({ theme }) => theme.colors.blue};
`;

const ActionsPanel = styled.div`
  display: flex;
  align-items: center;
  margin-top: 6px;
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

const Label = styled.label`
  display: block;

  ${is('hasAttachment')`
    display: none;
  `};
`;

const AddImgWrapper = styled.span`
  position: relative;
  display: flex;
  padding: 8px 16px 8px 8px;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;
  cursor: pointer;

  ${is('isDisabled')`
    color: ${({ theme }) => theme.colors.gray} !important;
  `};

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

@withTranslation()
export default class CommentForm extends EditorForm {
  static propTypes = {
    contentId: contentIdType,
    parentCommentId: contentIdType,
    visuallyParentCommentId: contentIdType,
    parentPostId: contentIdType,
    comment: extendedCommentType,
    defaultValue: commentDocumentType,
    isHydration: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool,
    isReply: PropTypes.bool,
    isMaintenance: PropTypes.bool,
    autoFocus: PropTypes.bool,

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
    isMaintenance: false,
    autoFocus: false,
    onClose: null,
    onDone: null,
  };

  static DRAFT_KEY = COMMENT_DRAFT_KEY;

  editorRef = createRef();

  fileInputRef = createRef();

  constructor(props) {
    super(props);

    const { comment, defaultValue } = this.props;

    this.state = {
      body: null,
      isSubmitting: false,
      ...this.getInitialValue(comment?.document, defaultValue),
    };
  }

  handleKeyDown = (e, editor, next) => {
    const { onClose, isMaintenance } = this.props;
    const { isSubmitting, body, attachments } = this.state;
    const code = checkPressedKey(e);

    const isDisabledPosting =
      isSubmitting || isMaintenance || !validateComment(body?.document, attachments);

    switch (code) {
      case KEY_CODES.ESC:
        if (!onClose) {
          return next();
        }

        return onClose();

      case KEY_CODES.ENTER:
        e.preventDefault();

        if (isDisabledPosting) {
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

  onCancelClick = () => {
    const { onClose } = this.props;

    this.removeDraftAndStopSaving();
    onClose();
  };

  // eslint-disable-next-line consistent-return
  handleSubmit = async ({ document }) => {
    const {
      contentId,
      parentCommentId,
      parentPostId,
      isEdit,
      createComment,
      updateComment,
      onDone,
      waitForTransaction,
      fetchComment,
      checkAuth,
      t,
    } = this.props;

    this.setState({
      isSubmitting: true,
    });

    const body = JSON.stringify(document);

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
        const userId = await checkAuth({
          allowLogin: true,
          type: SHOW_MODAL_SIGNUP,
        });

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
            userId,
            communityId: parentContentId.communityId,
          },
          parentCommentId,
          parentPostId,
        };
      }

      this.removeDraftAndStopSaving();

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
      displayError(t('components.comment_form.toastsMessages.posting_failed'), err);

      this.setState({
        isSubmitting: false,
      });
    }
  };

  // eslint-disable-next-line class-methods-use-this
  getEditorMode() {
    return 'comment';
  }

  clearInput() {
    if (this.editorRef.current && this.editorRef.current.editor) {
      this.editorRef.current.editor.moveToRangeOfDocument().delete();
    }
  }

  renderEmbeds() {
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
            onRemove={this.handleAttachRemove}
          />
        ))}
      </EmbedsWrapper>
    );
  }

  render() {
    const {
      loggedUserId,
      contentId,
      parentCommentId,
      parentPostId,
      isHydration,
      isEdit,
      isMaintenance,
      autoFocus,
      className,
      t,
    } = this.props;
    const { isSubmitting, body, attachments, initialValue } = this.state;

    const isDisabledPosting = isSubmitting || !validateComment(body?.document, attachments);

    if (isHydration) {
      return (
        <Wrapper className={className}>
          <EditorMock />
        </Wrapper>
      );
    }

    const parentContentId = parentCommentId || parentPostId;

    return (
      <Wrapper className={className}>
        <FirstLineWrapper>
          <WrapperBlock>
            <Content>
              <WrapperEditor>
                <CommentEditor
                  editorRef={this.editorRef}
                  id={formatContentId(contentId || parentContentId)}
                  initialValue={initialValue}
                  autoFocus={autoFocus}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  onLinkFound={this.handleLinkFound}
                />
              </WrapperEditor>
              {this.renderEmbeds()}
            </Content>

            {isEdit && isSubmitting ? (
              <LoaderStyled />
            ) : (
              <Label hasAttachment={attachments.length}>
                <FileInput
                  ref={this.fileInputRef}
                  type="file"
                  accept="image/*"
                  aria-label={t('components.comment_form.add_file')}
                  disabled={isMaintenance}
                  onChange={this.handleTakeFile}
                />
                <AddImgWrapper isDisabled={isSubmitting || isMaintenance}>
                  <IconAddImg name="photo" />
                </AddImgWrapper>
              </Label>
            )}
          </WrapperBlock>
          {!isEdit ? (
            <AsyncAction onClickHandler={this.post} isProcessing={isSubmitting}>
              <Button primary disabled={isDisabledPosting || isMaintenance}>
                {loggedUserId
                  ? t('components.comment_form.send')
                  : t('components.comment_form.sign_up_send')}
              </Button>
            </AsyncAction>
          ) : null}
        </FirstLineWrapper>
        {isEdit && (
          <ActionsPanel>
            <ActionButton name="comment-form__cancel-editing" onClick={this.onCancelClick}>
              {t('common.cancel')}
            </ActionButton>
            <ActionButton
              name="comment-form__submit-editing"
              disabled={isDisabledPosting || isMaintenance}
              onClick={this.post}
            >
              {t('common.done')}
            </ActionButton>
          </ActionsPanel>
        )}
      </Wrapper>
    );
  }
}

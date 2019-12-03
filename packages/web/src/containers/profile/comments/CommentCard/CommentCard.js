import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import dayjs from 'dayjs';

import { up } from '@commun/ui';
import { Icon } from '@commun/icons';
import { contentIdType, extendedCommentType } from 'types/common';
import { preparePostWithMention } from 'utils/editor';
import { displayError } from 'utils/toastsMessages';

import VotePanel from 'components/common/VotePanel';
import Avatar from 'components/common/Avatar';
import CommentForm from 'components/common/CommentForm';
import AttachmentsBlock from 'components/common/AttachmentsBlock';
import BodyRender from 'components/common/BodyRender';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';

const Wrapper = styled.div`
  width: 100%;
  padding: 15px 15px 0;
  background-color: #fff;
  border-radius: 6px;

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  ${is('isEdit')`
    display: flex;
    padding: 10px 0;
  `};
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 10px;
  overflow: hidden;
  cursor: pointer;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
`;

const InfoWrapper = styled.div`
  margin-left: 10px;
`;

const Author = styled.p`
  font-size: 15px;
  font-weight: bold;
  white-space: nowrap;
`;

const ActionsPanel = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
`;

const ActionButton = styled.button.attrs({ type: 'button' })`
  font-size: 13px;
  font-weight: 600;
  transition: color 0.15s;
  color: ${({ theme }) => theme.colors.blue};
`;

const Created = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0;
`;

const WrappingCurrentUserLink = styled(Avatar)`
  display: none;
  margin-right: 10px;

  ${up.tablet} {
    display: block;
  }
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
  margin-top: 24px;
  overflow: hidden;
`;

const DropDownMenuStyled = styled(DropDownMenu)`
  margin-left: auto;
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-right: -11px;
  color: #000;
`;

const MoreIcon = styled(Icon).attrs({
  name: 'vertical-more',
})`
  width: 20px;
  height: 20px;
`;

export default class CommentCard extends Component {
  static propTypes = {
    comment: extendedCommentType.isRequired,
    replyToCommentId: contentIdType.isRequired,
    isOwner: PropTypes.bool,
    loggedUserId: PropTypes.string,

    openPost: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOwner: false,
    loggedUserId: null,
  };

  state = {
    isReplierOpen: false,
    isEditorOpen: false,
  };

  openInput = fieldName => () => {
    // eslint-disable-next-line react/destructuring-assignment
    const value = this.state[fieldName];

    if (!value) {
      this.setState({ [fieldName]: true });
    }
  };

  closeInput = fieldName => () => {
    // eslint-disable-next-line react/destructuring-assignment
    const value = this.state[fieldName];

    if (value) {
      this.setState({ [fieldName]: false });
    }
  };

  onOpenPost = e => {
    const { comment, openPost } = this.props;
    const { post } = comment.parents;

    if (e) {
      e.preventDefault();
    }

    openPost(post, comment.id);
  };

  onDeleteComment = async () => {
    const { comment, deleteComment } = this.props;

    try {
      await deleteComment(comment);
    } catch (err) {
      displayError(err);
    }
  };

  renderBody() {
    const { comment } = this.props;

    if (comment.isDeleted) {
      return 'Comment was deleted';
    }

    if (!comment.document) {
      return 'Invalid comment format';
    }

    return (
      <>
        <BodyRender content={comment.document} />
        {this.renderEmbeds()}
      </>
    );
  }

  renderEmbeds() {
    const { comment } = this.props;

    if (!comment.document) {
      return null;
    }

    const { content } = comment.document;

    const attachments = content.find(({ type }) => type === 'attachments');

    if (!attachments) {
      return null;
    }

    return (
      <EmbedsWrapper>
        <AttachmentsBlock attachments={attachments} />
      </EmbedsWrapper>
    );
  }

  renderReplyInput() {
    const { comment, replyToCommentId, loggedUserId, isOwner } = this.props;
    const { isReplierOpen } = this.state;

    if (!isReplierOpen) {
      return null;
    }

    const defaultValue =
      !isOwner && comment.author.username ? preparePostWithMention(comment.author.username) : null;

    return (
      <InputWrapper>
        <WrappingCurrentUserLink userId={loggedUserId} useLink />
        <CommentForm
          parentCommentId={replyToCommentId}
          parentPostId={comment.parents.post}
          defaultValue={defaultValue}
          isReply
          autoFocus
          onDone={this.closeInput('isReplierOpen')}
        />
      </InputWrapper>
    );
  }

  renderEditInput() {
    const { comment, loggedUserId } = this.props;
    const { isEditorOpen } = this.state;

    if (!isEditorOpen) {
      return null;
    }

    return (
      <Wrapper isEdit isNested={Boolean(comment.parents.comment)}>
        <WrappingCurrentUserLink userId={loggedUserId} useLink />
        <CommentForm
          contentId={comment.contentId}
          parentPostId={comment.parents.post}
          comment={comment}
          community={comment.community}
          isEdit
          autoFocus
          onClose={this.closeInput('isEditorOpen')}
          onDone={this.closeInput('isEditorOpen')}
        />
      </Wrapper>
    );
  }

  render() {
    const { comment, loggedUserId, isOwner } = this.props;

    if (!comment) {
      return null;
    }

    return (
      <Wrapper>
        <Header>
          <Avatar userId={comment.authorId} useLink />
          <InfoWrapper>
            <Author>{comment.author.username}</Author>
            {/* TODO: commented on with link on content */}
            <Created>{dayjs(comment.meta.creationTime).fromNow()}</Created>
          </InfoWrapper>
          {isOwner && !comment.isDeleted ? (
            <DropDownMenuStyled
              align="right"
              handler={props => (
                <Action name="card__more-actions" aria-label="More actions" {...props}>
                  <MoreIcon />
                </Action>
              )}
              items={() => (
                <>
                  <DropDownMenuItem name="comment__edit" onClick={this.openInput('isEditorOpen')}>
                    Edit
                  </DropDownMenuItem>
                  <DropDownMenuItem name="comment__delete" onClick={this.onDeleteComment}>
                    Delete
                  </DropDownMenuItem>
                </>
              )}
            />
          ) : null}
        </Header>
        <Content onClick={this.onOpenPost}>{this.renderBody()}</Content>
        <ActionsPanel>
          <VotePanel entity={comment} />
          {loggedUserId ? (
            <Actions>
              <ActionButton name="comment-card__reply" onClick={this.openInput('isReplierOpen')}>
                Reply
              </ActionButton>
            </Actions>
          ) : null}
        </ActionsPanel>
        {this.renderReplyInput()}
        {this.renderEditInput()}
      </Wrapper>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import dayjs from 'dayjs';

import { up } from '@commun/ui';
import { Icon } from '@commun/icons';
import { commentType, contentIdType, userType } from 'types/common';
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
  margin: 16px 0;
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
    comment: commentType.isRequired,
    parentCommentId: contentIdType.isRequired,
    parentCommentAuthor: userType,
    isOwner: PropTypes.bool,
    loggedUserId: PropTypes.string,

    openPost: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
  };

  static defaultProps = {
    parentCommentAuthor: {},
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
    const { postContentId } = comment.parents;

    if (e) {
      e.preventDefault();
    }

    openPost(postContentId, comment.id);
  };

  onDeleteComment = async () => {
    const { comment, deleteComment } = this.props;

    try {
      await deleteComment(
        {
          communityId: comment.community.communityId,
          contentId: comment.contentId,
        },
        {
          postContentId: comment.parents.post,
          commentContentId: comment.parents.comment,
        }
      );
    } catch (err) {
      displayError(err);
    }
  };

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
    const { comment, parentCommentId, parentCommentAuthor, loggedUserId, isOwner } = this.props;
    const { isReplierOpen } = this.state;

    if (!isReplierOpen) {
      return null;
    }

    const defaultValue = !isOwner ? preparePostWithMention(parentCommentAuthor.username) : null;

    return (
      <InputWrapper>
        <WrappingCurrentUserLink userId={loggedUserId} useLink />
        <CommentForm
          parentCommentId={parentCommentId}
          parentPostId={comment.parents.post}
          defaultValue={defaultValue}
          isReply
          onDone={this.closeInput('isReplierOpen')}
        />
      </InputWrapper>
    );
  }

  render() {
    const { comment, loggedUserId, isOwner } = this.props;
    const { isEditorOpen } = this.state;

    if (!comment) {
      return null;
    }

    return (
      <Wrapper>
        <Header>
          <Avatar userId={comment.author.userId} useLink />
          <InfoWrapper>
            <Author>{comment.author.username}</Author>
            {/* TODO: commented on with link on content */}
            <Created>{dayjs(comment.meta.creationTime).fromNow()}</Created>
          </InfoWrapper>
          {isOwner ? (
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
        <Content onClick={this.onOpenPost}>
          <BodyRender content={comment.document} />
          {this.renderEmbeds()}
        </Content>
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
        {isEditorOpen && (
          <Wrapper isEdit isNested={Boolean(comment.parents.comment)}>
            <WrappingCurrentUserLink userId={loggedUserId} useLink />
            <CommentForm
              contentId={comment.contentId}
              parentPostId={comment.parents.post}
              comment={comment}
              community={comment.community}
              isEdit
              onClose={this.closeInput('isEditorOpen')}
              onDone={this.closeInput('isEditorOpen')}
            />
          </Wrapper>
        )}
      </Wrapper>
    );
  }
}

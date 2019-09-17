import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { up } from 'styled-breakpoints';
import dayjs from 'dayjs';

import { styles } from '@commun/ui';
import { commentType, userType } from 'types/common';
import Avatar from 'components/Avatar';
import VotePanel from 'components/VotePanel';
import CommentForm from 'components/CommentForm';
import Embed from 'components/Embed';

const Wrapper = styled.article`
  display: flex;
  padding: 12px 0;

  ${is('isNested')`
    margin-left: 20px;

    ${up('tablet')} {
      margin-left: 40px;
    }
  `};
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: 16px;
  overflow: hidden;
  ${styles.breakWord};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
`;

const Author = styled.p`
  font-size: 15px;
  font-weight: bold;
  letter-spacing: -0.41px;
  white-space: nowrap;
`;

const Created = styled.p`
  margin-left: 8px;
  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.contextGrey};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Body = styled.section`
  margin-top: 8px;
  line-height: 20px;
  font-size: 15px;
  letter-spacing: -0.41px;
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

const ActionsPanel = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding: 6px 0;
`;

const ActionButton = styled.button.attrs({ type: 'button' })`
  margin-left: 24px;
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

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 0;
`;

const WrappingCurrentUserLink = styled(Avatar)`
  display: none;
  margin-right: 16px;

  ${up('tablet')} {
    display: block;
  }
`;

export default class Comment extends Component {
  static propTypes = {
    comment: commentType.isRequired,
    author: userType,
    isOwner: PropTypes.bool,
    loggedUserId: PropTypes.string,
    deleteComment: PropTypes.func,
  };

  static defaultProps = {
    author: {},
    isOwner: false,
    loggedUserId: null,
    deleteComment: null,
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

  handleDelete = async () => {
    const { comment, deleteComment } = this.props;

    if (deleteComment) {
      await deleteComment(comment.contentId);

      this.openInput('isReplierOpen');
    }
  };

  renderEmbeds() {
    const { comment } = this.props;
    const { embeds } = comment.content;

    if (!embeds || !embeds.length) {
      return null;
    }

    return (
      <EmbedsWrapper>
        {embeds
          .filter(embed => embed.result)
          .map(embed => (
            <Embed isCompact key={embed.id} data={embed.result} />
          ))}
      </EmbedsWrapper>
    );
  }

  render() {
    const { comment, author, isOwner, loggedUserId } = this.props;
    const { isEditorOpen, isReplierOpen } = this.state;
    const commentAuthor =
      author.username || comment.contentId.userId; /* Fix for cases when author is undefined */

    return (
      <>
        <Wrapper isNested={Boolean(comment.parent.comment)}>
          <Avatar userId={commentAuthor} useLink />
          <Content>
            <Header>
              <Author>{commentAuthor}</Author>
              <Created>{dayjs(comment.meta.time).fromNow()}</Created>
            </Header>
            <Body dangerouslySetInnerHTML={{ __html: comment.content.body.full }} />
            {this.renderEmbeds()}
            <ActionsPanel>
              <VotePanel entity={comment} />
              {loggedUserId ? (
                <>
                  <ActionButton name="comment__reply" onClick={this.openInput('isReplierOpen')}>
                    Reply
                  </ActionButton>
                  {isOwner && (
                    <>
                      <ActionButton name="comment__edit" onClick={this.openInput('isEditorOpen')}>
                        Edit
                      </ActionButton>
                      <ActionButton name="comment__delete" onClick={this.handleDelete}>
                        Delete
                      </ActionButton>
                    </>
                  )}
                </>
              ) : null}
            </ActionsPanel>
            {isReplierOpen && (
              <InputWrapper>
                <WrappingCurrentUserLink userId={loggedUserId} useLink />
                <CommentForm
                  contentId={comment.contentId}
                  parentPostId={comment.parent.post.contentId}
                  isReply
                  onDone={this.closeInput('isReplierOpen')}
                />
              </InputWrapper>
            )}
          </Content>
        </Wrapper>
        {isEditorOpen && (
          <Wrapper isNested={Boolean(comment.parent.comment)}>
            <WrappingCurrentUserLink userId={loggedUserId} useLink />
            <CommentForm
              contentId={comment.contentId}
              parentPostId={comment.parent.post.contentId}
              comment={comment}
              isEdit
              onClose={this.closeInput('isEditorOpen')}
              onDone={this.closeInput('isEditorOpen')}
            />
          </Wrapper>
        )}
      </>
    );
  }
}

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
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }

  ${is('isNested')`
    margin-left: 20px;

    ${up('tablet')} {
      margin-left: 40px;
    }
  `};
`;

const Main = styled.div`
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

const Created = styled.div`
  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.contextGrey};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Content = styled.div`
  padding: 8px 10px;
  min-height: 35px;
  background-color: ${({ theme }) => theme.colors.contextWhite};
  border-radius: 12px;
`;

const Author = styled.p`
  float: left;
  margin-right: 5px;
  line-height: 18px;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: -0.41px;
  color: ${({ theme }) => theme.colors.contextBlue};
`;

const Body = styled.section`
  display: inline;
  line-height: 18px;
  font-size: 15px;
  letter-spacing: -0.41px;
  vertical-align: top;
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
  margin-top: 5px;
`;

const ActionButton = styled.button.attrs({ type: 'button' })`
  margin-left: 24px;
  font-size: 13px;
  font-weight: 600;
  transition: color 0.15s;
  color: ${({ theme }) => theme.colors.contextBlue};
`;

const Delimiter = styled.span`
  padding: 0 5px;
  vertical-align: middle;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.contextGreySecond};
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
      await deleteComment(
        // TODO
        { communityId: 'ABC', contentId: comment.contentId },
        comment.parent.post.contentId
      );

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
    const isNested = Boolean(comment.parent.comment);

    return (
      <>
        <Wrapper isNested={isNested}>
          <Avatar userId={author.id} useLink />
          <Main>
            <Header />
            <Content>
              <Author>{commentAuthor}</Author>
              <Body dangerouslySetInnerHTML={{ __html: comment.content.body.full }} />
            </Content>
            {this.renderEmbeds()}
            <ActionsPanel>
              <VotePanel entity={comment} />
              {loggedUserId ? (
                <>
                  <ActionButton name="comment__reply" onClick={this.openInput('isReplierOpen')}>
                    Reply
                  </ActionButton>
                  <Delimiter>•</Delimiter>
                  <Created title={dayjs(comment.meta.time).format('LLL')}>
                    {dayjs(comment.meta.time).twitter()}
                  </Created>
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
          </Main>
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

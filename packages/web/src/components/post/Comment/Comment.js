import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import dayjs from 'dayjs';

import { styles, up } from '@commun/ui';
import { commentType, contentIdType, userType } from 'types/common';
import { preparePostWithMention } from 'utils/editor';

import Avatar from 'components/common/Avatar';
import VotePanel from 'components/common/VotePanel';
import CommentForm from 'components/common/CommentForm';
import BodyRender from 'components/common/BodyRender';
import CommentsNested from 'components/post/CommentsNested';
import AsyncAction from 'components/common/AsyncAction';
import { ProfileLink } from 'components/links';
import AttachmentsBlock from 'components/common/AttachmentsBlock';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import { displayError } from 'utils/toastsMessages';

const Wrapper = styled.article`
  display: flex;

  ${is('isNested')`
    margin-left: 20px;

    ${up.tablet} {
      margin-left: 40px;
    }
  `};
`;

const Main = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: 100%;
  padding-bottom: 10px;
  margin-left: 10px;
  overflow: hidden;
  ${styles.breakWord};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 34px;
  margin-left: 10px;
`;

const Created = styled.div`
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.gray};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Content = styled.div`
  max-width: fit-content;
  min-height: 35px;
  padding: 8px 10px;
  font-size: 13px;
  line-height: 18px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 12px;

  ${up.desktop} {
    border-radius: 20px;
  }
`;

const BodyRenderStyled = styled(BodyRender)`
  display: inline;

  &,
  & p,
  & span {
    font-size: 13px;
    line-height: 18px;
  }

  & p:first-of-type {
    display: inline;
  }

  & a {
    font-weight: 600;
  }
`;

const AuthorLink = styled.a`
  margin-right: 5px;
  font-size: 13px;
  line-height: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.black};
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
  margin-top: 10px;
  overflow: hidden;
`;

const ActionsPanel = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const ActionButton = styled.button.attrs({ type: 'button' })`
  height: 34px;
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  transition: color 0.15s;
  color: ${({ theme }) => theme.colors.blue};
`;

const Delimiter = styled.span`
  padding: 0 5px;
  vertical-align: middle;
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.gray};
`;

const InputWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  margin: 16px 0;
`;

const WrappingCurrentUserLink = styled(Avatar)`
  display: none;
  margin-right: 16px;

  ${up.tablet} {
    display: block;
  }
`;

const AvatarStyled = styled(Avatar)`
  width: 35px;
  height: 35px;
`;

export default class Comment extends Component {
  static propTypes = {
    comment: commentType.isRequired,
    author: userType,
    parentCommentId: contentIdType.isRequired,
    isNested: PropTypes.bool,
    isOwner: PropTypes.bool,
    inFeed: PropTypes.bool,
    loggedUserId: PropTypes.string,
    isMobile: PropTypes.bool.isRequired,
    isModal: PropTypes.bool.isRequired,

    deleteComment: PropTypes.func,
  };

  static defaultProps = {
    author: {},
    isNested: false,
    isOwner: false,
    inFeed: false,
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

    try {
      await deleteComment(comment);
    } catch (err) {
      displayError(err);
    }

    this.openInput('isReplierOpen');
  };

  renderBody() {
    const { comment } = this.props;

    if (comment.isDeleted) {
      return 'Comment was deleted';
    }

    if (!comment.document) {
      return 'Invalid comment format';
    }

    return <BodyRenderStyled content={comment.document} />;
  }

  renderOwnerActions() {
    const { comment, isMobile } = this.props;

    if (comment.isDeleted) {
      return null;
    }

    if (isMobile) {
      return (
        <>
          <Delimiter>•</Delimiter>
          <DropDownMenu
            align="right"
            openAt="top"
            handler={props => <ActionButton {...props}>More</ActionButton>}
            items={() => (
              <>
                <DropDownMenuItem name="comment__edit" onClick={this.openInput('isEditorOpen')}>
                  Edit
                </DropDownMenuItem>
                <DropDownMenuItem name="comment__delete" onClick={this.handleDelete}>
                  Delete
                </DropDownMenuItem>
              </>
            )}
          />
        </>
      );
    }

    return (
      <>
        <Delimiter>•</Delimiter>
        <ActionButton name="comment__edit" onClick={this.openInput('isEditorOpen')}>
          Edit
        </ActionButton>
        <Delimiter>•</Delimiter>
        <AsyncAction onClickHandler={this.handleDelete}>
          <ActionButton name="comment__delete">Delete</ActionButton>
        </AsyncAction>
      </>
    );
  }

  renderAttachments() {
    const { comment, isModal } = this.props;

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
        <AttachmentsBlock attachments={attachments} isModal={isModal} />
      </EmbedsWrapper>
    );
  }

  renderReplyInput() {
    const { author, comment, parentCommentId, loggedUserId, isOwner } = this.props;
    const { isReplierOpen } = this.state;

    if (!isReplierOpen) {
      return null;
    }

    const defaultValue =
      !isOwner && author.username ? preparePostWithMention(author.username) : null;

    return (
      <InputWrapper>
        <WrappingCurrentUserLink userId={loggedUserId} useLink />
        <CommentForm
          parentCommentId={parentCommentId}
          parentPostId={comment.parents.post}
          defaultValue={defaultValue}
          autoFocus
          isReply
          onDone={this.closeInput('isReplierOpen')}
        />
      </InputWrapper>
    );
  }

  render() {
    const { comment, author, isOwner, isNested, inFeed, loggedUserId } = this.props;
    const { isEditorOpen } = this.state;

    const commentAuthor =
      author.username || comment.contentId.userId; /* Fix for cases when author is undefined */

    return (
      <>
        <Wrapper id={comment.id} isNested={isNested}>
          <AvatarStyled userId={author.userId} useLink />
          <Main>
            <Header />
            <Content>
              <ProfileLink user={author.username} allowEmpty>
                <AuthorLink>{commentAuthor}</AuthorLink>
              </ProfileLink>
              {this.renderBody()}
            </Content>
            {this.renderAttachments()}
            <ActionsPanel>
              <VotePanel entity={comment} />
              <Actions>
                <Created title={dayjs(comment.meta.creationTime).format('LLL')}>
                  {dayjs(comment.meta.creationTime).twitter()}
                </Created>
                {loggedUserId ? (
                  <>
                    <Delimiter>•</Delimiter>
                    <ActionButton name="comment__reply" onClick={this.openInput('isReplierOpen')}>
                      Reply
                    </ActionButton>
                    {isOwner ? this.renderOwnerActions() : null}
                  </>
                ) : null}
              </Actions>
            </ActionsPanel>
            {this.renderReplyInput()}
          </Main>
        </Wrapper>
        {isEditorOpen && (
          <Wrapper isNested={Boolean(comment.parents.comment)}>
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
        {!isNested ? (
          <CommentsNested commentId={comment.id} key={comment.id} inFeed={inFeed} />
        ) : null}
      </>
    );
  }
}

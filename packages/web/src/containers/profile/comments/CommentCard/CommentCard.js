import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { up } from '@commun/ui';
import { commentType, contentIdType, userType } from 'types/common';
import VotePanel from 'components/common/VotePanel';
import Avatar from 'components/common/Avatar';
import CommentForm from 'components/common/CommentForm';
import Embed from 'components/common/Embed';
import BodyRender from 'components/common/BodyRender';
import { preparePostWithMention } from 'utils/editor';

const Wrapper = styled.div`
  width: 100%;
  padding: 16px;
  background-color: #ffffff;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 15px;
  overflow: hidden;
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
  margin-top: 12px;
  padding: 8px 0;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
`;

// const ActionButton = styled.button.attrs({ type: 'button' })`
//   font-size: 13px;
//   font-weight: 600;
//   transition: color 0.15s;
//   color: ${({ theme }) => theme.colors.contextBlue};
// `;

const Created = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.contextGrey};
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
  margin-right: 16px;

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

export default class CommentCard extends Component {
  static propTypes = {
    comment: commentType.isRequired,
    parentCommentId: contentIdType.isRequired,
    parentCommentAuthor: userType,
    isOwner: PropTypes.bool,
    loggedUserId: PropTypes.string,
  };

  static defaultProps = {
    parentCommentAuthor: {},
    isOwner: false,
    loggedUserId: null,
  };

  state = {
    isReplierOpen: false,
  };

  openReplyInput = () => {
    const { isReplierOpen } = this.state;

    if (!isReplierOpen) {
      this.setState({ isReplierOpen: true });
    }
  };

  closeReplyInput = () => {
    const { isReplierOpen } = this.state;

    if (isReplierOpen) {
      this.setState({ isReplierOpen: false });
    }
  };

  renderEmbeds() {
    const { comment } = this.props;

    if (!comment.document) {
      return null;
    }

    const { embeds } = comment.document;

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
          onDone={this.closeReplyInput}
        />
      </InputWrapper>
    );
  }

  render() {
    const { comment, loggedUserId } = this.props;

    return (
      <Wrapper>
        <Header>
          <Avatar userId={comment.author.userId} useLink />
          <InfoWrapper>
            <Author>{comment.author.username}</Author>
            {/* // TODO: commented on with link on content */}
            <Created>{dayjs(comment.meta.creationTime).fromNow()}</Created>
          </InfoWrapper>
        </Header>

        <Content>
          <BodyRender content={comment.document} />
          {this.renderEmbeds()}
        </Content>

        <ActionsPanel>
          <VotePanel entity={comment} />
          {loggedUserId ? (
            <Actions>
              {/* // TODO: */}
              {/* <ActionButton name="comment__reply" onClick={this.openReplyInput}> */}
              {/*  Reply */}
              {/* </ActionButton> */}

              {/* {isOwner && ( */}
              {/*  <> */}
              {/*    <Delimiter>•</Delimiter> */}
              {/*    <ActionButton name="comment__edit" onClick={this.openInput('isEditorOpen')}> */}
              {/*      Edit */}
              {/*    </ActionButton> */}
              {/*    <Delimiter>•</Delimiter> */}
              {/*    <ActionButton name="comment__delete" onClick={this.handleDelete}> */}
              {/*      Delete */}
              {/*    </ActionButton> */}
              {/*  </> */}
              {/* )} */}
            </Actions>
          ) : null}
        </ActionsPanel>

        {this.renderReplyInput()}
      </Wrapper>
    );
  }
}

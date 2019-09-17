import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { up } from 'styled-breakpoints';
import dayjs from 'dayjs';

import { Link } from 'shared/routes';
import { styles } from '@commun/ui';
import { commentType } from 'types/common';
import VotePanel from 'components/VotePanel';
import Avatar from 'components/Avatar';
import CommentForm from 'components/CommentForm';
import Embed from 'components/Embed';

const Wrapper = styled.div`
  width: 100%;
  padding: 16px;
  background-color: #ffffff;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: 16px;
  overflow: hidden;
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

const CommentText = styled.section`
  padding-top: 8px;
  font-size: 15px;
  letter-spacing: -0.41px;
  line-height: 20px;
  ${styles.breakWord};
`;

const ActionsPanel = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding: 8px 0;
`;

const ReplyButton = styled.button.attrs({ type: 'button' })`
  font-size: 15px;
  letter-spacing: -0.41px;
  margin-left: 24px;

  ${({ theme }) => `
    color: ${theme.colors.contextGrey};

    &:hover {
      color: ${theme.colors.contextBlack};
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

const ParentInfo = styled.div`
  margin-top: ${({ isReplierOpen }) => (isReplierOpen ? '0' : '12')}px;
  padding: 16px;
  border: 1px solid #e4e4e4;
  border-radius: 8px;
`;

const ParentHeader = styled.div`
  display: flex;
`;

const ParentHeaderRight = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 16px;
`;

const ParentName = styled.a`
  display: block;
  line-height: 20px;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: -0.41px;

  ${({ theme }) => `
    color: ${theme.colors.contextBlack};

    &:hover,
    &:focus {
      color: ${theme.colors.contextBlue};
    }
  `};
`;

const CreatedTime = styled.p`
  display: flex;
  margin-top: 4px;
  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const ParentBody = styled.div`
  font-size: 17px;
  font-weight: bold;
  letter-spacing: -0.41px;

  ${is('user')`
    line-height: 20px;
    font-size: 15px;
    font-weight: normal;
  `};

  ${is('children')`
    margin-top: 16px;
  `}
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
    loggedUserId: PropTypes.string,
  };

  static defaultProps = {
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
    const { comment, loggedUserId } = this.props;
    const { isReplierOpen } = this.state;

    const isReply = Boolean(comment.parent.comment);
    const parentUserId = isReply ? comment.parent.comment.contentId.userId : null;
    const parentCommunityName = !isReply ? comment.parent.post.community.name : null;

    return (
      <Wrapper>
        <ContentWrapper>
          <Avatar userId={comment.contentId.userId} useLink />
          <Content>
            <Header>
              <Author>{comment.contentId.userId}</Author>
              <Created>{dayjs(comment.meta.time).fromNow()}</Created>
            </Header>
            <CommentText
              dangerouslySetInnerHTML={{
                __html: comment.content.body.full,
              }}
            />
            {this.renderEmbeds()}
            <ActionsPanel>
              <VotePanel entity={comment} inComment />
              {loggedUserId ? <ReplyButton onClick={this.openReplyInput}>Reply</ReplyButton> : null}
            </ActionsPanel>
            {isReplierOpen && (
              <InputWrapper>
                <WrappingCurrentUserLink userId={loggedUserId} useLink />
                <CommentForm contentId={comment.contentId} />
              </InputWrapper>
            )}
          </Content>
        </ContentWrapper>
        <ParentInfo isReplierOpen={isReplierOpen}>
          <ParentHeader>
            {isReply && parentUserId ? (
              <Avatar userId={parentUserId} useLink />
            ) : (
              <Avatar communityId="gls" useLink />
            )}
            <ParentHeaderRight>
              <Link
                route={isReply ? 'profile' : 'community'}
                params={isReply ? { userId: parentUserId } : { communityId: 'gls' }}
                passHref
              >
                <ParentName>{isReply ? parentUserId : parentCommunityName}</ParentName>
              </Link>
              <CreatedTime>{dayjs(comment.meta.time).fromNow()}</CreatedTime>
            </ParentHeaderRight>
          </ParentHeader>
          {/* TODO: add comment body for parent comment */}
          <ParentBody user={isReply ? 1 : 0}>{comment?.parent?.post?.content?.title}</ParentBody>
        </ParentInfo>
      </Wrapper>
    );
  }
}

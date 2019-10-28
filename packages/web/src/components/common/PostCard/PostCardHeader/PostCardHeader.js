import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { Icon } from '@commun/icons';

import { extendedPostType } from 'types/common';
import Avatar from 'components/common/Avatar';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import { ProfileLink, CommunityLink, PostLink } from 'components/links';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 15px 0;
`;

const Left = styled.div`
  display: flex;
  height: 40px;
`;

const AvatarWrapper = styled.div`
  display: flex;
`;

const Info = styled.div`
  margin-left: 10px;
`;

const CommunityName = styled.a`
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
  color: #000000;
`;

const SubInfo = styled.div`
  margin-top: 1px;
  line-height: 16px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const Timestamp = styled.a`
  line-height: 16px;
  color: #9b9fa2;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const Delimiter = styled.span`
  padding: 0 5px;
  vertical-align: middle;
  line-height: 16px;
`;

const Author = styled.a`
  line-height: 16px;
  color: ${({ theme }) => theme.colors.blue};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  margin-right: -8px;
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const MoreIcon = styled(Icon)`
  width: 20px;
  height: 20px;
`;

export default class PostCardHeader extends Component {
  static propTypes = {
    post: extendedPostType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    report: PropTypes.func.isRequired,
    onPostClick: PropTypes.func.isRequired,
    onPostEditClick: PropTypes.func.isRequired,
  };

  onReportClick = () => {
    const { post, report } = this.props;
    report(post.contentId);
  };

  render() {
    const { post, isOwner, onPostClick, onPostEditClick } = this.props;
    const { community, author } = post;

    return (
      <Wrapper>
        <Left>
          <AvatarWrapper>
            <Avatar communityId={community.id} useLink />
          </AvatarWrapper>
          <Info>
            <CommunityLink community={community}>
              <CommunityName>{community.name}</CommunityName>
            </CommunityLink>
            <SubInfo>
              <PostLink post={post}>
                <Timestamp
                  title={dayjs(post.meta.creationTime).format('LLL')}
                  onClick={onPostClick}
                >
                  {dayjs(post.meta.creationTime).twitter()}
                </Timestamp>
              </PostLink>
              {author ? (
                <>
                  <Delimiter>•</Delimiter>
                  <ProfileLink user={author}>
                    <Author>@{author.username}</Author>
                  </ProfileLink>
                </>
              ) : null}
            </SubInfo>
          </Info>
        </Left>
        <Right>
          <DropDownMenu
            align="right"
            handler={props => (
              <Action name="post-card__more-actions" aria-label="More actions" {...props}>
                <MoreIcon name="more" />
              </Action>
            )}
            items={() => (
              <>
                {isOwner ? (
                  <DropDownMenuItem name="post-card__edit-post" onClick={onPostEditClick}>
                    Edit
                  </DropDownMenuItem>
                ) : (
                  <DropDownMenuItem name="post-card__report" onClick={this.onReportClick}>
                    Report
                  </DropDownMenuItem>
                )}
              </>
            )}
          />
        </Right>
      </Wrapper>
    );
  }
}

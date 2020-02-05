import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import dayjs from 'dayjs';

import { Icon } from '@commun/icons';

import { userType, communityType, extendedPostType } from 'types';
import Avatar from 'components/common/Avatar';
import { CommunityLink, ProfileLink } from 'components/links';
import DropDownMenu from 'components/common/DropDownMenu';
import RewardsBadge from 'components/common/RewardsBadge';

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

const CommunityName = styled.a`
  font-size: 14px;
  font-weight: 600;
  line-height: 19px;
  color: #000000;
`;

const SubInfo = styled.div`
  line-height: 16px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const Timestamp = styled.a`
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
  cursor: default;

  ${is('isLink')`
    cursor: pointer;

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.blueHover};
    }
  `};
`;

const Delimiter = styled.span`
  padding: 0 5px;
  line-height: 16px;
  vertical-align: middle;
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
  name: 'more',
})`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.gray};
`;

export default function CardCommunityHeader({
  community,
  user,
  post,
  menuItems,
  linkify,
  time,
  isReport,
  onTimeClick,
}) {
  const timeBlock = (
    <Timestamp title={dayjs(time).format('LLL')} isLink={Boolean(linkify)} onClick={onTimeClick}>
      {dayjs(time).twitter()}
    </Timestamp>
  );

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
            {linkify ? linkify(timeBlock) : timeBlock}
            {user ? (
              <>
                <Delimiter>•</Delimiter>
                <ProfileLink user={user}>
                  <Author>@{user.username}</Author>
                </ProfileLink>
              </>
            ) : null}
          </SubInfo>
        </Info>
      </Left>
      {menuItems ? (
        <Right>
          {post && !isReport ? <RewardsBadge postId={post.id} /> : null}
          <DropDownMenu
            align="right"
            handler={props => (
              <Action name="card__more-actions" aria-label="More actions" {...props}>
                <MoreIcon />
              </Action>
            )}
            items={menuItems}
          />
        </Right>
      ) : null}
    </Wrapper>
  );
}

CardCommunityHeader.propTypes = {
  user: userType.isRequired,
  community: communityType.isRequired,
  post: extendedPostType,
  time: PropTypes.string.isRequired,
  isReport: PropTypes.bool.isRequired,

  menuItems: PropTypes.func,
  linkify: PropTypes.func,
  onTimeClick: PropTypes.func,
};

CardCommunityHeader.defaultProps = {
  post: null,
  menuItems: undefined,
  linkify: undefined,
  onTimeClick: undefined,
};

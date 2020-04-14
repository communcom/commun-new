import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import dayjs from 'dayjs';

import { Icon } from '@commun/icons';
import { styles } from '@commun/ui';
import { smartTrim } from 'utils/text';
import { MAX_COMMUNITY_CARD_NAME_LENGTH } from 'shared/constants';
import { useTranslation } from 'shared/i18n';
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

const Title = styled.a`
  position: relative;
  font-size: 14px;
  font-weight: 600;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.black};
  ${styles.breakWord};

  &:hover,
  &:focus {
    ${props => (props['aria-label'] ? styles.withBottomTooltip : '')};
  }
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
  color: ${({ theme }) => theme.colors.black};
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
  const { t } = useTranslation();
  const isMyFeed = community.id === 'FEED';

  const timeBlock = (
    <Timestamp title={dayjs(time).format('LLL')} isLink={Boolean(linkify)} onClick={onTimeClick}>
      {dayjs(time).twitter()}
    </Timestamp>
  );

  function getCommunityName() {
    const { name } = community;

    if (name.length > MAX_COMMUNITY_CARD_NAME_LENGTH) {
      return {
        'aria-label': name,
        children: smartTrim(name, MAX_COMMUNITY_CARD_NAME_LENGTH),
      };
    }

    return {
      children: name,
    };
  }

  return (
    <Wrapper>
      <Left>
        <AvatarWrapper>
          {isMyFeed ? (
            <Avatar userId={user.userId} useLink />
          ) : (
            <Avatar communityId={community.id} useLink />
          )}
        </AvatarWrapper>
        <Info>
          {isMyFeed ? (
            <ProfileLink user={user}>
              <Title>{user.username}</Title>
            </ProfileLink>
          ) : (
            <CommunityLink community={community}>
              <Title {...getCommunityName()} />
            </CommunityLink>
          )}
          <SubInfo>
            {linkify ? linkify(timeBlock) : timeBlock}
            {user || isMyFeed ? (
              <>
                <Delimiter>•</Delimiter>
                <ProfileLink user={user}>
                  <Author>{isMyFeed ? t('common.feed') : `@${user.username}`}</Author>
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
              <Action
                name="card__more-actions"
                aria-label={t('menu.common.more_actions')}
                {...props}
              >
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
  isReport: PropTypes.bool,

  menuItems: PropTypes.func,
  linkify: PropTypes.func,
  onTimeClick: PropTypes.func,
};

CardCommunityHeader.defaultProps = {
  post: null,
  isReport: false,
  menuItems: undefined,
  linkify: undefined,
  onTimeClick: undefined,
};

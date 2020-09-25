import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Loader } from '@commun/ui';

import { communityType } from 'types';
import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';
import { displayError } from 'utils/toastsMessages';

import Avatar from 'components/common/Avatar/Avatar.connect';
import DropDownMenu from 'components/common/DropDownMenu';
import { CommunityLink } from 'components/links';

const Wrapper = styled.div`
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const DropDownMenuStyled = styled(DropDownMenu)`
  display: flex;
  align-items: center;
  flex-grow: 1;
  height: 100%;

  & > div {
    width: 100%;
  }
`;

const CommunityMenuWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  width: 100%;
  padding: 15px;
  cursor: pointer;
`;

const CommunityItemWrapper = styled(CommunityMenuWrapper).attrs({ as: 'a' })``;

const Header = styled.header`
  display: flex;
  padding-right: 30px;
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
`;

const Name = styled.p`
  margin-bottom: 3px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.black};
`;

const Info = styled.p`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.colors.gray};

  ${is('isBlue')`
    color: ${({ theme }) => theme.colors.blue};
  `}
`;

const IconDropdownBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 50%;
`;

const IconDropdown = styled(Icon).attrs({ name: 'chevron' })`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.gray};

  ${is(`isOpen`)`
    transform: rotate(180deg);
  `}
`;

const IconCheckboxBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 50%;
`;

const IconCheckbox = styled(Icon).attrs({ name: 'check' })`
  width: 12px;
  height: 12px;
  color: #fff;
`;

const Divider = styled.div`
  height: 2px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const ListWrapper = styled.div`
  max-height: min(517px, 80vh);
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const LoadMoreLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding-bottom: 10px;
`;

const CommunityLeaderboardWidget = ({
  router,
  community,
  communities,
  isLoading,
  isEnd,
  isAllowLoadMore,
  fetchLeaderCommunities,
  children,
}) => {
  const { t } = useTranslation();
  const listWrapperRef = useRef();
  const { section, subSection } = router.query;

  async function fetchData(isPaging) {
    const params = {};

    if (isPaging) {
      params.offset = communities.length;
    }

    try {
      await fetchLeaderCommunities(params);
    } catch (err) {
      displayError(err);
    }
  }

  function onScroll() {
    const listWrapper = listWrapperRef.current;

    if (!isAllowLoadMore || !listWrapper) {
      return;
    }

    const windowHeight = listWrapper.clientHeight;
    const innerHeight = listWrapper.scrollHeight;
    const { scrollTop } = listWrapper;

    const remains = innerHeight - scrollTop - windowHeight;

    if (remains < windowHeight * 0.8) {
      fetchData(true);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <DropDownMenuStyled
        openAt="bottom"
        align="right"
        handler={({ onClick, isOpen }) => (
          <CommunityMenuWrapper onClick={onClick}>
            <Header>
              <Avatar communityId={community?.communityId} />
              <NameWrapper>
                {community ? (
                  <>
                    <Name>{community.name}</Name>
                    <CommunityLink community={community}>
                      <Info as="a" isBlue>
                        {t('components.community_leaderboard_widget.go_back')}
                      </Info>
                    </CommunityLink>
                  </>
                ) : (
                  <Info>{t('components.community_leaderboard_widget.choose')}</Info>
                )}
              </NameWrapper>
            </Header>
            <IconDropdownBlock>
              <IconDropdown isOpen={isOpen} />
            </IconDropdownBlock>
          </CommunityMenuWrapper>
        )}
        items={() => (
          <ListWrapper ref={listWrapperRef} onScroll={onScroll}>
            {communities.map(({ communityId, alias, name, subscribersCount, postsCount }) => (
              <Link
                key={communityId}
                route="leaderboard"
                params={{
                  communityAlias: alias,
                  section,
                  subSection,
                }}
                passHref
              >
                <CommunityItemWrapper>
                  <Header>
                    <Avatar communityId={communityId} />
                    <NameWrapper>
                      <Name>{name}</Name>
                      <Info>
                        {subscribersCount}{' '}
                        {t('common.counters.follower', { count: subscribersCount })}
                        {` \u2022 `}
                        {postsCount} {t('common.counters.post', { count: postsCount })}
                      </Info>
                    </NameWrapper>
                  </Header>{' '}
                  {community?.communityId === communityId ? (
                    <IconCheckboxBlock>
                      <IconCheckbox />
                    </IconCheckboxBlock>
                  ) : null}
                </CommunityItemWrapper>
              </Link>
            ))}
            {isEnd ? null : <LoadMoreLoader>{isLoading ? <Loader /> : null}</LoadMoreLoader>}
          </ListWrapper>
        )}
      />
      {community ? (
        <>
          <Divider />
          {children}
        </>
      ) : null}
    </Wrapper>
  );
};

CommunityLeaderboardWidget.propTypes = {
  router: PropTypes.object.isRequired,
  community: communityType,
  communities: PropTypes.arrayOf(communityType),
  isLoading: PropTypes.bool.isRequired,
  isEnd: PropTypes.bool.isRequired,
  isAllowLoadMore: PropTypes.bool.isRequired,
  fetchLeaderCommunities: PropTypes.func.isRequired,
};

CommunityLeaderboardWidget.defaultProps = {
  community: undefined,
  communities: [],
};

export default withRouter(CommunityLeaderboardWidget);

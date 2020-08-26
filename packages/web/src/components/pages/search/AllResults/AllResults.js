import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Button, up } from '@commun/ui';

import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import PostCard from 'components/common/PostCard';
import EntityCard from 'components/pages/search/EntityCard';
import SectionHeader from 'components/pages/search/SectionHeader';
import { CommunityRowStyled, EmptyList, NoResults, UserRowStyled } from '../common';

const SearchResults = styled.div``;

const SectionHeaderStyled = styled(SectionHeader)``;

const ResultsSection = styled.div`
  padding: 0 0 20px;

  &:not(:first-child) {
    border-top: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
  }

  ${is('isNeedFill')`
    background-color: ${({ theme }) => theme.colors.white};
  `};

  &::before {
    content: '';
    height: 5px;
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

const SectionContent = styled.div`
  overflow: hidden;

  ${is('row')`
    display: flex
    padding: 7px 15px 0;

    & > * {
      flex-grow: 0;
      flex-shrink: 0;
    }
  `};
`;

const EntityCardStyled = styled(EntityCard)`
  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const NothingFoundContainer = styled.div`
  padding-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.white};

  ${up.tablet} {
    border-radius: 0 0 10px 10px;
  }
`;

export default function AllResults({ profiles, communities, posts, q, isMobile, onNeedLoadMore }) {
  const { t } = useTranslation(['page_search']);

  if ((!profiles.length && !communities.length && !posts.length) || !q) {
    let emptyText = t('search.empty_hint');

    if (!q) {
      emptyText = t('search.empty_hint_no_query');
    }

    return (
      <EmptyList headerText={t('search.no_results')} subText={emptyText}>
        <Link route="home" passHref>
          <Button primary>{t('search.go_to_feed')}</Button>
        </Link>
      </EmptyList>
    );
  }

  return (
    <SearchResults>
      {profiles.length ? (
        <ResultsSection isNeedFill>
          <SectionHeaderStyled title={t('search.types.users')} q={q} type="profiles" />
          <SectionContent row={!isMobile}>
            {profiles.map(id =>
              isMobile ? (
                <UserRowStyled key={id} userId={id} />
              ) : (
                <EntityCardStyled key={id} userId={id} />
              )
            )}
          </SectionContent>
        </ResultsSection>
      ) : null}
      {communities.length ? (
        <ResultsSection isNeedFill>
          <SectionHeaderStyled q={q} title={t('search.types.communities')} type="communities" />
          <SectionContent row={!isMobile}>
            {communities.map(id =>
              isMobile ? (
                <CommunityRowStyled key={id} communityId={id} />
              ) : (
                <EntityCardStyled key={id} communityId={id} />
              )
            )}
          </SectionContent>
        </ResultsSection>
      ) : null}
      <ResultsSection>
        <SectionHeaderStyled q={q} title={t('search.types.posts')} type="posts" />
        <SectionContent>
          {posts.length ? (
            <InfinityScrollHelper onNeedLoadMore={onNeedLoadMore}>
              {posts.map(id => (
                <PostCard key={id} postId={id} />
              ))}
            </InfinityScrollHelper>
          ) : (
            <NothingFoundContainer>
              <NoResults>{t('search.no_posts')}</NoResults>
            </NothingFoundContainer>
          )}
        </SectionContent>
      </ResultsSection>
    </SearchResults>
  );
}

AllResults.propTypes = {
  profiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  communities: PropTypes.arrayOf(PropTypes.string).isRequired,
  posts: PropTypes.arrayOf(PropTypes.string).isRequired,
  q: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,

  onNeedLoadMore: PropTypes.func.isRequired,
};

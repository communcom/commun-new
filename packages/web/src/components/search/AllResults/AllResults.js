import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { up, Button } from '@commun/ui';
import { Link } from 'shared/routes';

import SectionHeader from 'components/search/SectionHeader';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import PostCard from 'components/common/PostCard';
import EntityCard from 'components/search/EntityCard';

import { UserRowStyled, CommunityRowStyled, NoResults, EmptyList } from '../common';

const SearchResults = styled.div``;

const SectionHeaderStyled = styled(SectionHeader)``;

const ResultsSection = styled.div`
  padding: 0 0 20px;

  &:not(:first-child) {
    border-top: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
  }

  ${is('isNeedFill')`
    background-color: #fff;
  `};

  &::before {
    content: '';
    height: 5px;
    background-color: #fff;
  }
`;

const SectionContent = styled.div`
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
  background-color: #fff;

  ${up.tablet} {
    border-radius: 0 0 10px 10px;
  }
`;

export default function AllResults({ profiles, communities, posts, q, isMobile, onNeedLoadMore }) {
  if ((!profiles.length && !communities.length && !posts.length) || !q) {
    let emptyText = 'You can try to change the search query or go to feed';

    if (!q) {
      emptyText = 'Please enter search query or go to feed';
    }

    return (
      <EmptyList headerText="No results" subText={emptyText}>
        <Link route="home" passHref>
          <Button primary>Go to Feed</Button>
        </Link>
      </EmptyList>
    );
  }

  return (
    <SearchResults>
      {profiles.length ? (
        <ResultsSection isNeedFill>
          <SectionHeaderStyled title="Users" q={q} type="profiles" />
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
          <SectionHeaderStyled q={q} title="Communities" type="communities" />
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
        <SectionHeaderStyled q={q} title="Posts" type="posts" />
        <SectionContent>
          {posts.length ? (
            <InfinityScrollHelper onNeedLoadMore={onNeedLoadMore}>
              {posts.map(id => (
                <PostCard key={id} postId={id} />
              ))}
            </InfinityScrollHelper>
          ) : (
            <NothingFoundContainer>
              <NoResults>No posts are found</NoResults>
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

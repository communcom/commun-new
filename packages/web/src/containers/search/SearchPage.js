import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { KEY_CODES, up, Button, PaginationLoader } from '@commun/ui';

import { extendedSearch, entitySearch } from 'store/actions/gate';
import { Router, Link } from 'shared/routes';

import Content, { StickyAside } from 'components/common/Content';
import SideBarNavigation from 'components/common/SideBarNavigation';
import SearchInput from 'components/common/SearchInput';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import EntityCard from 'components/search/EntityCard';
import UserRow from 'components/common/UserRow';
import CommunityRow from 'components/common/CommunityRow';
import PostCard from 'components/common/PostCard';
import EmptyList from 'components/common/EmptyList';

import SectionHeader from './SectionHeader';
import useSearchPage, { SEARCH_PAGE_SIZE } from './useSearchPageHook';

const ALLOWED_TYPES = ['profiles', 'communities', 'posts'];

const SEARCH_TYPES = [
  {
    title: 'All',
  },
  {
    title: 'Users',
    type: 'profiles',
  },
  {
    title: 'Communities',
    type: 'communities',
  },
  {
    title: 'Posts',
    type: 'posts',
  },
];

const Wrapper = styled.div`
  flex-basis: 100%;
  overflow: hidden;
`;

const Container = styled.div`
  flex-grow: 1;

  ${is('isNeedFill')`
    border-radius: 10px;
    background-color: #fff;
  `};
`;

const StickyAsideStyled = styled(StickyAside)`
  width: 230px;
`;

const SearchResults = styled.div``;

const SearchHeader = styled.div`
  padding: 15px 15px 5px;
  border-radius: 10px 10px 0 0;
  background-color: #fff;

  ${up.desktop} {
    padding-bottom: 14px;
  }
`;

const ResultsSection = styled.div`
  padding: 0 0 20px;
  border-top: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};

  ${is('isNeedFill')`
    background-color: #fff;
  `};

  &::before {
    content: '';
    height: 5px;
    background-color: #fff;
  }
`;

const DetailedResults = styled.div`
  padding: 10px 0;
  border-top: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};

  ${is('addTopBorder')`
    padding: 0;

    &::before {
      content: '';
      display: block;
      width: 100%;
      height: 5px;
      margin-bottom: -5px;
      background-color: #fff;
    }
  `};
`;

const SectionContent = styled.div`
  ${is('row')`
      display: flex;
      padding: 0 15px;

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

const UserRowStyled = styled(UserRow)`
  padding: 10px 15px;
`;

const CommunityRowStyled = styled(CommunityRow)`
  padding: 10px 15px;
`;

const SideBarNavigationTags = styled(SideBarNavigation)`
  margin-top: 10px;
`;

const NoResults = styled.div`
  padding: 20px 15px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #999;
`;

const NothingFoundContainer = styled.div`
  padding-bottom: 10px;
  border-radius: 0 0 10px 10px;
  background-color: #fff;
`;

export default function SearchPage({
  q,
  searchText: routeSearchText,
  type,
  initialResults,
  isDesktop,
}) {
  const [searchText, setSearchText] = useState(routeSearchText);
  const inputRef = useRef(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    setSearchText(routeSearchText);
    inputRef.current.focus();
  }, [routeSearchText]);

  const { profiles, communities, posts, isLoading, onNeedLoadMore } = useSearchPage({
    type,
    searchText: routeSearchText,
    initialResults,
  });

  function onKeyDown(e) {
    if (e.which === KEY_CODES.ENTER) {
      e.preventDefault();
      Router.pushRoute('search', { q: searchText.trim(), type });
    }
  }

  function renderResults() {
    if (!profiles.length && !communities.length && !posts.length) {
      return (
        <EmptyList
          headerText="No results"
          subText="You can try to change the search query or go to feed"
        >
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
            <SectionHeader q={q} title="Users" type="profiles" />
            <SectionContent row>
              {profiles.map(id => (
                <EntityCardStyled key={id} userId={id} />
              ))}
            </SectionContent>
          </ResultsSection>
        ) : null}
        {communities.length ? (
          <ResultsSection isNeedFill>
            <SectionHeader q={q} title="Communities" type="communities" />
            <SectionContent row>
              {communities.map(id => (
                <EntityCardStyled key={id} communityId={id} />
              ))}
            </SectionContent>
          </ResultsSection>
        ) : null}
        <ResultsSection>
          <SectionHeader q={q} title="Posts" type="posts" />
          <SectionContent>
            {posts.length ? (
              <InfinityScrollHelper onNeedLoadMore={onNeedLoadMore}>
                {posts.map(id => (
                  <PostCard key={id} postId={id} />
                ))}
              </InfinityScrollHelper>
            ) : (
              <NothingFoundContainer>
                <NoResults>No post is found</NoResults>
              </NothingFoundContainer>
            )}
          </SectionContent>
        </ResultsSection>
      </SearchResults>
    );
  }

  function renderSpecificResults() {
    let items;
    let renderItem;
    let emptyText;

    switch (type) {
      case 'profiles':
        items = profiles;
        renderItem = id => <UserRowStyled key={id} userId={id} />;
        emptyText = 'Profile is not found';
        break;
      case 'communities':
        items = communities;
        renderItem = id => <CommunityRowStyled key={id} communityId={id} />;
        emptyText = 'Community is not found';
        break;
      case 'posts':
        items = posts;
        renderItem = id => <PostCard key={id} postId={id} />;
        emptyText = 'No one post is found';
        break;
      default:
    }

    return (
      <DetailedResults addTopBorder={type === 'posts'}>
        {items.length ? (
          <InfinityScrollHelper onNeedLoadMore={onNeedLoadMore}>
            {items.map(renderItem)}
          </InfinityScrollHelper>
        ) : (
          <NoResults>{emptyText}</NoResults>
        )}
      </DetailedResults>
    );
  }

  const navItems = SEARCH_TYPES.map(({ title, type: searchType }) => ({
    title,
    route: 'search',
    params: { q, type: searchType },
  }));

  return (
    <Wrapper>
      <Content
        aside={
          isDesktop
            ? () => (
                <StickyAsideStyled>
                  <SideBarNavigation items={navItems} />
                </StickyAsideStyled>
              )
            : null
        }
      >
        <Container isNeedFill={type === 'profiles' || type === 'communities'}>
          <SearchHeader>
            <SearchInput
              ref={inputRef}
              value={searchText || ''}
              onChange={setSearchText}
              onKeyDown={onKeyDown}
            />
            {!isDesktop ? <SideBarNavigationTags items={navItems} isRow /> : null}
          </SearchHeader>
          {type ? renderSpecificResults() : renderResults()}
          {isLoading ? <PaginationLoader /> : null}
        </Container>
      </Content>
    </Wrapper>
  );
}

SearchPage.propTypes = {
  q: PropTypes.string,
  searchText: PropTypes.string.isRequired,
  type: PropTypes.oneOf(ALLOWED_TYPES),
  initialResults: PropTypes.shape({
    profiles: PropTypes.arrayOf(PropTypes.string),
    communities: PropTypes.arrayOf(PropTypes.string),
    posts: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  isDesktop: PropTypes.bool.isRequired,
};

SearchPage.defaultProps = {
  q: null,
  type: null,
};

SearchPage.getInitialProps = async ({ query, store }) => {
  // eslint-disable-next-line prefer-const
  let { q, type } = query;
  const searchText = (q || '').trim();
  let results = {};

  if (type && !ALLOWED_TYPES.includes(type)) {
    type = null;
  }

  if (query) {
    if (type) {
      const { items } = await store.dispatch(
        entitySearch({ text: searchText, type, limit: SEARCH_PAGE_SIZE })
      );
      results[type] = items;
    } else {
      const data = await store.dispatch(
        extendedSearch({ text: searchText, limit: SEARCH_PAGE_SIZE })
      );

      results = {
        profiles: data.profiles ? data.profiles.items : undefined,
        communities: data.communities ? data.communities.items : undefined,
        posts: data.posts ? data.posts.items : undefined,
      };
    }
  }

  return {
    q,
    type,
    searchText,
    initialResults: results,
    namespacesRequired: [],
  };
};

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { KEY_CODES, up, PaginationLoader } from '@commun/ui';

import { extendedSearch, entitySearch, getCommunities } from 'store/actions/gate';
import { Router } from 'shared/routes';

import Content, { StickyAside } from 'components/common/Content';
import SideBarNavigation from 'components/common/SideBarNavigation';
import SearchInput from 'components/common/SearchInput';
import SectionHeader from 'components/search/SectionHeader';
import SpecificResults from 'components/search/SpecificResults';
import AllResults from 'components/search/AllResults';

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

const SearchHeader = styled.div`
  padding: 15px 15px 5px;
  border-radius: 10px 10px 0 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
  background-color: #fff;

  ${up.desktop} {
    padding-bottom: 14px;
  }
`;

const ContentWrapper = styled.div`
  ${is('isNeedFill')`
    background-color: #fff;

    ${up.tablet} {
      border-radius: 0 0 10px 10px;
    }
  `};
`;

const SectionHeaderStyled = styled(SectionHeader)`
  margin-bottom: -5px;
`;

const SideBarNavigationTags = styled(SideBarNavigation)`
  margin-top: 14px;
`;

export default function SearchPage({
  searchText: routeSearchText,
  type,
  initialResults,
  isDesktop,
  isDiscovery,
}) {
  const [searchText, setSearchText] = useState(routeSearchText);
  const inputRef = useRef(null);
  const isMounted = useRef(false);

  const searchTextTrimmed = searchText.trim();
  const q = searchTextTrimmed || null;

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    setSearchText(routeSearchText);
    inputRef.current.focus();
  }, [routeSearchText]);

  const { isLoading, onNeedLoadMore, ...results } = useSearchPage({
    type,
    isDiscovery,
    searchText: routeSearchText,
    initialResults,
  });

  function onKeyDown(e) {
    if (e.which === KEY_CODES.ENTER) {
      e.preventDefault();
      Router.pushRoute('search', { q, type });
    }
  }

  const navItems = SEARCH_TYPES.map(({ title, type: searchType }) => ({
    id: searchType || 'all',
    title,
    route: 'search',
    params: { type: searchType, q },
  }));

  let content;

  if (isDiscovery || type) {
    const itemsType = type || 'communities';

    content = (
      <>
        {!type && isDiscovery ? <SectionHeaderStyled title="Trending Communities" /> : null}
        <SpecificResults
          type={itemsType}
          items={results[itemsType]}
          isEmptyQuery={!routeSearchText}
          onNeedLoadMore={onNeedLoadMore}
        />
      </>
    );
  } else {
    const { profiles, communities, posts } = results;

    content = (
      <AllResults
        profiles={profiles}
        communities={communities}
        posts={posts}
        q={q}
        onNeedLoadMore={onNeedLoadMore}
      />
    );
  }

  return (
    <Wrapper>
      <Content
        aside={
          isDesktop
            ? () => (
                <StickyAsideStyled>
                  <SideBarNavigation currentId={type || 'all'} items={navItems} />
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
              placeholder="Search"
              autoFocus
              onChange={setSearchText}
              onKeyDown={onKeyDown}
            />
            {!isDesktop ? (
              <SideBarNavigationTags currentId={type || 'all'} items={navItems} isRow />
            ) : null}
          </SearchHeader>
          <ContentWrapper isNeedFill={isDiscovery}>
            {content}
            {isLoading ? <PaginationLoader /> : null}
          </ContentWrapper>
        </Container>
      </Content>
    </Wrapper>
  );
}

SearchPage.propTypes = {
  searchText: PropTypes.string.isRequired,
  type: PropTypes.oneOf(ALLOWED_TYPES),
  initialResults: PropTypes.shape({
    profiles: PropTypes.arrayOf(PropTypes.string),
    communities: PropTypes.arrayOf(PropTypes.string),
    posts: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  isDiscovery: PropTypes.bool.isRequired,
  isDesktop: PropTypes.bool.isRequired,
};

SearchPage.defaultProps = {
  type: null,
};

SearchPage.getInitialProps = async ({ query, store }) => {
  // eslint-disable-next-line prefer-const
  let { q, type } = query;
  const searchText = (q || '').trim();
  let results = {};
  let isDiscovery = false;

  if (type && !ALLOWED_TYPES.includes(type)) {
    type = null;
  }

  if (searchText) {
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
  } else {
    const { items } = await store.dispatch(getCommunities());

    isDiscovery = true;
    results = {
      communities: items.map(({ communityId }) => communityId),
    };
  }

  return {
    type,
    searchText,
    isDiscovery,
    initialResults: results,
    namespacesRequired: [],
  };
};

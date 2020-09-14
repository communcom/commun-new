import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { KEY_CODES, PaginationLoader, up } from '@commun/ui';

import { useTranslation } from 'shared/i18n';
import { Router } from 'shared/routes';
import { entitySearch, extendedSearch, getCommunities } from 'store/actions/gate';

import Content, { StickyAside } from 'components/common/Content';
import SearchInput from 'components/common/SearchInput';
import SideBarNavigation from 'components/common/SideBarNavigation';
import AllResults from 'components/pages/search/AllResults';
import SectionHeader from 'components/pages/search/SectionHeader';
import SpecificResults from 'components/pages/search/SpecificResults';
import { TagsWidget } from 'components/widgets';
import useSearchPage, { SEARCH_PAGE_SIZE } from './useSearchPageHook';

const ALLOWED_TYPES = ['profiles', 'communities', 'posts'];

const SEARCH_TYPES = [
  {
    tabLocaleKey: 'all',
  },
  {
    tabLocaleKey: 'users',
    type: 'profiles',
  },
  {
    tabLocaleKey: 'communities',
    type: 'communities',
  },
  {
    tabLocaleKey: 'posts',
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
    background-color: ${({ theme }) => theme.colors.white};
  `};
`;

const StickyAsideStyled = styled(StickyAside)`
  width: 330px;
`;

const SideBarNavigationStyled = styled(SideBarNavigation)`
  margin-bottom: 15px;
`;

const SearchHeader = styled.div`
  padding: 15px 15px 5px;
  border-radius: 10px 10px 0 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
  background-color: ${({ theme }) => theme.colors.white};

  ${up.desktop} {
    padding-bottom: 14px;
  }
`;

const ContentWrapper = styled.div`
  ${is('isNeedFill')`
    background-color: ${({ theme }) => theme.colors.white};

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
  isMobile,
  isDiscovery,
}) {
  const { t } = useTranslation();

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

  const navItems = SEARCH_TYPES.map(({ tabLocaleKey, type: searchType }) => ({
    id: searchType || 'all',
    tabLocaleKey,
    route: 'search',
    params: { type: searchType, q },
    index: !searchType,
  }));

  let content;

  if (isDiscovery || type) {
    const itemsType = type || 'communities';

    content = (
      <>
        {!type && isDiscovery && isMobile ? (
          <SectionHeaderStyled title={t('widgets.trending_communities.title')} />
        ) : null}
        <SpecificResults
          type={itemsType}
          items={results[itemsType]}
          isEmptyQuery={!routeSearchText}
          isMobile={isMobile}
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
        isMobile={isMobile}
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
                  <SideBarNavigationStyled
                    sectionKey="type"
                    tabsLocalePath="search.tabs"
                    items={navItems}
                    localeFiles={['page_search']}
                  />
                  <TagsWidget />
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
              placeholder={t('common.search_placeholder')}
              autoFocus
              onChange={setSearchText}
              onKeyDown={onKeyDown}
            />
            {!isDesktop ? (
              <SideBarNavigationTags
                sectionKey="type"
                tabsLocalePath="search.tabs"
                items={navItems}
                isRow
                localeFiles={['page_search']}
              />
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
  isMobile: PropTypes.bool.isRequired,
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
    namespacesRequired: ['page_search'],
  };
};

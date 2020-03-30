import React from 'react';
import PropTypes from 'prop-types';

import { getCommunities } from 'store/actions/gate';

import { COMMUNITIES_FETCH_LIMIT, LOCALES } from 'shared/constants';
import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';
import useSearch, { searchInitialState } from 'utils/hooks/useSearch';

import EmptyList from 'components/common/EmptyList/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import DropDownMenu from 'components/common/DropDownMenu';
import { ChevronIcon, MenuLink } from 'components/common/filters/common/Filter.styled';

import {
  Wrapper,
  CommunityRowStyled,
  Items,
  PaginationLoaderStyled,
  SearchInputStyled,
  FilterStyled,
} from '../common.styled';

// eslint-disable-next-line no-shadow
function Discover({ reducerInitialState, locale, getCommunities }) {
  const { t } = useTranslation();

  async function loadData(params) {
    return getCommunities({
      search: params.searchText,
      offset: params.offset,
      limit: params.limit,
      allowedLanguages: [locale],
    });
  }

  const { searchState, searchText, setSearchText, onNeedLoad } = useSearch(
    {
      initialState: reducerInitialState,
      limit: COMMUNITIES_FETCH_LIMIT,
      loadData,
    },
    [locale]
  );

  function renderEmpty() {
    if (searchState.items.length) {
      return <EmptyList noIcon />;
    }

    return <EmptyList headerText={t('components.communities.no_found')} />;
  }

  const FILTERS = [
    {
      value: 'all',
      label: t('common.all'),
    },
    ...LOCALES,
  ];

  const LanguageSelect = (
    <DropDownMenu
      openAt="bottom"
      align="right"
      handler={props => {
        const label = FILTERS.find(item => item.value === locale)?.label;

        return (
          <FilterStyled {...props}>
            {label}
            <ChevronIcon />
          </FilterStyled>
        );
      }}
      items={() =>
        FILTERS.map(({ value, label }) => (
          <Link
            route="communities"
            params={{
              locale: value,
            }}
            passHref
            key={value}
          >
            <MenuLink isActive={locale === value} name={`discover-filters__locale-${value}`}>
              {label}
            </MenuLink>
          </Link>
        ))
      }
    />
  );

  return (
    <Wrapper>
      <SearchInputStyled
        value={searchText}
        onChange={setSearchText}
        rightComponent={LanguageSelect}
      />
      <InfinityScrollHelper
        disabled={searchState.isEnd || searchState.isLoading}
        onNeedLoadMore={onNeedLoad}
      >
        <Items>
          {searchState.items.map(({ communityId }) => (
            <CommunityRowStyled communityId={communityId} key={communityId} />
          ))}
        </Items>
        {searchState.isLoading ? <PaginationLoaderStyled /> : null}
        {!searchState.items.length && !searchState.isLoading ? renderEmpty() : null}
      </InfinityScrollHelper>
    </Wrapper>
  );
}

Discover.propTypes = {
  reducerInitialState: PropTypes.shape({}).isRequired,
  locale: PropTypes.string.isRequired,
  getCommunities: PropTypes.func.isRequired,
};

Discover.getInitialProps = async ({ store, query }) => {
  const { locale = 'all' } = query;

  const result = await store.dispatch(getCommunities({ allowedLanguages: [locale] }));

  return {
    reducerInitialState: {
      ...searchInitialState,
      items: result.items,
    },
    locale,
    namespacesRequired: [],
  };
};

export default Discover;

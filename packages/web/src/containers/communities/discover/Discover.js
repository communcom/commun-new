import React from 'react';
import PropTypes from 'prop-types';

import { getCommunities } from 'store/actions/gate';

import { COMMUNITIES_FETCH_LIMIT } from 'shared/constants';
import useSearch, { searchInitialState } from 'utils/hooks/useSearch';
import EmptyList from 'components/common/EmptyList/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';

import {
  Wrapper,
  CommunityRowStyled,
  Items,
  PaginationLoaderStyled,
  SearchInputStyled,
} from '../common.styled';

// eslint-disable-next-line no-shadow
function Discover({ reducerInitialState, getCommunities }) {
  async function loadData(params) {
    return getCommunities({
      search: params.searchText,
      offset: params.offset,
      limit: params.limit,
    });
  }

  const { searchState, searchText, setSearchText, onNeedLoad } = useSearch({
    initialState: reducerInitialState,
    limit: COMMUNITIES_FETCH_LIMIT,
    loadData,
  });

  function renderEmpty() {
    if (searchState.items.length) {
      return <EmptyList noIcon />;
    }

    return <EmptyList headerText="No Communities" />;
  }

  return (
    <Wrapper>
      <SearchInputStyled value={searchText} onChange={setSearchText} />
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
  getCommunities: PropTypes.func.isRequired,
};

Discover.getInitialProps = async ({ store }) => {
  const result = await store.dispatch(getCommunities());

  return {
    reducerInitialState: {
      ...searchInitialState,
      items: result.items,
    },
    namespacesRequired: [],
  };
};

export default Discover;

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { up } from 'styled-breakpoints';

import { Icon } from '@commun/icons';
import { SORT_BY_NEWEST, SORT_BY_OLDEST /* SORT_BY_POPULAR */ } from 'shared/constants';

const filters = [
  { type: SORT_BY_NEWEST, desc: 'newest' },
  { type: SORT_BY_OLDEST, desc: 'oldest' },
  // TODO: not implemented on backend yet
  // { type: SORT_BY_POPULAR, desc: 'popular' },
];

const Wrapper = styled.div``;

const FilterChevron = styled(({ isOpen, ...props }) => <Icon {...props} />)`
  width: 18px;
  height: 18px;
  margin-left: 8px;

  ${is('isOpen')`
    transform: rotate(180deg);
  `};
`;

const FilterButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 13px;
  text-transform: lowercase;
  & ${FilterChevron} {
    color: ${({ theme }) => theme.colors.contextGrey};
  }
`;

const FilterButtonWrapper = styled.div`
  position: relative;

  ${up('tablet')} {
    display: none;
  }
`;

const FilterTabsWrapper = styled.ul`
  display: none;

  & > li {
    padding: 16px;
  }

  ${up('tablet')} {
    display: flex;
  }
`;

const FiltersList = styled.ul`
  position: absolute;
  right: 0;
  bottom: 24px;
  padding: 10px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 2;
`;

const FiltersItem = styled.li`
  padding: 10px 0;
`;

const ItemButton = styled.button`
  font-weight: 600;
  font-size: 13px;
  text-transform: lowercase;
  color: ${({ theme, isActive }) => (isActive ? '#000' : theme.colors.contextGrey)};
  transition: color 0.15s;

  &:focus,
  &:hover {
    color: ${({ theme }) => theme.colors.hoverBlack};
  }
`;

export default class Filter extends Component {
  static propTypes = {
    setCommentsFilter: PropTypes.func.isRequired,
    filterSortBy: PropTypes.string.isRequired,
  };

  state = {
    isFiltersListOpen: false,
  };

  filtersListRef = createRef();

  filterButtonRef = createRef();

  checkOuterClick = e => {
    if (this.filterButtonRef.current.contains(e.target)) {
      return;
    }
    if (!this.filtersListRef.current.contains(e.target)) {
      this.closeFiltersList();
    }
  };

  clickFilterItem = item => () => {
    const { filterSortBy, setCommentsFilter } = this.props;
    const { isFiltersListOpen } = this.state;

    if (filterSortBy !== item) {
      setCommentsFilter(item);
    }
    if (isFiltersListOpen) {
      this.closeFiltersList();
    }
  };

  toggleFiltersList = () => {
    const { isFiltersListOpen } = this.state;

    if (isFiltersListOpen) {
      this.closeFiltersList();
    } else {
      this.openFiltersList();
    }
  };

  openFiltersList() {
    this.setState({ isFiltersListOpen: true });
    window.addEventListener('click', this.checkOuterClick, true);
  }

  closeFiltersList() {
    this.setState({ isFiltersListOpen: false });
    window.removeEventListener('click', this.checkOuterClick, true);
  }

  renderFilterItems() {
    const { filterSortBy } = this.props;

    return filters.map(item => (
      <FiltersItem key={item.type} onClick={this.clickFilterItem(item.type)}>
        <ItemButton isActive={filterSortBy === item.type}>{item.desc}</ItemButton>
      </FiltersItem>
    ));
  }

  render() {
    const { filterSortBy, className } = this.props;
    const { isFiltersListOpen } = this.state;
    const selectedFilter = filters.find(filter => filter.type === filterSortBy);

    return (
      <Wrapper className={className}>
        <FilterButtonWrapper>
          <FilterButton
            ref={this.filterButtonRef}
            aria-label={`изменить фильтрацию комментариев, сейчас выбрано: ${
              selectedFilter ? selectedFilter.desc.toLowerCase() : filterSortBy.toLowerCase()
            }`}
            onClick={this.toggleFiltersList}
          >
            {selectedFilter ? selectedFilter.desc.toLowerCase() : filterSortBy.toLowerCase()}
            <FilterChevron name="dropdown" isOpen={isFiltersListOpen} />
          </FilterButton>
          {isFiltersListOpen && (
            <FiltersList ref={this.filtersListRef}>{this.renderFilterItems()}</FiltersList>
          )}
        </FilterButtonWrapper>
        <FilterTabsWrapper>{this.renderFilterItems()}</FilterTabsWrapper>
      </Wrapper>
    );
  }
}

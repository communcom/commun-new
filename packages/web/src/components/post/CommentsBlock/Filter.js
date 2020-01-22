import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { SORT_BY_NEWEST, SORT_BY_OLDEST /* SORT_BY_POPULAR */ } from 'shared/constants';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';

const ORDERS = [
  { type: SORT_BY_OLDEST, desc: 'Oldest' },
  { type: SORT_BY_NEWEST, desc: 'Newest' },
  // TODO: not implemented on backend yet
  // { type: SORT_BY_POPULAR, desc: 'popular' },
];

const Wrapper = styled.div``;

const FilterChevron = styled(Icon)`
  width: 18px;
  height: 18px;
  margin-left: 8px;
`;

const FilterButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  height: 28px;
  font-weight: 600;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.blue};

  & ${FilterChevron} {
    color: ${({ theme }) => theme.colors.gray};

    ${is('isOpen')`
      transform: rotate(180deg);
    `};
  }
`;

const DropDownMenuStyled = styled(DropDownMenu)`
  z-index: 10;
`;

export default class Filter extends Component {
  static propTypes = {
    setCommentsFilter: PropTypes.func.isRequired,
    filterSortBy: PropTypes.string.isRequired,
  };

  clickFilterItem = type => {
    const { filterSortBy, setCommentsFilter } = this.props;

    if (filterSortBy !== type) {
      setCommentsFilter(type);
    }
  };

  renderFilterItems() {
    const { filterSortBy } = this.props;

    return ORDERS.map(item => (
      <DropDownMenuItem
        key={item.type}
        isActive={filterSortBy === item.type}
        onClick={() => this.clickFilterItem(item.type)}
      >
        {item.desc}
      </DropDownMenuItem>
    ));
  }

  render() {
    const { filterSortBy, className } = this.props;
    const selectedFilter = ORDERS.find(order => order.type === filterSortBy);

    return (
      <Wrapper className={className}>
        <DropDownMenuStyled
          align="right"
          openAt="bottom"
          handler={props => (
            <FilterButton
              aria-label={`change comments ordering, now selected: ${
                selectedFilter ? selectedFilter.desc : filterSortBy
              }`}
              {...props}
            >
              {selectedFilter ? selectedFilter.desc : filterSortBy}
              <FilterChevron name="dropdown" />
            </FilterButton>
          )}
          items={() => this.renderFilterItems()}
        />
        {/* <FilterTabsWrapper>{this.renderFilterItems()}</FilterTabsWrapper> */}
      </Wrapper>
    );
  }
}

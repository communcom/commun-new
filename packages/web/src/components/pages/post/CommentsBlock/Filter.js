import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';

import { SORT_BY_NEWEST, SORT_BY_OLDEST, SORT_BY_POPULARITY } from 'shared/constants';
import { withTranslation } from 'shared/i18n';

import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';

const ORDERS = [SORT_BY_OLDEST, SORT_BY_NEWEST, SORT_BY_POPULARITY];

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

@withTranslation()
export default class Filter extends Component {
  static propTypes = {
    setCommentsFilter: PropTypes.func.isRequired,
    align: PropTypes.string,
    filterSortBy: PropTypes.string.isRequired,
  };

  static defaultProps = {
    align: 'right',
  };

  clickFilterItem = type => {
    const { filterSortBy, setCommentsFilter } = this.props;

    if (filterSortBy !== type) {
      setCommentsFilter(type);
    }
  };

  renderFilterItems() {
    const { filterSortBy, t } = this.props;

    return ORDERS.map(type => (
      <DropDownMenuItem
        key={type}
        isActive={filterSortBy === type}
        onClick={() => this.clickFilterItem(type)}
      >
        {t(`filters.sortBy.${type}`)}
      </DropDownMenuItem>
    ));
  }

  render() {
    const { filterSortBy, align, t, className } = this.props;
    const isSelectedFilter = ORDERS.includes(filterSortBy);

    return (
      <Wrapper className={className}>
        <DropDownMenuStyled
          align={align}
          openAt="bottom"
          handler={props => (
            <FilterButton
              aria-label={`change comments ordering, now selected: ${
                isSelectedFilter ? t(`filters.sortBy.${filterSortBy}`) : filterSortBy
              }`}
              {...props}
            >
              {isSelectedFilter ? t(`filters.sortBy.${filterSortBy}`) : filterSortBy}
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

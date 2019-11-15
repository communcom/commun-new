import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';
import is from 'styled-is';

import { Loader, up } from '@commun/ui';

import { activeLink } from 'utils/hocs';
import { Router } from 'shared/routes';
import { transferHistoryType } from 'types/common';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';

import TabLoader from 'components/common/TabLoader/TabLoader';
import TransferRow from './TransferRow';
import ConvertRow from './ConvertRow';
import { Item } from './commonStyled';

const FILTER_TYPES = {
  ALL: 'all',
  TRANSFER: 'transfer',
  CONVERT: 'convert',
};

const DEFAULT_FILTER = FILTER_TYPES.ALL;

const FILTERS = [
  {
    type: FILTER_TYPES.ALL,
    label: 'all',
    route: 'walletSection',
    linkParams: { section: 'history' },
  },
  {
    type: FILTER_TYPES.TRANSFER,
    label: 'transfer',
    route: 'walletSectionType',
    linkParams: { section: 'history', type: FILTER_TYPES.TRANSFER },
  },
  {
    type: FILTER_TYPES.CONVERT,
    label: 'conversion',
    route: 'walletSectionType',
    linkParams: { section: 'history', type: FILTER_TYPES.CONVERT },
  },
];

const Wrapper = styled.section`
  position: relative;
  width: 100%;
  min-height: 100%;
  padding: 16px 16px 12px;
  background-color: #fff;

  ${up.tablet} {
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    border-radius: 4px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: baseline;
`;

const HeaderRight = styled.div``;

const HeaderTitle = styled.h1`
  font-size: 22px;
  font-weight: bold;
`;

const HeaderCounter = styled.span`
  margin-left: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #ccc;
`;

const Filters = styled.div`
  display: flex;
`;

const FilterSelect = styled.select`
  height: 30px;
`;

const Body = styled.div``;

const StyledLink = styled.a`
  padding: 8px;
  margin: 0 -8px 0 32px;
  font-size: 13px;
  color: #b2b2b2;

  ${is('active')`
  color: #000;
  `};
`;

const FilterItemLink = activeLink(StyledLink);

const EmptyBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  font-size: 28px;
  font-weight: bold;
  color: #b2b2b2;
`;

const Items = styled.ul``;

const Divider = styled.div`
  color: ${({ theme }) => theme.colors.gray};

  font-weight: bold;
  font-size: 13px;
  line-height: 18px;

  text-transform: uppercase;
`;

const LoaderStyled = styled(Loader)`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

export default class WalletHistory extends PureComponent {
  static propTypes = {
    query: PropTypes.shape({
      section: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['transfer', 'convert']),
    }).isRequired,
    transfers: transferHistoryType.isRequired,
    screenType: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,

    getTransfersHistory: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.fetchHistorySafe();
  }

  onFilterChange = e => {
    const type = e.target.value;

    const filter = FILTERS.find(item => item.type === type);

    Router.pushRoute(filter.route, filter.linkParams);
  };

  checkLoadMore = () => {
    const { isLoading, isEnd } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    this.fetchHistorySafe();
  };

  fetchHistorySafe() {
    const { getTransfersHistory, transfers, query } = this.props;

    try {
      getTransfersHistory({
        filter: query.type || DEFAULT_FILTER,
        offset: transfers.length,
      });
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }
  }

  renderFilters() {
    const { screenType, query } = this.props;
    const type = query.type || DEFAULT_FILTER;

    if (screenType === 'mobile') {
      return (
        <FilterSelect value={type} onChange={this.onFilterChange}>
          {FILTERS.map(filter => (
            <option key={filter.type} value={filter.type}>
              {filter.label}
            </option>
          ))}
        </FilterSelect>
      );
    }

    return FILTERS.map(filter => (
      <FilterItemLink key={filter.type} route={filter.route} params={filter.linkParams}>
        {filter.label}
      </FilterItemLink>
    ));
  }

  renderItems() {
    const { transfers, isLoading, isEnd } = this.props;
    if (transfers.length === 0) {
      return <EmptyBlock>Empty</EmptyBlock>;
    }

    return (
      <InfinityScrollHelper disabled={isLoading || isEnd} onNeedLoadMore={this.checkLoadMore}>
        <Items>
          {transfers.reduce((acc, item, index, array) => {
            if (dayjs(item.timestamp).isBefore(array[index > 0 ? index - 1 : 0].timestamp, 'day')) {
              acc.push(
                <Item key={item.timestamp}>
                  <Divider>{dayjs(item.timestamp).fromNow()}</Divider>
                </Item>
              );
            }

            if (item.meta.transferType === 'transfer') {
              acc.push(<TransferRow key={item.id} item={item} />);
            } else if (item.meta.transferType === 'convert') {
              acc.push(<ConvertRow key={item.id} item={item} />);
            }

            return acc;
          }, [])}
        </Items>
        {isLoading ? <LoaderStyled /> : null}
      </InfinityScrollHelper>
    );
  }

  render() {
    const { transfers, isLoading } = this.props;
    if (!transfers.length && isLoading) {
      return <TabLoader />;
    }

    return (
      <Wrapper>
        <Header>
          <HeaderLeft>
            <HeaderTitle>Transactions</HeaderTitle>
            <HeaderCounter>{transfers.length}</HeaderCounter>
          </HeaderLeft>
          <HeaderRight>
            {transfers.length ? <Filters>{this.renderFilters()}</Filters> : null}
          </HeaderRight>
        </Header>
        <Body>{this.renderItems()}</Body>
      </Wrapper>
    );
  }
}

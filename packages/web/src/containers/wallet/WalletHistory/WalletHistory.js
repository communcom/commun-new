import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Loader, up } from '@commun/ui';

import { activeLink } from 'utils/hocs';
import { Router, Link } from 'shared/routes';
import { TRANSACTIONS_TYPE } from 'shared/constants';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';

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
    border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
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
  letter-spacing: -0.41px;
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

const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 6px 0;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.contextWhite};
`;

const IconStyled = styled(Icon)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.contextBlue};
`;

const ItemBodyWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  min-height: 68px;
  margin-left: 16px;
`;

const ItemBody = styled.div``;

const ItemValues = styled.div`
  margin-left: 16px;
`;

const ItemLine = styled.div`
  margin-top: 2px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.contextGrey};

  ${is('isValue')`
    text-align: right;
  `};

  &:first-child {
    margin-top: 0;
    font-size: 17px;
    font-weight: bold;
    color: #000;
  }
`;

const Currency = styled.span`
  ${up.tablet} {
    &::after {
      content: ' points';
    }
  }
`;

const Value = styled.span`
  ${is('isNegative')`
    color: ${({ theme }) => theme.colors.contextGrey};
  `};
`;

const ItemLink = styled.a`
  color: inherit;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlue};
    transition: color 0.15s;
  }
`;

const Divider = styled.div`
  color: ${({ theme }) => theme.colors.contextGrey};

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
    transactions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    sequenceKey: PropTypes.string,
    screenType: PropTypes.string.isRequired,
    loggedUserId: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isTransfersUpdated: PropTypes.bool,

    getTransfersHistory: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sequenceKey: null,
  };

  static defaultProps = {
    isTransfersUpdated: false,
  };

  componentDidMount() {
    this.onNeedLoadMore();
  }

  onFilterChange = e => {
    const type = e.target.value;

    const filter = FILTERS.find(item => item.type === type);

    Router.pushRoute(filter.route, filter.linkParams);
  };

  onNeedLoadMore = () => {
    const { loggedUserId, getTransfersHistory, isTransfersUpdated, sequenceKey } = this.props;
    if (!isTransfersUpdated) {
      try {
        getTransfersHistory({
          username: loggedUserId,
          filter: DEFAULT_FILTER,
          sequenceKey,
        });
      } catch (err) {
        // eslint-disable-next-line
        console.warn(err);
      }
    }
  };

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

  renderItem = item => {
    switch (item.type) {
      // TODO refactor after wallet changes
      case TRANSACTIONS_TYPE.CONVERT:
        return (
          <Item key={item.id}>
            <IconWrapper>
              <IconStyled name="transfer-points" />
            </IconWrapper>
            <ItemBodyWrapper>
              <ItemBody>
                <ItemLine>
                  Convert in <Currency>{item.to.currency}</Currency>
                </ItemLine>
                <ItemLine>
                  from <Currency>{item.from.currency}</Currency> {dayjs(item.timestamp).fromNow()}
                </ItemLine>
              </ItemBody>
            </ItemBodyWrapper>
            <ItemValues>
              <ItemLine isValue>
                <Value>+{item.to.value}</Value>
              </ItemLine>
              <ItemLine isValue>
                <Value>-{item.from.value}</Value>
              </ItemLine>
            </ItemValues>
          </Item>
        );
      case TRANSACTIONS_TYPE.SEND:
        return (
          <Item key={item.id}>
            <IconWrapper>
              <IconStyled name="send-points" />
            </IconWrapper>
            <ItemBodyWrapper>
              <ItemBody>
                <ItemLine>
                  Send <Currency>{item.currency}</Currency> to{' '}
                  <Link route={`/@${item.to}`} passHref>
                    <ItemLink>@{item.to}</ItemLink>
                  </Link>
                </ItemLine>
                <ItemLine>{dayjs(item.timestamp).fromNow()}</ItemLine>
              </ItemBody>
            </ItemBodyWrapper>
            <ItemValues>
              <ItemLine isValue>
                <Value isNegative>-{item.value}</Value>
              </ItemLine>
            </ItemValues>
          </Item>
        );
      case TRANSACTIONS_TYPE.RECEIVE:
        return (
          <Item key={item.id}>
            <IconWrapper>
              <IconStyled name="receive-points" />
            </IconWrapper>
            <ItemBodyWrapper>
              <ItemBody>
                <ItemLine>
                  Receive <Currency>{item.currency}</Currency> from{' '}
                  <Link route={`/@${item.from}`} passHref>
                    <ItemLink>@{item.from}</ItemLink>
                  </Link>
                </ItemLine>
                <ItemLine>{dayjs(item.timestamp).fromNow()}</ItemLine>
              </ItemBody>
            </ItemBodyWrapper>
            <ItemValues>
              <ItemLine isValue>
                <Value>+{item.value}</Value>
              </ItemLine>
            </ItemValues>
          </Item>
        );
      default:
        // eslint-disable-next-line no-console
        console.error(`Unsupported type: [${item.type}]`);
    }

    return null;
  };

  renderItems = list =>
    list.reduce((acc, item, index, array) => {
      if (dayjs(item.timestamp).isBefore(array[index > 0 ? index - 1 : 0].timestamp, 'day')) {
        acc.push(
          <Item key={item.timestamp}>
            <Divider>{dayjs(item.timestamp).fromNow()}</Divider>
          </Item>
        );
      }

      acc.push(this.renderItem(item));

      return acc;
    }, []);

  renderContent() {
    const { query, transactions } = this.props;
    const { type } = query;

    let list = transactions;

    if (type) {
      list = list.filter(item => {
        if (type === FILTER_TYPES.TRANSFER) {
          return item.type === TRANSACTIONS_TYPE.SEND || item.type === TRANSACTIONS_TYPE.RECEIVE;
        }

        return type === item.type;
      });
    }

    if (list.length === 0) {
      return <EmptyBlock>Empty</EmptyBlock>;
    }

    return <Items>{this.renderItems(list)}</Items>;
  }

  render() {
    const { transactions, isLoading } = this.props;

    return (
      <Wrapper>
        <Header>
          <HeaderLeft>
            <HeaderTitle>Transactions</HeaderTitle>
            <HeaderCounter>{transactions.length}</HeaderCounter>
          </HeaderLeft>
          <HeaderRight>
            {transactions.length ? <Filters>{this.renderFilters()}</Filters> : null}
          </HeaderRight>
        </Header>
        <InfinityScrollHelper disabled={isLoading} onNeedLoadMore={this.onNeedLoadMore}>
          {this.renderContent()}
        </InfinityScrollHelper>
        {isLoading ? <LoaderStyled /> : null}
      </Wrapper>
    );
  }
}

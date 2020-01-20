import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Loader, up } from '@commun/ui';

import { TRANSACTION_HISTORY_TYPE } from 'shared/constants';

import { EmptyPanel } from 'components/wallet';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';

import HistoryList from '../HistoryList';

const Wrapper = styled.section`
  position: relative;

  padding: 10px 0;
  width: 100%;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 15px;

  ${up.tablet} {
    border-radius: 6px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 5px;
  padding: 0 15px;
`;

const HeaderTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
`;

const FilterIcon = styled(Icon).attrs({ name: 'filter' })`
  width: 20px;
  height: 20px;

  color: ${({ theme }) => theme.colors.gray};
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;

  padding: 5px;
  padding-right: 15px;

  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
  background: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 10px;
  outline: none;
`;

const Body = styled.div``;

const LoaderStyled = styled(Loader)`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

export default class TransferHistory extends PureComponent {
  static propTypes = {
    historyType: PropTypes.oneOf(Object.keys(TRANSACTION_HISTORY_TYPE)),
    transfers: PropTypes.arrayOf(PropTypes.shape({})),
    pointSymbol: PropTypes.string.isRequired,
    isPointHistory: PropTypes.bool.isRequired,

    getTransfersHistory: PropTypes.func.isRequired,
    openModalHistoryFilter: PropTypes.func.isRequired,
    isTransfersHistoryLoading: PropTypes.bool.isRequired,
    isPointHistoryLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    historyType: TRANSACTION_HISTORY_TYPE.POINT,
    transfers: [],
  };

  state = {
    filters: null,
  };

  async componentDidMount() {
    const { isPointHistory } = this.props;

    if (isPointHistory) {
      await this.fetchHistorySafe();
    }
  }

  async componentDidUpdate(prevProps) {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.pointSymbol !== prevProps.pointSymbol) {
      await this.fetchHistorySafe();
    }
  }

  checkLoadMore = async () => {
    const { isTransfersHistoryLoading, isEnd } = this.props;

    if (isTransfersHistoryLoading || isEnd) {
      return;
    }

    await this.fetchHistorySafe();
  };

  onClickFilterButton = async () => {
    const { openModalHistoryFilter } = this.props;
    const { filters } = this.state;

    const result = await openModalHistoryFilter({ filters });

    if (result) {
      this.setState({
        filters: result,
      });

      await this.fetchHistorySafe(result);
    }
  };

  async fetchHistorySafe(filter) {
    const { historyType, pointSymbol, getTransfersHistory, transfers } = this.props;

    const args = {
      historyType,
      symbol: pointSymbol,
      offset: transfers.length,
    };

    if (filter) {
      args.direction = filter.direction;
      args.transferType = filter.transferType;
      args.rewardsType = filter.rewardsType;
      args.offset = 0;
    }

    try {
      await getTransfersHistory(args);
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }
  }

  renderItems() {
    const {
      transfers,
      isPointHistory,
      isTransfersHistoryLoading,
      isPointHistoryLoading,
      isEnd,
    } = this.props;

    const list = (
      <>
        <HistoryList
          items={transfers}
          itemClickHandler={() => {
            /* TODO */
          }}
        />
        {isTransfersHistoryLoading || isPointHistoryLoading ? <LoaderStyled /> : null}
      </>
    );

    if (isPointHistory) {
      return list;
    }

    return (
      <InfinityScrollHelper
        disabled={isTransfersHistoryLoading || isEnd}
        onNeedLoadMore={this.checkLoadMore}
      >
        {list}
      </InfinityScrollHelper>
    );
  }

  render() {
    const { transfers, isPointHistory, className } = this.props;
    const { filters } = this.state;

    if (!transfers.length && !filters) {
      if (isPointHistory) {
        return null;
      }
      return <EmptyPanel primary="History empty" secondary="No transactions" />;
    }

    return (
      <Wrapper className={className}>
        <Header>
          <HeaderTitle>History</HeaderTitle>
          <FilterButton onClick={this.onClickFilterButton}>
            <FilterIcon />
            Filter
          </FilterButton>
        </Header>
        {!transfers.length && filters ? (
          <EmptyPanel primary="No transactions found" secondary="Try to send or convert" />
        ) : (
          <Body>{this.renderItems()}</Body>
        )}
      </Wrapper>
    );
  }
}

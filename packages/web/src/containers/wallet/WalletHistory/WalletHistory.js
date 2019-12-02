import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Loader, up } from '@commun/ui';

import HistoryList from 'components/wallet/HistoryList';

import { transferHistoryType } from 'types/common';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';

import TabLoader from 'components/common/TabLoader/TabLoader';

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
  margin-bottom: 25px;

  padding: 0 15px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: baseline;
`;

const HeaderTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
`;

const Body = styled.div``;

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

const LoaderStyled = styled(Loader)`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

export default class WalletHistory extends PureComponent {
  static propTypes = {
    transfers: transferHistoryType.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,

    getTransfersHistory: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.fetchHistorySafe();
  }

  checkLoadMore = () => {
    const { isLoading, isEnd } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    this.fetchHistorySafe();
  };

  fetchHistorySafe() {
    const { getTransfersHistory, transfers } = this.props;

    try {
      getTransfersHistory({
        filter: 'all',
        offset: transfers.length,
      });
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }
  }

  renderItems() {
    const { transfers, isLoading, isEnd } = this.props;
    if (transfers.length === 0) {
      return <EmptyBlock>Empty</EmptyBlock>;
    }

    return (
      <InfinityScrollHelper disabled={isLoading || isEnd} onNeedLoadMore={this.checkLoadMore}>
        <Items>
          <HistoryList
            items={transfers}
            itemClickHandler={() => {
              /* TODO */
            }}
          />
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
            <HeaderTitle>History</HeaderTitle>
          </HeaderLeft>
        </Header>
        <Body>{this.renderItems()}</Body>
      </Wrapper>
    );
  }
}

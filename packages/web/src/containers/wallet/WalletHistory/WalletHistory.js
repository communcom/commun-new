import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';

import { TRANSACTION_HISTORY_TYPE } from 'shared/constants';

import TabLoader from 'components/common/TabLoader/TabLoader';
import TransferHistory from 'components/pages/wallet/history/TransferHistory';

const Wrapper = styled.section`
  position: relative;

  padding: 5px 0;
  width: 100%;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 15px;

  ${up.tablet} {
    border-radius: 6px;
  }

  & h3 {
    font-size: 18px;
  }
`;

export default class WalletHistory extends PureComponent {
  static propTypes = {
    isTransfersEmpty: PropTypes.bool.isRequired,
    isTransfersHistoryLoading: PropTypes.bool.isRequired,
    getTransfersHistory: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const { getTransfersHistory } = this.props;
    try {
      await getTransfersHistory();
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }
  }

  render() {
    const { isTransfersEmpty, isTransfersHistoryLoading } = this.props;

    if (isTransfersEmpty && isTransfersHistoryLoading) {
      return <TabLoader />;
    }

    return (
      <Wrapper>
        <TransferHistory historyType={TRANSACTION_HISTORY_TYPE.FULL} />
      </Wrapper>
    );
  }
}

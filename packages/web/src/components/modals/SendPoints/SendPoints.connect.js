import { connect } from 'react-redux';

import { transfer } from 'store/actions/commun';
import { statusSelector, dataSelector } from 'store/selectors/common';

import SendPoints, { DEFAULT_TOKEN } from './SendPoints';

// TODO refactor
export default connect(
  (state, props) => {
    const { balances } = dataSelector('wallet')(state);
    const { isTransferLoading, isLoading } = statusSelector('wallet')(state);

    let points;
    let selectedPoint;

    if (balances && balances.length) {
      points = balances.map(balance => ({
        name: balance.symbol,
        symbol: balance.symbol,
        communityId: balance.symbol,
        count: balance.balance,
        logo: balance.logo || '',
        decs: balance.decs,
        issuer: balance.issuer,
      }));

      if (points.length) {
        if (props.pointName) {
          selectedPoint = points.find(point => point.name === props.pointName);
        } else {
          selectedPoint = points.find(point => point.name === DEFAULT_TOKEN);
        }
      }
    }

    return {
      points,
      isLoading: isTransferLoading || isLoading,
      selectedPoint: selectedPoint || points?.[0],
      users: [],
    };
  },
  {
    transfer,
  }
)(SendPoints);

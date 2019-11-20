import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Panel } from '@commun/ui';

import { pointsArrayType } from 'types/common';
import { multiArgsMemoize } from 'utils/common';

import EmptyContentHolder, { NO_POINTS } from 'components/common/EmptyContentHolder';

import { PointsList, PointsGrid } from 'components/wallet';

import TabLoader from 'components/common/TabLoader';

const Wrapper = styled(Panel)`
  padding: 0;
  min-height: 100%;

  & div {
    padding: 0;
    background-color: none;
  }
`;

// TODO refactoring in progress
export default class MyPoints extends PureComponent {
  static propTypes = {
    points: pointsArrayType,
    screenType: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,

    getBalance: PropTypes.func.isRequired,
  };

  static defaultProps = {
    points: [],
    isLoading: false,
  };

  filterItems = multiArgsMemoize((items, filterText) => {
    if (filterText) {
      const filterTextLower = filterText.toLowerCase().trim();
      return items.filter(({ symbol }) => symbol.toLowerCase().startsWith(filterTextLower));
    }

    return items;
  });

  async componentDidMount() {
    const { getBalance } = this.props;

    try {
      await getBalance();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }

  // TODO implement
  itemClickHandler = symbol => {
    // eslint-disable-next-line no-console
    console.log(symbol);
  };

  renderPointsList = () => {
    const { points, screenType } = this.props;
    switch (screenType) {
      case 'tablet':
      case 'desktop':
        return <PointsGrid points={points} itemClickHandler={this.itemClickHandler} />;
      default:
        return <PointsList points={points} itemClickHandler={this.itemClickHandler} />;
    }
  };

  render() {
    const { points, isLoading } = this.props;

    if (!points.length && isLoading) {
      return <TabLoader />;
    }

    if (!points.length) {
      return <EmptyContentHolder type={NO_POINTS} />;
    }

    return <Wrapper title="My points">{this.renderPointsList()}</Wrapper>;
  }
}

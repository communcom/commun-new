import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Panel } from '@commun/ui';

import { POINT_CONVERT_TYPE, COMMUN_SYMBOL } from 'shared/constants';
import { pointsArrayType } from 'types/common';
import { multiArgsMemoize } from 'utils/common';

import EmptyContentHolder, { NO_POINTS } from 'components/common/EmptyContentHolder';

import { MobilePanel, PointsGrid } from 'components/wallet';
import UsersLayout from 'components/wallet/UsersLayout';

import TabLoader from 'components/common/TabLoader';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;

  padding: 0;
  min-height: 100%;
`;

const MobilePanelStyled = styled(MobilePanel)`
  margin-bottom: 20px;
`;

const SecondaryText = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const Content = styled.div`
  display: flex;

  margin-bottom: 32px;
`;

// TODO refactoring in progress
export default class MyPoints extends PureComponent {
  static propTypes = {
    points: pointsArrayType,
    isMobile: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool,

    getBalance: PropTypes.func.isRequired,
    openModalConvertPoint: PropTypes.func.isRequired,
    openModalSendPoint: PropTypes.func.isRequired,
    openModalSelectPoint: PropTypes.func.isRequired,
    openModalSelectRecipient: PropTypes.func.isRequired,
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

  openConvertModal = symbol => {
    const { openModalConvertPoint } = this.props;

    if (symbol === COMMUN_SYMBOL) {
      openModalConvertPoint({ convertType: POINT_CONVERT_TYPE.BUY });
    } else {
      openModalConvertPoint({ convertType: POINT_CONVERT_TYPE.SELL, symbol });
    }
  };

  pointItemClickHandler = symbol => {
    this.openConvertModal(symbol);
  };

  sendItemClickHandler = userId => {
    const { openModalSendPoint } = this.props;

    if (userId === 'add-friend') {
      // TODO implement
    } else {
      openModalSendPoint({ sendTo: userId });
    }
  };

  pointsSeeAllClickHnadler = async () => {
    const { points, openModalSelectPoint } = this.props;

    const result = await openModalSelectPoint({ points });

    if (result) {
      this.openConvertModal(result.selectedItem);
    }
  };

  usersSeeAllClickHnadler = async () => {
    const { openModalSelectRecipient } = this.props;
    const result = await openModalSelectRecipient();

    if (result) {
      this.sendItemClickHandler(result.selectedItem);
    }
  };

  renderPanels = () => {
    const { points, isMobile } = this.props;

    const pointsGrid = <PointsGrid points={points} itemClickHandler={this.pointItemClickHandler} />;

    if (isMobile) {
      return (
        <>
          <MobilePanelStyled title="My points" seeAllActionHndler={this.pointsSeeAllClickHnadler}>
            {pointsGrid}
          </MobilePanelStyled>
          <MobilePanelStyled title="Send points" seeAllActionHndler={this.usersSeeAllClickHnadler}>
            <UsersLayout itemClickHandler={this.sendItemClickHandler} />
          </MobilePanelStyled>
        </>
      );
    }

    return (
      <>
        <Panel
          title={
            <>
              My points: <SecondaryText>{points.length}</SecondaryText>
            </>
          }
        >
          {/* TODO Search */}
          Search
        </Panel>
        <Content>{pointsGrid}</Content>
      </>
    );
  };

  render() {
    const { points, isLoading } = this.props;

    if (!points.size && isLoading) {
      return <TabLoader />;
    }

    if (!points.size) {
      return <EmptyContentHolder type={NO_POINTS} />;
    }

    return <Wrapper>{this.renderPanels()}</Wrapper>;
  }
}

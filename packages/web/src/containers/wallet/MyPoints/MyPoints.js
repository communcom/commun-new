import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Panel, Search } from '@commun/ui';

import { multiArgsMemoize } from 'utils/common';
import { withTranslation } from 'shared/i18n';

import { MobilePanel, PointsGrid, EmptyPanel } from 'components/wallet';
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

const EmptyPanelStyled = styled(EmptyPanel)`
  margin-top: 10px;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 6px;
`;

@withTranslation()
export default class MyPoints extends PureComponent {
  static propTypes = {
    points: PropTypes.instanceOf(Map),
    selectedPoint: PropTypes.string,
    communPoint: PropTypes.shape({}).isRequired,
    friends: PropTypes.arrayOf(PropTypes.shape({})),
    loggedUserId: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool,

    getBalance: PropTypes.func.isRequired,
    openModalSendPoint: PropTypes.func.isRequired,
    openModalSelectPoint: PropTypes.func.isRequired,
    openModalSelectRecipient: PropTypes.func.isRequired,
    showPointInfo: PropTypes.func.isRequired,
    getUserSubscriptions: PropTypes.func.isRequired,
  };

  static defaultProps = {
    points: new Map(),
    selectedPoint: null,
    friends: [],
    isLoading: false,
  };

  state = {
    filterText: '',
  };

  filterItems = multiArgsMemoize((items, filterText) => {
    if (filterText) {
      const filterTextLower = filterText.toLowerCase().trim();
      return items.filter(({ name }) => name.toLowerCase().startsWith(filterTextLower));
    }

    return items;
  });

  async componentDidMount() {
    const { loggedUserId, getBalance, getUserSubscriptions } = this.props;

    try {
      await getBalance();
      await getUserSubscriptions({
        userId: loggedUserId,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }

  filterChangeHandler = text => {
    this.setState({
      filterText: text,
    });
  };

  onSelectionChange = symbol => {
    const { showPointInfo } = this.props;
    showPointInfo(symbol);
  };

  sendItemClickHandler = user => {
    const { openModalSendPoint } = this.props;

    if (user === 'add-friend') {
      // TODO implement
    } else {
      openModalSendPoint({ selectedUser: user });
    }
  };

  pointsSeeAllClickHnadler = async () => {
    const { points, openModalSelectPoint, showPointInfo } = this.props;

    const result = await openModalSelectPoint({ points });

    if (result) {
      showPointInfo(result.selectedItem);
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
    const { points, selectedPoint, communPoint, friends, isMobile, t } = this.props;
    const { filterText } = this.state;

    const pointsArray = Array.from(points.values());

    pointsArray.unshift(communPoint);

    const finalItems = filterText.trim()
      ? this.filterItems(pointsArray, filterText.trim())
      : pointsArray;

    const pointsGrid = finalItems.length ? (
      <PointsGrid
        points={finalItems}
        selectedPoint={selectedPoint}
        onSelectionChange={this.onSelectionChange}
      />
    ) : (
      <EmptyPanelStyled
        primary={t('components.wallet.my_points.no_found')}
        secondary={t('components.wallet.my_points.no_found_desc')}
      />
    );

    if (isMobile) {
      return (
        <>
          <MobilePanelStyled
            title={t('components.wallet.my_points.my_points')}
            seeAllActionHndler={this.pointsSeeAllClickHnadler}
          >
            {pointsGrid}
          </MobilePanelStyled>
          {friends.length ? (
            <MobilePanelStyled
              title={t('components.wallet.my_points.send_points')}
              seeAllActionHndler={this.usersSeeAllClickHnadler}
            >
              <UsersLayout items={friends} itemClickHandler={this.sendItemClickHandler} />
            </MobilePanelStyled>
          ) : null}
        </>
      );
    }

    return (
      <>
        <Panel
          title={
            <>
              {t('components.wallet.my_points.my_points')}:{' '}
              <SecondaryText>{points.size}</SecondaryText>
            </>
          }
        >
          <Search
            inverted
            label={t('components.wallet.my_points.search_points')}
            type="search"
            placeholder={t('common.search_placeholder')}
            value={filterText}
            onChange={this.filterChangeHandler}
          />
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

    return <Wrapper>{this.renderPanels()}</Wrapper>;
  }
}

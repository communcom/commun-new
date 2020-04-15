import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Panel, Search, InvisibleText } from '@commun/ui';
import { Icon } from '@commun/icons';

import { multiArgsMemoize } from 'utils/common';
import { withTranslation } from 'shared/i18n';

import { MobilePanel, PointsGrid, EmptyPanel } from 'components/wallet';
import UsersLayout from 'components/wallet/UsersLayout';
import TabLoader from 'components/common/TabLoader';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';

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

const DropDownMenuStyled = styled(DropDownMenu)`
  display: inline-flex;
  flex-shrink: 0;
  margin-left: auto;
`;

const DropDownMenuItemStyled = styled(DropDownMenuItem)`
  display: flex;
  align-items: center;
`;

const SettingsButton = styled.button.attrs({ type: 'button' })`
  padding: 0 10px;
  color: ${({ theme }) => theme.colors.gray};
`;

const SettingsIcon = styled(Icon).attrs({ name: 'settings' })`
  width: 20px;
  height: 20px;
`;

const MenuItemText = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.black};
`;

const CheckIcon = styled(Icon).attrs(({ isEnabled }) => ({
  name: `checkbox-${isEnabled ? 'on' : 'off'}`,
}))`
  margin-left: 10px;
  width: 24px;
  height: 24px;
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
    isHideEmptyBalances: PropTypes.bool,

    getBalance: PropTypes.func.isRequired,
    openModalSendPoint: PropTypes.func.isRequired,
    openModalSelectPoint: PropTypes.func.isRequired,
    openModalSelectRecipient: PropTypes.func.isRequired,
    showPointInfo: PropTypes.func.isRequired,
    getUserSubscriptions: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
  };

  static defaultProps = {
    points: new Map(),
    selectedPoint: null,
    friends: [],
    isLoading: false,
    isHideEmptyBalances: false,
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

  pointsSeeAllClickHandler = async () => {
    const { points, openModalSelectPoint, showPointInfo } = this.props;

    const result = await openModalSelectPoint({ points });

    if (result) {
      showPointInfo(result.selectedItem);
    }
  };

  usersSeeAllClickHandler = async () => {
    const { openModalSelectRecipient } = this.props;
    const result = await openModalSelectRecipient();

    if (result) {
      this.sendItemClickHandler(result.selectedItem);
    }
  };

  settingsChangeHandler = async () => {
    const { isHideEmptyBalances, updateSettings } = this.props;
    const options = {
      basic: {
        isHideEmptyBalances: !isHideEmptyBalances,
      },
    };

    try {
      await updateSettings(options);
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }
  };

  renderDropDownMenu() {
    const { isHideEmptyBalances, t } = this.props;

    return (
      <DropDownMenuStyled
        align="right"
        openAt="bottom"
        handler={props => (
          <SettingsButton {...props} name="wallet__settings">
            <SettingsIcon />
            <InvisibleText>{t('components.auth_block.settings')}</InvisibleText>
          </SettingsButton>
        )}
        items={() => (
          <DropDownMenuItemStyled
            name={isHideEmptyBalances ? 'wallet__hide-empty' : 'wallet__show-empty'}
            onClick={this.settingsChangeHandler}
          >
            <MenuItemText>{t('components.wallet.my_points.hide_empty')}</MenuItemText>
            <CheckIcon isEnabled={isHideEmptyBalances} />
          </DropDownMenuItemStyled>
        )}
      />
    );
  }

  renderPanels = () => {
    const {
      points,
      selectedPoint,
      communPoint,
      friends,
      isMobile,
      isHideEmptyBalances,
      t,
    } = this.props;
    const { filterText } = this.state;

    const pointsArray = Array.from(points.values());

    pointsArray.unshift(communPoint);

    const pointsArr = isHideEmptyBalances
      ? pointsArray.filter(item => parseFloat(item.balance))
      : pointsArray;

    const finalItems = filterText.trim()
      ? this.filterItems(pointsArr, filterText.trim())
      : pointsArr;

    const hiddenPoints = pointsArray.length - pointsArr.length;

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
            seeAllActionHndler={this.pointsSeeAllClickHandler}
          >
            {pointsGrid}
          </MobilePanelStyled>
          {friends.length ? (
            <MobilePanelStyled
              title={t('components.wallet.my_points.send_points')}
              seeAllActionHndler={this.usersSeeAllClickHandler}
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
              {t('components.wallet.my_points.my_points')}:&nbsp;
              <SecondaryText>{pointsArray.length}</SecondaryText>
              {isHideEmptyBalances && hiddenPoints ? (
                <SecondaryText>
                  ({t('components.wallet.my_points.hidden')}: {hiddenPoints})
                </SecondaryText>
              ) : null}
              {this.renderDropDownMenu()}
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

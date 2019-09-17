import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TabBar from 'components/TabBar';

export default class NavigationTabBar extends PureComponent {
  static propTypes = {
    tabs: PropTypes.objectOf(
      PropTypes.shape({
        tabName: PropTypes.string.isRequired,
        route: PropTypes.string.isRequired,
        index: PropTypes.bool,
        includeSubRoutes: PropTypes.bool,
      })
    ).isRequired,
    params: PropTypes.objectOf(PropTypes.string),
    isCommunity: PropTypes.bool,
    isOwner: PropTypes.bool,
  };

  static defaultProps = {
    params: {},
    isCommunity: false,
    isOwner: false,
  };

  formatTabs() {
    const { tabs, params } = this.props;

    return Object.keys(tabs).map(tabId => {
      const tabInfo = tabs[tabId];
      const tabParams = { ...params };

      if (!tabInfo.index) {
        tabParams.section = tabId;
      }

      return {
        text: tabInfo.tabName,
        route: tabInfo.route,
        params: tabParams,
        includeSubRoutes: tabInfo.includeSubRoutes,
        isOwnerRequired: tabInfo.isOwnerRequired,
      };
    });
  }

  render() {
    const { className, isCommunity, isOwner } = this.props;

    return (
      <TabBar
        className={className}
        items={this.formatTabs()}
        isCommunity={isCommunity}
        isOwner={isOwner}
      />
    );
  }
}

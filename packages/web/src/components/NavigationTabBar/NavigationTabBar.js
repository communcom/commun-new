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
    sectionField: PropTypes.string,
    params: PropTypes.objectOf(PropTypes.string),
    isCommunity: PropTypes.bool,
    isOwner: PropTypes.bool,
  };

  static defaultProps = {
    params: {},
    isCommunity: false,
    isOwner: false,
    sectionField: 'section',
  };

  formatTabs() {
    const { tabs, params, sectionField } = this.props;

    return Object.keys(tabs).map(tabId => {
      const tabInfo = tabs[tabId];
      const tabParams = { ...params };

      if (!tabInfo.index) {
        tabParams[sectionField] = tabId;
      }

      return {
        text: tabInfo.tabName,
        route: tabInfo.route,
        params: tabParams,
        includeSubRoutes: !tabInfo.index,
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

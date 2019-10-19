import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { tabInfoType } from 'types';
import TabBar from 'components/common/TabBar';

export default class NavigationTabBar extends PureComponent {
  static propTypes = {
    tabs: PropTypes.arrayOf(tabInfoType).isRequired,
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

    return tabs.map(tabInfo => {
      const tabParams = { ...params };

      if (!tabInfo.index) {
        tabParams[sectionField] = tabInfo.id;
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

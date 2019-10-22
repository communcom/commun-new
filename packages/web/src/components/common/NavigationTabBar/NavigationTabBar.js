import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { tabInfoType } from 'types';
import TabBar from 'components/common/TabBar';

export default class NavigationTabBar extends PureComponent {
  static propTypes = {
    tabs: PropTypes.arrayOf(tabInfoType).isRequired,
    sectionField: PropTypes.string,
    params: PropTypes.objectOf(PropTypes.string),
    stats: PropTypes.shape({}),
    isCommunity: PropTypes.bool,
    isOwner: PropTypes.bool,
  };

  static defaultProps = {
    params: {},
    stats: null,
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
        id: tabInfo.id,
        text: tabInfo.tabName,
        route: tabInfo.route,
        params: tabParams,
        includeSubRoutes: !tabInfo.index,
        isOwnerRequired: tabInfo.isOwnerRequired,
      };
    });
  }

  render() {
    const { className, isCommunity, isOwner, stats } = this.props;

    return (
      <TabBar
        items={this.formatTabs()}
        stats={stats}
        isCommunity={isCommunity}
        isOwner={isOwner}
        className={className}
      />
    );
  }
}

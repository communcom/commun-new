import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { selectFeatureFlags } from '@flopflip/react-redux';
import omit from 'ramda/src/omit';
import uniq from 'ramda/src/uniq';

import { multiArgsMemoize } from 'utils/common';
import { getDynamicComponentInitialProps } from 'utils/lazy';

function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Unknown';
}

const withTabs = (
  tabs,
  defaultTab,
  sectionField = 'section',
  subSectionField = 'subSection'
) => Comp =>
  class WithTabs extends Component {
    static displayName = `withTabs(${getDisplayName(Comp)})`;

    static findTab(query, featureFlags) {
      const tabId = query[sectionField] || defaultTab;
      const tabInfo = tabs.find(({ id }) => id === tabId);

      if (
        tabInfo &&
        tabInfo.featureName &&
        featureFlags &&
        featureFlags[tabInfo.featureName] === false
      ) {
        return null;
      }

      // find tab in subRoutes
      if (tabInfo && tabInfo.subRoutes && !tabInfo.Component) {
        const subTabId = query[subSectionField] || tabInfo.defaultTab || tabInfo.subRoutes[0].id;
        const subTabInfo = tabInfo.subRoutes.find(({ id }) => id === subTabId);

        if (
          subTabInfo &&
          subTabInfo.featureName &&
          featureFlags &&
          featureFlags[subTabInfo.featureName] === false
        ) {
          return null;
        }

        if (subTabInfo) {
          return subTabInfo;
        }
      }

      return tabInfo;
    }

    static async getInitialProps(params) {
      const featureFlags = selectFeatureFlags(params.store.getState());

      const tab = WithTabs.findTab(params.query, featureFlags);

      let props = null;

      if (Comp.getInitialProps) {
        props = await Comp.getInitialProps(params);
      }

      let tabProps = null;

      if (tab && (!props || !props.dontCallTabsInitialProps)) {
        tabProps = await getDynamicComponentInitialProps(tab.Component, {
          ...params,
          parentInitialProps: props,
        });
      }

      return {
        ...props,
        featureFlags,
        tabProps: omit('namespacesRequired', tabProps),
        namespacesRequired: uniq(
          (props?.namespacesRequired || []).concat((tabProps && tabProps.namespacesRequired) || [])
        ),
      };
    }

    static propTypes = {
      router: PropTypes.shape({
        query: PropTypes.shape({}).isRequired,
      }).isRequired,
      featureFlags: PropTypes.shape(),
    };

    static defaultProps = {
      featureFlags: {},
    };

    filterTabs = multiArgsMemoize(featureFlags =>
      tabs.filter(({ featureName }) => !featureName || featureFlags[featureName] !== false)
    );

    render() {
      const { router, featureFlags } = this.props;

      let tabsUpdated;

      if (featureFlags) {
        tabsUpdated = this.filterTabs(featureFlags);
      } else {
        tabsUpdated = tabs;
      }

      const tab = WithTabs.findTab(router.query, featureFlags);

      return <Comp {...this.props} tabs={tabsUpdated} tab={tab} />;
    }
  };

export default withTabs;

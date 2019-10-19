import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, omit } from 'ramda';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { getDynamicComponentInitialProps } from 'utils/lazy';
import { multiArgsMemoize } from 'utils/common';

function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Unknown';
}

export default (tabs, defaultTab, sectionField = 'section') => Comp =>
  class WithTabs extends Component {
    static displayName = `withTabs(${getDisplayName(Comp)})`;

    static findTab(query, featureFlags) {
      const tabId = query[sectionField] || defaultTab;

      const tabInfo = tabs.find(({ id }) => id === tabId);

      if (featureFlags && tabInfo.featureName && featureFlags[tabInfo.featureName] === false) {
        return null;
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

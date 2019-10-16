import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, omit, clone } from 'ramda';

import { getDynamicComponentInitialProps } from 'utils/lazy';

function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Unknown';
}

export default (tabs, defaultTab, sectionField = 'section') => Comp =>
  class WithTabs extends Component {
    static displayName = `withTabs(${getDisplayName(Comp)})`;

    static async getInitialProps(params) {
      const tab = tabs[params.query[sectionField] || defaultTab];

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

    render() {
      const { router, featureFlags } = this.props;
      const newTabs = clone(tabs);

      if (featureFlags) {
        for (const tabId of Object.keys(newTabs)) {
          const tabInfo = newTabs[tabId];

          if (tabInfo.featureName && featureFlags[tabInfo.featureName] === false) {
            delete newTabs[tabId];
          }
        }
      }

      const tab = newTabs[router.query[sectionField] || defaultTab];

      return <Comp {...this.props} tabs={newTabs} tab={tab} />;
    }
  };

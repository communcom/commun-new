import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, omit, clone } from 'ramda';

function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Unknown';
}

export async function getDynamicComponentInitialProps(DynamicComp, params) {
  let Comp = DynamicComp;

  if (Comp.preload) {
    Comp = (await Comp.preload()).default;
  }

  if (Comp.getInitialProps) {
    return Comp.getInitialProps(params);
  }

  return null;
}

export default (tabs, defaultTab) => Comp =>
  class WithTabs extends Component {
    static displayName = `withTabs(${getDisplayName(Comp)})`;

    static async getInitialProps(params) {
      const { query } = params;
      const tab = tabs[query.section || defaultTab];

      const [profileProps, tabProps] = await Promise.all([
        Comp.getInitialProps(params),
        tab ? getDynamicComponentInitialProps(tab.Component, params) : null,
      ]);

      return {
        ...profileProps,
        tabProps: omit('namespacesRequired', tabProps),
        namespacesRequired: uniq(
          (profileProps.namespacesRequired || []).concat(
            (tabProps && tabProps.namespacesRequired) || []
          )
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

      const tab = newTabs[router.query.section || defaultTab];

      return <Comp {...this.props} tabs={newTabs} tab={tab} />;
    }
  };

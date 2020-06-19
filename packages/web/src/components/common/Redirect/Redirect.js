import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { SplashLoader, up } from '@commun/ui';

import { Router } from 'shared/routes';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;

  ${up.mobileLandscape} {
    height: 70vh;
    border-radius: 10px;
    overflow: hidden;
  }

  ${is('isTab')`
    height: 280px;
    min-height: unset;
    margin-bottom: 8px;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors.white};
  `};
`;

export default class Redirect extends Component {
  static propTypes = {
    route: PropTypes.string.isRequired,
    params: PropTypes.objectOf(PropTypes.string),
    isTab: PropTypes.bool,
    hidden: PropTypes.bool,
  };

  static defaultProps = {
    params: {},
    isTab: false,
    hidden: false,
  };

  componentDidMount() {
    const { route, params } = this.props;
    Router.replaceRoute(route, params);
  }

  render() {
    const { isTab, hidden, className } = this.props;

    if (hidden) {
      return null;
    }

    return (
      <Wrapper isTab={isTab} className={className}>
        <SplashLoader isStatic noShadow />
      </Wrapper>
    );
  }
}

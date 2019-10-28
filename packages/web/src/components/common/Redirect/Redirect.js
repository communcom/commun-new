import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Loader } from '@commun/ui';
import { Router } from 'shared/routes';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  height: 100vh;

  ${is('isTab')`
    height: 280px;
    min-height: unset;
    margin-bottom: 8px;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    border-radius: 4px;
    background-color: #fff;
  `};
`;

const LoaderStyled = styled(Loader)`
  svg {
    width: 100px;
    height: 100px;
    color: ${({ theme }) => theme.colors.blue};
  }
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
        <LoaderStyled />
      </Wrapper>
    );
  }
}

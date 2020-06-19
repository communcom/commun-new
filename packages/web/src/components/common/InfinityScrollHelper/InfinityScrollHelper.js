import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import Router from 'next/router';
import { omit } from 'ramda';
import styled from 'styled-components';

const Wrapper = styled.div``;

export default class InfinityScrollHelper extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onNeedLoadMore: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  wrapperRef = createRef();

  checkLoadMore = throttle(async () => {
    const { disabled, onNeedLoadMore } = this.props;

    if (disabled || this.inRouting || !this.wrapperRef.current) {
      return;
    }

    const wrapper = this.wrapperRef.current;
    const { bottom } = wrapper.getBoundingClientRect();

    if (window.innerHeight * 1.5 > bottom) {
      await onNeedLoadMore();
      this.checkLoadMore();
    }
  }, 500);

  componentDidMount() {
    window.addEventListener('scroll', this.checkLoadMore);
    window.addEventListener('resize', this.checkLoadMore);

    Router.events.on('routeChangeStart', this.onRoutingStart);
    Router.events.on('routeChangeComplete', this.onRoutingEnd);
    Router.events.on('routeChangeError', this.onRoutingEnd);

    this.delayedCheck = setTimeout(() => {
      this.checkLoadMore();
    }, 0);
  }

  componentDidUpdate() {
    this.checkLoadMore();
  }

  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.onRoutingStart);
    Router.events.off('routeChangeComplete', this.onRoutingEnd);
    Router.events.off('routeChangeError', this.onRoutingEnd);

    clearTimeout(this.delayedCheck);
    this.checkLoadMore.cancel();

    window.removeEventListener('scroll', this.checkLoadMore);
    window.removeEventListener('resize', this.checkLoadMore);
  }

  onRoutingStart = () => {
    this.inRouting = true;
  };

  onRoutingEnd = () => {
    this.inRouting = false;
  };

  render() {
    return <Wrapper {...omit(['onNeedLoadMore', 'disabled'], this.props)} ref={this.wrapperRef} />;
  }
}

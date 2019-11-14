import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { omit } from 'ramda';
import throttle from 'lodash.throttle';

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

    if (disabled) {
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

    this.delayedCheck = setTimeout(() => {
      this.checkLoadMore();
    }, 0);
  }

  componentDidUpdate() {
    this.checkLoadMore();
  }

  componentWillUnmount() {
    clearTimeout(this.delayedCheck);
    this.checkLoadMore.cancel();

    window.removeEventListener('scroll', this.checkLoadMore);
    window.removeEventListener('resize', this.checkLoadMore);
  }

  render() {
    return <Wrapper {...omit(['onNeedLoadMore', 'disabled'], this.props)} ref={this.wrapperRef} />;
  }
}

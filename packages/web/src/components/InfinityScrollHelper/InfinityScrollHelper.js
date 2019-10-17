import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { omit } from 'ramda';
import throttle from 'lodash.throttle';

const Wrapper = styled.div``;

export default class InfinityScrollHelper extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    onNeedLoadMore: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  wrapperRef = createRef();

  checkLoadMore = throttle(() => {
    const { disabled, onNeedLoadMore } = this.props;

    if (disabled) {
      return;
    }

    const wrapper = this.wrapperRef.current;

    const { bottom } = wrapper.getBoundingClientRect();

    if (window.innerHeight * 1.5 > bottom) {
      onNeedLoadMore();
    }
  }, 500);

  componentDidMount() {
    window.addEventListener('scroll', this.checkLoadMore);
    window.addEventListener('resize', this.checkLoadMore);

    this.delayedCheck = setTimeout(() => {
      this.checkLoadMore();
    }, 0);
  }

  componentWillUnmount() {
    clearTimeout(this.delayedCheck);

    window.removeEventListener('scroll', this.checkLoadMore);
    window.removeEventListener('resize', this.checkLoadMore);
  }

  render() {
    return <Wrapper {...omit(['onNeedLoadMore', 'disabled'], this.props)} ref={this.wrapperRef} />;
  }
}

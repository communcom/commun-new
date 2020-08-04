import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import omit from 'ramda/src/omit';
import styled from 'styled-components';

const Wrapper = styled.div``;

export default class InfinityScrollWrapper extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onNeedLoadMore: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  wrapperRef = createRef();

  checkLoadMore = throttle(async () => {
    const { disabled } = this.props;

    if (disabled) {
      return;
    }

    const { onNeedLoadMore } = this.props;
    const wrapper = this.wrapperRef.current;

    const container = wrapper.firstChild;

    if (!container) {
      return;
    }

    if (container.scrollHeight - container.scrollTop - container.clientHeight < 200) {
      await onNeedLoadMore();
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
    const { children } = this.props;

    return (
      <Wrapper {...omit(['onNeedLoadMore', 'disabled'], this.props)} ref={this.wrapperRef}>
        {children({ onScroll: this.checkLoadMore })}
      </Wrapper>
    );
  }
}

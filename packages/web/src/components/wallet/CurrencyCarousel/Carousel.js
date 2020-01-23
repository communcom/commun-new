/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Item from './Item';

const Wrapper = styled.div`
  height: 50px;
  width: 268px;
  user-select: none;
`;

export default class Carousel extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    active: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    items: [],
  };

  state = {
    items: this.props.items,
    active: this.props.active,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.active !== prevState.active) {
      return { active: nextProps.active };
    }

    return null;
  }

  generateItems() {
    const { active, items } = this.state;

    const newItems = [];

    for (let i = active - 2; i < active + 3; i++) {
      let index = i;

      if (i < 0) {
        index = items.length + i;
      } else if (i >= items.length) {
        index = i % items.length;
      }

      newItems.push(
        <Item key={index} level={active - i}>
          {items[index]}
        </Item>
      );
    }

    return newItems;
  }

  render() {
    return <Wrapper>{this.generateItems()}</Wrapper>;
  }
}
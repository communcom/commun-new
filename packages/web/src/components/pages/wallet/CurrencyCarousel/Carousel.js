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
    active: PropTypes.number.isRequired,
  };

  static defaultProps = {
    items: [],
  };

  generateItems() {
    const { active, items } = this.props;
    const newItems = [];

    // if items less than 5 so we don't need to repeat them by loop
    if (items.length < 5) {
      for (let i = 0; i < items.length; i++) {
        let index = i;

        if (i < 0) {
          index = items.length + i;
        } else if (i >= items.length) {
          index = i % items.length;
        }

        newItems.push(
          <Item key={i} level={i - active}>
            {items[index]}
          </Item>
        );
      }

      return newItems;
    }

    // carousel's loop
    for (let i = active - 2; i < active + 3; i++) {
      let index = i;

      if (i < 0) {
        index = items.length + i;
      } else if (i >= items.length) {
        index = i % items.length;
      }

      newItems.push(
        <Item key={i} level={i - active}>
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

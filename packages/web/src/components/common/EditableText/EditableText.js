import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import PropTypes from 'prop-types';

import { up } from '@commun/ui';

const Text = styled.p`
  width: 100%;
  max-width: 100%;
  padding: 0 0 13px;
  line-height: 20px;
  font-size: 15px;
  overflow: hidden;

  ${up.tablet} {
    height: auto;
    max-height: none;
    padding: 12px 0 20px;

    ${is('compact')`
      display: none;
    `};
  }
`;

const MoreButton = styled.button.attrs({ type: 'button' })`
  display: inline-block;
  appearance: none;
  color: ${({ theme }) => theme.colors.contextBlue};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
  }
`;

export default class EditableText extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    isCompact: PropTypes.bool,
    isEditNow: PropTypes.bool,
    innerRef: PropTypes.shape({
      current: PropTypes.oneOfType([PropTypes.element, PropTypes.any]),
    }),
  };

  static defaultProps = {
    innerRef: null,
    isCompact: false,
    isEditNow: false,
  };

  state = {
    shortValue: '',
    isDescOpen: false,
  };

  componentDidUpdate() {
    const { value, innerRef, isCompact } = this.props;
    const { shortValue } = this.state;

    if (innerRef && innerRef.current) {
      const { current: element } = innerRef;
      element.innerText = value;
    }

    if (isCompact) {
      const newShortValue = this.clipLongText(value);
      if (shortValue !== newShortValue) {
        // eslint-disable-next-line
        this.setState({
          shortValue: newShortValue,
        });
      }
    }
  }

  clipLongText = text => {
    if (text.length > 75) {
      const shortDesc = text.substr(0, 75).trim();
      const spaceIndex = shortDesc.lastIndexOf(' ');
      return `${shortDesc.slice(0, spaceIndex)}\u2026\u2001`;
    }
    return text;
  };

  setPointerToEnd = el => {
    if (document.createRange) {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  focusHandler = () => {
    const { innerRef } = this.props;
    const { current } = innerRef;
    this.setPointerToEnd(current);
  };

  showMoreHandler = () => {
    this.setState(prevState => ({
      isDescOpen: !prevState.isDescOpen,
    }));
  };

  render() {
    const { isEditNow, isCompact, value, innerRef, className } = this.props;
    const { isDescOpen, shortValue } = this.state;

    return isCompact ? (
      <Text compact className={className}>
        {isDescOpen ? value : shortValue}
        <MoreButton onClick={this.showMoreHandler}>{isDescOpen ? 'Less' : 'More'}</MoreButton>
      </Text>
    ) : (
      <Text
        contentEditable={isEditNow}
        ref={innerRef}
        className={className}
        onFocus={this.focusHandler}
      />
    );
  }
}

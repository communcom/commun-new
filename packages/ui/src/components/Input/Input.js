/* eslint-disable no-nested-ternary */
import React, { PureComponent, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

const Label = styled.label`
  position: relative;
  display: inline-block;
  height: 60px;
  background: #fff;
  border: 2px solid
    ${({ isFocus, isError }) => (isError ? '#f695ad' : isFocus ? '#b4bffa' : 'transparent')};
  border-radius: 10px;
  cursor: text;

  ${is('isMultiline')`
    height: unset;
    min-height: 60px;
  `};

  &::after {
    position: absolute;
    content: '';
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 1px solid
      ${({ isError, isFocus, theme }) =>
        isError ? theme.colors.red : isFocus ? theme.colors.blue : theme.colors.gray};
    border-radius: 10px;
    pointer-events: none;
  }
`;

const InputTitle = styled.span`
  position: absolute;
  top: 18px;
  left: 15px;
  right: 15px;
  line-height: 18px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  pointer-events: none;
  transition: top 0.1s, font-size 0.1s;

  ${is('isMultiline')`
    top: 14px;
  `};

  ${is('isMini')`
    top: 5px;
    font-size: 12px;
  `};
`;

const InputElem = styled.input`
  display: block;
  width: 100%;
  height: 24px;
  padding: 0 15px;
  margin-top: 24px;
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
  background: transparent;

  &::placeholder {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const TextareaElem = styled(InputElem).attrs({ as: 'textarea' })`
  min-height: 84px;
  resize: none;

  ${is('allowResize')`
    resize: vertical;
  `};
`;

class Input extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    multiline: PropTypes.bool,
    allowResize: PropTypes.bool,
    validation: PropTypes.func,
    forwardedRef: PropTypes.shape({}),
  };

  static defaultProps = {
    title: undefined,
    placeholder: undefined,
    value: '',
    multiline: false,
    allowResize: false,
    validation: undefined,
    forwardedRef: undefined,
  };

  state = {
    isFocus: false,
  };

  onFocus = () => {
    this.setState({
      isFocus: true,
    });
  };

  onBlur = () => {
    this.setState({
      isFocus: false,
    });
  };

  render() {
    const {
      className,
      title,
      value,
      placeholder,
      validation,
      multiline,
      allowResize,
      forwardedRef,
      ...rest
    } = this.props;
    const { isFocus } = this.state;

    let isError = false;

    if (validation) {
      isError = validation(value);
    }

    let ControlElement;

    if (multiline) {
      ControlElement = TextareaElem;
    } else {
      ControlElement = InputElem;
    }

    return (
      <Label className={className} isFocus={isFocus} isError={isError} isMultiline={multiline}>
        <InputTitle isMini={isFocus || value || placeholder} isMultiline={multiline}>
          {title}
        </InputTitle>
        <ControlElement
          allowResize={allowResize}
          {...rest}
          value={value}
          placeholder={placeholder}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          ref={forwardedRef}
        />
      </Label>
    );
  }
}

/* eslint-disable-next-line react/no-multi-comp */
export default forwardRef((props, ref) => <Input {...props} forwardedRef={ref} />);

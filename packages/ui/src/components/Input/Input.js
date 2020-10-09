/* eslint-disable no-nested-ternary */
import React, { createRef, forwardRef, PureComponent } from 'react';
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';

const Label = styled.label`
  position: relative;
  display: inline-flex;
  height: 60px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  cursor: text;
  overflow: hidden;

  ${is('isMultiline')`
    height: unset;
    min-height: 60px;
  `};

  border: 1px solid
    ${({ isError, isFocus, theme }) =>
      isError ? theme.colors.red : isFocus ? theme.colors.blue : '#E2E6E8'};

  ${is('isDisabled')`
    background: ${({ theme }) => theme.colors.lightGrayBlue};
    border-color: ${({ theme }) => theme.colors.lightGrayBlue};
    cursor: not-allowed;
  `};
`;

const Content = styled.div`
  flex: 1;
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

  ${is('isDisabled')`
    cursor: not-allowed;
  `};
`;

const ControlRow = styled.div`
  display: flex;
  flex-direction: row;
  margin: 24px 15px 0;
`;

const Prefix = styled.span`
  margin-right: 5px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`;

const Postfix = styled.span`
  margin-right: 15px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const InputElem = styled.input`
  display: block;
  width: 100%;
  height: 24px;
  line-height: 24px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.black};
  background: transparent;

  ${is('hasIcon')`
    padding-right: 45px;
  `};

  ${is('readOnly')`
    text-overflow: ellipsis;
  `};

  &::placeholder {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const TextareaElem = styled(InputElem).attrs({ as: 'textarea' })`
  min-height: 84px;
  resize: none;

  ${is('allowResize')`
    resize: vertical;
  `};

  &:disabled {
    cursor: not-allowed;
  }
`;

const CopyButton = styled.button`
  position: absolute;
  top: 10px;
  right: 9px;
  padding: 6px;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.gray};

  &:hover,
  &:focus {
    background-color: #bbbdce;
  }
`;

const CopyIcon = styled(Icon).attrs({ name: 'copy' })`
  color: #fff;
`;

class Input extends PureComponent {
  static propTypes = {
    mask: PropTypes.string,
    maskChar: PropTypes.string,
    title: PropTypes.string,
    autocomplete: PropTypes.string,
    placeholder: PropTypes.string,
    prefix: PropTypes.string,
    postfix: PropTypes.string,
    value: PropTypes.string,
    isError: PropTypes.bool,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    allowCopy: PropTypes.bool,
    multiline: PropTypes.bool,
    allowResize: PropTypes.bool,
    validation: PropTypes.func,
    forwardedRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.object }),
    ]),
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onCopy: PropTypes.func,
  };

  static defaultProps = {
    mask: undefined,
    maskChar: null,
    title: undefined,
    autocomplete: undefined,
    placeholder: undefined,
    prefix: undefined,
    postfix: undefined,
    value: '',
    disabled: false,
    isError: false,
    readOnly: false,
    allowCopy: false,
    multiline: false,
    allowResize: false,
    validation: undefined,
    forwardedRef: undefined,
    onBlur: undefined,
    onChange: undefined,
    onCopy: undefined,
  };

  state = {
    isFocus: false,
  };

  // eslint-disable-next-line react/sort-comp
  innerRef = createRef();

  onFocus = () => {
    this.setState({
      isFocus: true,
    });
  };

  onBlur = e => {
    const { onBlur } = this.props;

    this.setState({
      isFocus: false,
    });

    if (onBlur) {
      onBlur(e);
    }
  };

  onCopyClick = () => {
    const { forwardedRef, onCopy } = this.props;
    const ref = forwardedRef || this.innerRef;

    const input = ref.current;

    input.focus();
    input.setSelectionRange(0, input.value.length);
    document.execCommand('copy');

    if (onCopy) {
      onCopy();
    }
  };

  renderElement() {
    const {
      mask,
      maskChar,
      value,
      placeholder,
      multiline,
      allowResize,
      forwardedRef,
      readOnly,
      allowCopy,
      disabled,
      onChange,
      ...rest
    } = this.props;

    if (mask) {
      return (
        <InputMask
          mask={mask}
          maskChar={maskChar}
          disabled={disabled}
          value={value}
          readOnly={readOnly}
          onChange={onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
          {inputProps => (
            <InputElem
              {...rest}
              {...inputProps}
              placeholder={placeholder}
              hasIcon={readOnly && allowCopy}
              ref={forwardedRef || this.innerRef}
            />
          )}
        </InputMask>
      );
    }

    let ControlElement;

    if (multiline) {
      ControlElement = TextareaElem;
    } else {
      ControlElement = InputElem;
    }

    return (
      <ControlElement
        allowResize={allowResize}
        {...rest}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        hasIcon={readOnly && allowCopy}
        ref={forwardedRef || this.innerRef}
      />
    );
  }

  render() {
    const {
      className,
      title,
      prefix,
      postfix,
      value,
      placeholder,
      isError,
      validation,
      multiline,
      readOnly,
      allowCopy,
      disabled,
    } = this.props;
    const { isFocus } = this.state;

    let validationError = false;

    if (validation) {
      validationError = validation(value);
    }

    return (
      <Label
        className={className}
        isDisabled={disabled}
        isFocus={isFocus}
        isError={isError || validationError}
        isMultiline={multiline}
      >
        <Content>
          <InputTitle
            isMini={isFocus || value || placeholder}
            isMultiline={multiline}
            isDisabled={disabled}
          >
            {title}
          </InputTitle>
          <ControlRow>
            {prefix ? <Prefix>{prefix}</Prefix> : null}
            {this.renderElement()}
            {readOnly && allowCopy ? (
              <CopyButton title="Copy to clipboard" onClick={this.onCopyClick}>
                <IconWrapper>
                  <CopyIcon />
                </IconWrapper>
              </CopyButton>
            ) : null}
          </ControlRow>
        </Content>
        {postfix ? <Postfix>{postfix}</Postfix> : null}
      </Label>
    );
  }
}

/* eslint-disable-next-line react/no-multi-comp */
export default forwardRef((props, ref) => <Input {...props} forwardedRef={ref} />);

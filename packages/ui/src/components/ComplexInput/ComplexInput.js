import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

import {
  ErrorText,
  Hint,
  HintContainer,
  HintPoint,
  IconContainer,
  IconText,
  IconWrapper,
  InnerWrapper,
  InputStyled,
  InputWrapper,
  Label,
  Wrapper,
} from './styled';

/**
 * Компонент текстового поля ввода.
 */
export default class ComplexInput extends Component {
  static propTypes = {
    /** Вид */
    view: PropTypes.oneOf(['default']),
    /**
     * Тип поля.
     * Внимание, тип 'number' не умеет работать с масками, в том числе с 'selectionStart' и 'selectionEnd'.
     * Подробнее: <a href="http://w3c.github.io/html/sec-forms.html#does-not-apply" target="_blank">http://w3c.github.io/html/sec-forms.html#does-not-apply</a>
     */
    type: PropTypes.oneOf([
      'number',
      'card',
      'email',
      'file',
      'hidden',
      'money',
      'password',
      'tel',
      'text',
    ]),
    /** Управление возможностью компонента занимать всю ширину родителя */
    width: PropTypes.oneOf(['default', 'available']),
    /** Управление автозаполнением компонента */
    autoComplete: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    /** Управление возможностью изменения атрибута компонента, установка соответствующего класса-модификатора для оформления */
    isDisabled: PropTypes.bool,
    /** Управление возможностью изменения атрибута компонента (без установки класса-модификатора для оформления) */
    disabledAttr: PropTypes.bool,
    /** Максимальное число символов */
    maxLength: PropTypes.number,
    /** Минимальное число символов */
    minLength: PropTypes.number,
    /** Уникальный идентификатор блока */
    id: PropTypes.string,
    /** Уникальное имя блока */
    name: PropTypes.string,
    /** Содержимое поля ввода */
    value: PropTypes.string,
    /** Содержимое поля ввода, указанное по умолчанию */
    defaultValue: PropTypes.string,
    /** Последовательность перехода между контролами при нажатии на Tab */
    tabIndex: PropTypes.number,
    /** Управление встроенной проверкой данных введённых пользователем в поле на корректность */
    formNoValidate: PropTypes.bool,
    /** Лейбл для поля */
    label: PropTypes.node,
    /** Подсказка в поле */
    placeholder: PropTypes.string,
    /** Подсказка под полем */
    hint: PropTypes.node,
    /** Обработчик вызванной подсказки */
    onHint: PropTypes.func,
    /** Отображение ошибки */
    error: PropTypes.node,
    /** Дополнительный класс */
    className: PropTypes.string,
    /** Тултип, который появляется при наведении  */
    title: PropTypes.string,
    /** Авто фокус */
    autoFocus: PropTypes.bool,
    /**
     * Обработчик нажатия клавиш
     * @param {string} value
     */
    onKeyDown: PropTypes.func,
    /**
     * Обработчик изменения значения 'value'
     * @param {React.KeyboardEvent} event
     */
    onChange: PropTypes.func,
    /**
     * Обработчик фокуса поля
     * @param {React.FocusEvent} event
     */
    onFocus: PropTypes.func,
    /**
     * Обработчик снятия фокуса с поля
     * @param {React.FocusEvent} event
     */
    onBlur: PropTypes.func,
  };

  static defaultProps = {
    view: 'default',
    type: 'text',
    width: 'default',
    autoComplete: undefined,
    isDisabled: undefined,
    disabledAttr: false,
    minLength: undefined,
    maxLength: undefined,
    id: undefined,
    name: undefined,
    value: undefined,
    defaultValue: undefined,
    tabIndex: undefined,
    formNoValidate: false,
    label: undefined,
    placeholder: undefined,
    hint: undefined,
    error: undefined,
    className: undefined,
    title: undefined,
    autoFocus: undefined,
    onHint: undefined,
    onKeyDown: undefined,
    onChange: undefined,
    onFocus: undefined,
    onBlur: undefined,
  };

  /**
   * Убирает фокус с поля ввода.
   *
   * @public
   */
  static blur() {
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    isFocused: Boolean(this.props.autoFocus),
    // eslint-disable-next-line react/destructuring-assignment
    value: this.props.defaultValue || '',
    showHint: false,
  };

  /**
   * @type {React.RefObject}
   */
  // eslint-disable-next-line react/sort-comp
  rootRef = createRef();

  /**
   * @type {React.RefObject}
   */
  inputWrapperRef = createRef();

  /**
   * @type {React.RefObject}
   */
  inputRef = createRef();

  getValue() {
    const { value } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    return value !== undefined ? value : this.state.value;
  }

  handleBlur = event => {
    const { onBlur } = this.props;

    this.setState({ isFocused: false });
    this.disableMouseWheel();

    if (onBlur) {
      onBlur(event);
    }
  };

  handleFocus = event => {
    const { onFocus } = this.props;

    this.setState({ isFocused: true });
    this.enableMouseWheel();

    if (onFocus) {
      onFocus(event);
    }
  };

  handleChange = event => {
    this.changeValue(event.target.value);
  };

  handleKeyDown = event => {
    const { onKeyDown } = this.props;

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  onHintHover = state => {
    const { onHint } = this.props;

    this.setState({ showHint: state });

    if (onHint) {
      onHint();
    }
  };

  /**
   * Разблокирует возможность скролла в поле ввода
   *
   * @public
   * @returns {void}
   */
  enableMouseWheel() {
    const input = this.control;

    if (input) {
      input.onwheel = () => true;
    }
  }

  /**
   * Блокирует возможность скролла в поле ввода
   *
   * @public
   * @returns {void}
   */
  disableMouseWheel() {
    const input = this.control;

    if (input) {
      input.onwheel = () => false;
    }
  }

  /**
   * Изменяет текущение значение поля ввода и генерирует событие об этом.
   *
   * @param {String} newValue Новое значение
   */
  changeValue(newValue) {
    const { value, onChange } = this.props;
    if (value === undefined) {
      this.setState({ value: newValue });
    }

    if (onChange) {
      onChange(newValue);
    }
  }

  renderContent() {
    const {
      type,
      formNoValidate,
      autoComplete,
      isDisabled,
      disabledAttr,
      minLength,
      maxLength,
      id,
      name,
      tabIndex,
      placeholder,
      title,
      hint,
      autoFocus,
    } = this.props;
    const { showHint } = this.state;
    const value = this.getValue();

    const inputProps = {
      type,
      formNoValidate,
      autoComplete: autoComplete === false ? 'off' : autoComplete,
      isDisabled: isDisabled || disabledAttr,
      minLength,
      maxLength,
      id,
      name,
      value,
      tabIndex,
      placeholder,
      ref: this.inputRef,
      title,
      autoFocus,
      hasHint: Boolean(hint),
      onKeyDown: this.handleKeyDown,
      onChange: this.handleChange,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
    };

    return (
      <InputWrapper ref={this.inputWrapperRef}>
        <InputStyled {...inputProps} />
        {hint && (
          <IconContainer>
            <IconWrapper
              onMouseEnter={() => this.onHintHover(true)}
              onMouseLeave={() => this.onHintHover(false)}
              onClick={() => this.onHintHover(!showHint)}
            >
              <IconText>!</IconText>
            </IconWrapper>
          </IconContainer>
        )}
      </InputWrapper>
    );
  }

  renderHint() {
    const { hint } = this.props;

    if (!hint) {
      return null;
    }

    if (typeof hint === 'string') {
      return <Hint>{hint}</Hint>;
    }

    return (
      <HintContainer>
        <HintPoint />
        {hint.map(text => (
          <Hint key={text}>{text}</Hint>
        ))}
      </HintContainer>
    );
  }

  render() {
    const { view, type, width, className, label, error } = this.props;
    const { showHint, isFocused } = this.state;

    const value = this.getValue();

    return (
      <Wrapper
        ref={this.rootRef}
        view={view}
        type={type}
        isFocused={isFocused}
        isError={error}
        width={width}
        className={className}
        hasLabel={Boolean(label)}
        hasValue={Boolean(value)}
      >
        <InnerWrapper>
          {Boolean(label) && <Label>{label}</Label>}
          {this.renderContent()}
          {showHint ? this.renderHint() : null}
          {error && <ErrorText>{error}</ErrorText>}
        </InnerWrapper>
      </Wrapper>
    );
  }
}

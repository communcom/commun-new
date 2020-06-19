import React, { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import by from 'styled-by';
import styled from 'styled-components';
import is from 'styled-is';

const Wrapper = styled.div`
  position: absolute;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 5px 22px rgba(0, 0, 0, 0.1);
  z-index: 5;

  ${by('openAt', {
    center: 'top: 50%',
    bottom: 'top: 100%',
    top: 'bottom: 0',
  })};

  ${by('align', {
    left: 'left: 0',
    right: 'right: 0',
  })};

  ${is('isDark')`
    box-shadow: 0 5px 22px rgba(0, 0, 0, 0.5);
  `};
`;

const Items = styled.ul`
  padding: 5px 0;
`;

export default class DropDownMenuWindow extends PureComponent {
  static propTypes = {
    openAt: PropTypes.oneOf(['top', 'bottom', 'center']).isRequired,
    align: PropTypes.oneOf(['left', 'right']).isRequired,
    items: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
    isDark: PropTypes.bool,

    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isDark: false,
  };

  wrapperRef = createRef();

  componentDidMount() {
    this.openingTimeout = setTimeout(() => {
      window.addEventListener('click', this.onAwayClick);
    }, 100);
  }

  componentWillUnmount() {
    clearTimeout(this.openingTimeout);
    window.removeEventListener('click', this.onAwayClick);
  }

  onAwayClick = e => {
    const { onClose } = this.props;

    if (!this.wrapperRef.current.contains(e.target)) {
      onClose();
    }
  };

  render() {
    const { openAt, align, items, isDark, onClose } = this.props;

    return (
      <Wrapper ref={this.wrapperRef} openAt={openAt} align={align} isDark={isDark}>
        <Items onClick={onClose}>{items}</Items>
      </Wrapper>
    );
  }
}

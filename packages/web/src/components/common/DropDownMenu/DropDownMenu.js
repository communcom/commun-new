import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DropDownMenuWindow from './DropDownMenuWindow';

const Wrapper = styled.div`
  position: relative;
  display: flex;
`;

export default class DropDownMenu extends PureComponent {
  static propTypes = {
    openAt: PropTypes.oneOf(['top', 'bottom', 'center']),
    align: PropTypes.oneOf(['left', 'right']),
    handler: PropTypes.func.isRequired,
    items: PropTypes.func.isRequired,
  };

  static defaultProps = {
    openAt: 'center',
    align: 'left',
  };

  state = {
    isOpen: false,
  };

  onHandlerClick = () => {
    this.setState({
      isOpen: true,
    });
  };

  onClose = () => {
    this.setState({
      isOpen: false,
    });
  };

  render() {
    const { openAt, align, handler, items, className } = this.props;
    const { isOpen } = this.state;

    return (
      <Wrapper className={className}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
        {handler({ isOpen, onClick: this.onHandlerClick })}
        {isOpen ? (
          <DropDownMenuWindow
            openAt={openAt}
            align={align}
            items={items()}
            onClose={this.onClose}
          />
        ) : null}
      </Wrapper>
    );
  }
}

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledSelect = styled.select`
  border: none;
  outline: none;
`;

/* Simple select component */
export default class Select extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    current: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    onItemSelect: PropTypes.func.isRequired,
  };

  handleChange = event => {
    const { name, onItemSelect } = this.props;
    const { value } = event.target;
    onItemSelect({
      name,
      value,
    });
  };

  render() {
    const { current, options, className } = this.props;

    return (
      <StyledSelect value={current} onChange={this.handleChange} className={className}>
        {Object.keys(options).map(key => (
          <option key={key} value={key}>
            {options[key]}
          </option>
        ))}
      </StyledSelect>
    );
  }
}

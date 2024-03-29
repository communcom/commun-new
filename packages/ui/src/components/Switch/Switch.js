import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { visuallyHidden } from 'styles/helpers';

const Wrapper = styled.label`
  display: inline-block;
  width: 40px;
  height: 24px;
  flex-shrink: 0;

  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 15px;
  transition: background-color 0.13s;
  background-color: ${({ theme }) => theme.colors.lightGray};
  cursor: pointer;

  ${is('checked')`
    border-color: ${({ theme }) => theme.colors.blue};
    background-color: ${({ theme }) => theme.colors.blue};
  `};
`;

const Toggler = styled.div`
  position: relative;
  width: 22px;
  height: 22px;
  top: 0;
  left: 0;

  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.white};

  transition: left 0.13s, background-color 0.13s;

  ${is('checked')`
    left: 16px;
    background-color: ${({ theme }) => theme.colors.white};
  `};
`;

const CheckboxHidden = styled.input.attrs({ type: 'checkbox' })`
  ${visuallyHidden};
`;

export default function Switch({ value, name, onChange, className }) {
  return (
    <Wrapper checked={value} className={className}>
      <Toggler checked={value} />
      <CheckboxHidden
        checked={Boolean(value)}
        name={name}
        onChange={e => onChange(e.target.checked)}
      />
    </Wrapper>
  );
}

Switch.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
};

Switch.defaultProps = {
  name: '',
};

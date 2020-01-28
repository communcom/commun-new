import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

const Wrapper = styled.span`
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
`;

const CheckBoxStyled = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  opacity: 0;
  appearance: none;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;

const IconStyled = styled(Icon)`
  display: block;
  width: 24px;
  height: 24px;
  pointer-events: none;
`;

export default function CheckBox({ checked, disabled, onChange }) {
  return (
    <Wrapper>
      <CheckBoxStyled
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e.target.checked, e)}
      />
      <IconStyled name={checked ? 'checkbox-on' : 'checkbox-off'} />
    </Wrapper>
  );
}

CheckBox.propTypes = {
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

CheckBox.defaultProps = {
  disabled: false,
};

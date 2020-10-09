import React, { forwardRef } from 'react';
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

function CheckBox({ checked, disabled, forwardedRef, onChange, ...props }) {
  return (
    <Wrapper>
      <CheckBoxStyled
        ref={forwardedRef}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e.target.checked, e)}
        {...props}
      />
      <IconStyled name={checked ? 'checkbox-on' : 'checkbox-off'} />
    </Wrapper>
  );
}

CheckBox.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  forwardedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.object }),
  ]),

  onChange: PropTypes.func,
};

CheckBox.defaultProps = {
  checked: false,
  disabled: false,
  forwardedRef: null,

  onChange: () => {},
};

export default forwardRef((props, ref) => <CheckBox forwardedRef={ref} {...props} />);

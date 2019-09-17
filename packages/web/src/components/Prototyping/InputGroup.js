import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Input } from './styles';

const Group = styled.div`
  display: flex;
  align-items: center;

  margin-right: 16px;
  height: 48px;

  font-size: 15px;
`;

const Label = styled.div`
  margin-right: 10px;
`;

const InputGroup = ({ label, ...rest }) => (
  <Group>
    <Label>{label}</Label>
    <Input {...rest} />
  </Group>
);

InputGroup.propTypes = {
  label: PropTypes.string.isRequired,
};

export default InputGroup;

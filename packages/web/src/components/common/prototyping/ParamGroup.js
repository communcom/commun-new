import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Param = styled.section`
  display: flex;
  flex-direction: column;

  margin: 10px 0;
`;

const Title = styled.h4`
  margin-bottom: 4px;

  font-size: 15px;
  font-weight: bold;
`;

const ParamGroup = ({ title, children }) => (
  <Param>
    <Title>{title}</Title>
    {children}
  </Param>
);

ParamGroup.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ParamGroup;

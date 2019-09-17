import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  background-color: #fff;
`;

const Title = styled.h3`
  padding: 16px 20px;

  font-weight: bold;
  font-size: 22px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 16px 10px;
`;

export default function Panel({ title, children }) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Content>{children}</Content>
    </Wrapper>
  );
}

Panel.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

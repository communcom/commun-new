import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '../../utils/mediaQuery';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  /* TODO */
  /* background-color: #fff; */

  border-radius: 6px;
`;

const Title = styled.h3`
  padding: 15px;

  font-weight: bold;
  font-size: 15px;
  text-align: center;

  ${up.tablet} {
    font-size: 18px;
    text-align: left;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 10px 10px;
`;

export default function Panel({ className, title, children }) {
  return (
    <Wrapper className={className}>
      <Title>{title}</Title>
      <Content>{children}</Content>
    </Wrapper>
  );
}

Panel.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

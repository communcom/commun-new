import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '../../utils/mediaQuery';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  border-radius: 6px;
`;

const Header = styled.div`
  display: flex;
`;

const Title = styled.h3`
  padding: 15px 20px;

  font-size: 17px;
  font-weight: 600;

  ${up.tablet} {
    padding: 15px;

    font-size: 18px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;

  padding: 20px 15px;

  ${up.tablet} {
    padding: 0 15px 15px;
  }
`;

export default function Panel({ className, title, children }) {
  return (
    <Wrapper className={className}>
      <Header>
        <Title>{title}</Title>
      </Header>
      <Content>{children}</Content>
    </Wrapper>
  );
}

Panel.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  children: PropTypes.node,
};

Panel.defaultProps = {
  children: null,
};

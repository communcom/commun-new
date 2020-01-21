import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  height: 60px;
  padding: 0 15px;
  background-color: #fff;
`;

const Title = styled.span`
  margin-bottom: 2px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const Body = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: #000;
`;

const Left = styled.div``;
const Right = styled.div``;

export default function InfoField({ title, left, right }) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Body>
        {left ? <Left>{left}</Left> : null}
        {right ? <Right>{right}</Right> : null}
      </Body>
    </Wrapper>
  );
}

InfoField.propTypes = {
  title: PropTypes.string.isRequired,
  left: PropTypes.string,
  right: PropTypes.string,
};

InfoField.defaultProps = {
  left: null,
  right: null,
};

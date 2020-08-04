import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 15px;
  margin-top: 2px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 0 0 10px 10px;
`;

const FooterText = styled.div`
  flex-grow: 1;
  cursor: default;
`;

const FooterTitle = styled.div`
  margin-bottom: 2px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const FooterVoted = styled.div`
  font-size: 14px;
  line-height: 19px;
  font-weight: 600;
`;

const FooterButtons = styled.div`
  display: flex;
  flex-shrink: 0;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

export default function CardFooterDecision({ title, text, actions }) {
  return (
    <Wrapper>
      <FooterText>
        <FooterTitle>{title}</FooterTitle>
        <FooterVoted>{text}</FooterVoted>
      </FooterText>
      <FooterButtons>{actions()}</FooterButtons>
    </Wrapper>
  );
}

CardFooterDecision.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  actions: PropTypes.func.isRequired,
};

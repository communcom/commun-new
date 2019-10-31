import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from '@commun/ui';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 15px;
`;

const FooterText = styled.div`
  flex-grow: 1;
`;

const FooterTitle = styled.div`
  margin-bottom: 2px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const FooterVoted = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const FooterButtons = styled.div`
  flex-shrink: 0;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

export default function CardFooterDecision({ title, text, onAcceptClick, onRejectClick }) {
  return (
    <Wrapper>
      <FooterText>
        <FooterTitle>{title}</FooterTitle>
        <FooterVoted>{text}</FooterVoted>
      </FooterText>
      <FooterButtons>
        <Button onClick={onAcceptClick}>Accept</Button>
        <Button onClick={onRejectClick}>Reject</Button>
      </FooterButtons>
    </Wrapper>
  );
}

CardFooterDecision.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onAcceptClick: PropTypes.func.isRequired,
  onRejectClick: PropTypes.func.isRequired,
};

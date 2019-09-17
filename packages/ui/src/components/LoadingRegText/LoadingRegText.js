import React from 'react';
import styled, { keyframes } from 'styled-components';

// TODO add loader correspond to design

const blink = keyframes`
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
`;

const Wrapper = styled.div``;

const Span1 = styled.span`
  margin-left: 3px;
  animation: ${blink} 1.4s infinite both;
`;

const Span2 = styled(Span1)`
  animation-delay: 0.2s;
`;

const Span3 = styled(Span1)`
  animation-delay: 0.4s;
`;

export default function LoadingRegText() {
  return (
    <Wrapper>
      loading
      <Span1>.</Span1>
      <Span2>.</Span2>
      <Span3>.</Span3>
    </Wrapper>
  );
}

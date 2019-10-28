import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  ${up.desktop} {
    padding: 84px;
  }
`;

const EmojiWrapper = styled.span.attrs({ role: 'img', ariaLabel: 'Crying Cat' })`
  margin-bottom: 10px;
  font-size: 32px;
  line-height: 38px;
`;

const Header = styled.h2`
  margin-bottom: 10px;
  font-weight: normal;
  font-size: 21px;
  line-height: 25px;
  text-align: center;
  text-transform: capitalize;
`;

const SubText = styled.p`
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
`;

export default function EmptyList({ headerText, subText, children }) {
  return (
    <Wrapper>
      {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
      <EmojiWrapper>😿</EmojiWrapper>
      <Header>{headerText}</Header>
      {subText ? <SubText>{subText}</SubText> : null}
      {children}
    </Wrapper>
  );
}

EmptyList.propTypes = {
  headerText: PropTypes.string.isRequired,
  subText: PropTypes.string,
};

EmptyList.defaultProps = {
  subText: undefined,
};

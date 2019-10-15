import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 90%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmojiWrapper = styled.span.attrs({ role: 'img', ariaLabel: 'Crying Cat' })`
  font-size: 32px;
  line-height: 38px;
`;

const Header = styled.header`
  margin-top: 10px;
  font-size: 21px;
  line-height: 25px;

  text-align: center;
  color: #000000;
`;

const SubText = styled.span`
  margin-top: 10px;
  font-size: 14px;
  line-height: 20px;

  text-align: center;
  color: #a5a7bd;
`;

export default function EmptyList(props) {
  const { headerText, subText, children } = props;

  return (
    <Wrapper>
      <EmojiWrapper>😿</EmojiWrapper>
      <Header>{headerText}</Header>
      <SubText>{subText}</SubText>
      {children}
    </Wrapper>
  );
}

EmptyList.propTypes = {
  headerText: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
};

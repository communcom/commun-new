import React from 'react';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 15px;
  background: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 10px;
`;

const Circle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background: #ffffff;
`;

const ChangeHeroIcon = styled(Icon).attrs({ name: 'changehero', width: 32, height: 27 })``;

const Info = styled.div`
  flex: 1;
  margin-left: 10px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const Text = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: #000000;
  margin-top: 2px;
`;

const Question = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gray};
`;

const QuestionIcon = styled(Icon).attrs({ name: 'question', width: 10, height: 16 })`
  color: #ffffff;
`;

export default function ChangeHeroBlock() {
  return (
    <Wrapper>
      <Circle>
        <ChangeHeroIcon />
      </Circle>
      <Info>
        <Title>The purchase is made by</Title>
        <Text>Change Hero</Text>
      </Info>
      <Question>
        <QuestionIcon />
      </Question>
    </Wrapper>
  );
}

ChangeHeroBlock.propTypes = {};

import styled from 'styled-components';
import is from 'styled-is';

import { Card, CloseButton, up } from '@commun/ui';

export const Wrapper = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 502px;
  padding: 0 20px 20px;
  height: 100vh;
  background-color: #fff;
  overflow: hidden;

  ${up.mobileLandscape} {
    border-radius: 20px;
    box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.05);
  }

  ${up.tablet} {
    height: 603px;
  }

  ${is('withActions')`
    padding-bottom: 90px;
  `};
`;

export const Header = styled.header`
  padding: 20px 0;
`;

export const Items = styled.ul`
  display: block;
  max-height: 320px;
  overflow: auto;
  overflow-x: hidden;
`;

export const StepInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;

  & > :not(:last-child) {
    margin-bottom: 5px;
  }
`;

export const StepName = styled.h2`
  font-size: 24px;
  line-height: 33px;
`;

export const StepDesc = styled.p`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const Actions = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 90px;
  padding: 20px 20px;
  box-shadow: 0px -10px 36px rgba(174, 181, 206, 0.21);
  border-radius: 20px;
`;

export const BackButton = styled(CloseButton).attrs({ isBack: true })``;

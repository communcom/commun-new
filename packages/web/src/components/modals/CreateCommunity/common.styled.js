import styled from 'styled-components';
import is from 'styled-is';

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-basis: 400px;
  padding: 25px 25px 15px;
  background-color: #fff;
  box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.05);
  border-radius: 15px;
`;

export const Title = styled.h1`
  font-weight: 700;
  font-size: 32px;
  line-height: 44px;
  color: #000;
`;

export const Subtitle = styled.p`
  padding: 10px 0;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: #000;
`;

export const Text = styled.p`
  text-align: center;
  font-size: 16px;
  line-height: 18px;
  color: #000;

  .blue {
    color: ${({ theme }) => theme.colors.blue};
  }

  .bold {
    font-weight: 700;
  }

  .semibold {
    font-weight: 600;
  }
`;

export const SubText = styled.span`
  font-weight: 600px;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > :not(:last-child) {
    margin-bottom: 10px;
  }
`;

export const BigButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 288px;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.blue};
  color: #fff;
  border-radius: 100px;
  font-weight: 700;
  font-size: 16px;
  line-height: 1;
  appearance: none;

  ${is('isTransparent')`
    color: ${({ theme }) => theme.colors.blue};
    background-color: transparent;
  `};
`;

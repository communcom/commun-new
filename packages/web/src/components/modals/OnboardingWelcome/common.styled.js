import styled from 'styled-components';
import { Button } from '@commun/ui';

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const CarouselBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const Banner = styled.img`
  max-width: 50%;
  height: auto;

  @media (min-height: 569px) {
    max-width: 100%;
  }
`;

export const Title = styled.h2`
  font-weight: 500;
  font-size: 27px;
  line-height: 20px;
  color: #000;
  text-align: center;
  margin: 20px 0 10px;

  .strong {
    font-weight: bold;
  }

  .blue {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.blue};
  }

  @media (min-height: 540px) {
    line-height: 33px;
    margin: 33px 0 15px;
  }
`;

export const Description = styled.p`
  margin-bottom: 10px;
  max-width: 300px;
  font-weight: 600;
  font-size: 16px;
  line-height: 26px;
  text-align: center;
  color: #626371;

  .blue {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.blue};
  }
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > :not(:last-child) {
    margin-bottom: 10px;
  }
`;

export const ButtonStyled = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  font-weight: bold;
  font-size: 14px;

  @media (min-height: 540px) {
    max-width: 300px;
  }
`;

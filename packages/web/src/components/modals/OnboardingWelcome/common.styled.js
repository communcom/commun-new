import styled from 'styled-components';
import { Button, up } from '@commun/ui';

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

  ${up.desktop} {
    justify-content: flex-end;
  }
`;

export const Banner = styled.img`
  max-width: 50%;
  height: auto;

  @media (min-height: 569px) {
    max-width: 100%;
  }
`;

export const Title = styled.h2`
  font-size: 27px;
  line-height: 20px;
  color: #000;
  text-align: center;
  margin: 20px 0 10px;

  @media (min-height: 540px) {
    line-height: 33px;
    margin: 33px 0 15px;
  }
`;

export const Strong = styled.span`
  font-weight: bold;
`;

export const Blue = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.blue};
`;

export const Description = styled.p`
  font-size: 16px;
  line-height: 26px;
  color: ${({ theme }) => theme.colors.gray};
  text-align: center;
  margin-bottom: 10px;

  @media (min-height: 569px) {
    margin-bottom: 57px;
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
  width: 100%;
  height: 50px;
  font-weight: bold;
  font-size: 15px;

  @media (min-height: 540px) {
    max-width: 300px;
  }
`;

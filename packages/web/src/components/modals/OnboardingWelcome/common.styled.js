import styled from 'styled-components';
import { Button, up } from '@commun/ui';

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

export const Banner = styled.img``;

export const Title = styled.div`
  font-size: 27px;
  line-height: 33px;
  color: #000;
  text-align: center;
  margin: 33px 0 15px;
`;

export const Strong = styled.span`
  font-weight: bold;
`;

export const Blue = styled.span`
  font-weight: bold;
  color: #6a80f5;
`;

export const Description = styled.div`
  font-size: 16px;
  line-height: 26px;
  color: #a5a7bd;
  text-align: center;
  margin-bottom: 57px;
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
  width: 300px;
  height: 50px;
`;

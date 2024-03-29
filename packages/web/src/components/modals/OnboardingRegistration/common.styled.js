import styled from 'styled-components';

import { Button, up } from '@commun/ui';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 10px 30px;

  @media (min-width: 400px) {
    margin: 0 25px 30px;
  }
`;

export const CarouselBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;

  ${up.desktop} {
    justify-content: flex-start;
  }
`;

export const Banner = styled.img``;

export const Title = styled.div`
  font-size: 27px;
  line-height: 33px;
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
  margin: 20px 0 15px;

  .blue {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.blue};
  }
`;

export const Description = styled.div`
  font-size: 16px;
  line-height: 26px;
  color: ${({ theme }) => theme.colors.gray};
  text-align: center;
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

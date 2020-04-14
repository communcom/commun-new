import styled from 'styled-components';

import { styles } from '@commun/ui';

export const Wrapper = styled.div`
  display: block;
  border-radius: 10px;
  overflow: hidden;
`;

export const Image = styled.img`
  display: block;
  width: 100%;
  border-radius: 10px 10px 0 0;
`;

export const ImageStub = styled(Image)`
  height: 140px;
  background: aqua;
`;

export const Footer = styled.div`
  display: block;
  padding: 12px 15px 13px;
  border-radius: 0 0 10px 10px;
  background: ${({ theme }) => theme.colors.lightGrayBlue};
`;

export const Title = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.black};

  ${styles.breakWord};
`;

export const Url = styled.div`
  margin-top: 5px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};

  ${styles.breakWord};
`;

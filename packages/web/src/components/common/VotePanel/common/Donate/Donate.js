import React from 'react';
import styled from 'styled-components';

import { up } from '@commun/ui';
import { useTranslation } from 'shared/i18n';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 5px;
  font-weight: 600;
  font-size: 17px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.blue};

  ${up.tablet} {
    margin: 0 2px 0 10px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 2px;
  font-size: 12px;
  line-height: 12px;
`;

const Count = styled.div`
  font-weight: bold;
  font-size: 14px;
  line-height: 12px;
`;

const Points = styled.div`
  display: none;
  text-transform: lowercase;

  ${up.tablet} {
    display: block;
  }
`;

function Donate() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      +{' '}
      <Content>
        <Count>100K</Count> <Points>{t('common.point', { count: 100 })}</Points>
      </Content>
    </Wrapper>
  );
}

export default Donate;

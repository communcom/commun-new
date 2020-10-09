import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@commun/ui';

import { useTranslation } from 'shared/i18n';

import RulesList from 'containers/community/Rules';
import { Buttons, Content, StepDesc, StepInfo, StepName, Wrapper } from '../common.styled';

export default function Rules({ prev, next }) {
  const { t } = useTranslation();

  const handleNextClick = async () => {
    next();
  };

  return (
    <Wrapper>
      <Content>
        <StepInfo>
          <StepName>{t('modals.create_community_data.rules.title')}</StepName>
          <StepDesc>{t('modals.create_community_data.rules.description')}</StepDesc>
        </StepInfo>
      </Content>
      <RulesList isCommunityCreation />
      <Buttons>
        <Button hollow transparent gray medium onClick={prev}>
          {t('common.back')}
        </Button>
        <Button primary medium onClick={handleNextClick}>
          {t('common.next')}
        </Button>
      </Buttons>
    </Wrapper>
  );
}

Rules.propTypes = {
  prev: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
};

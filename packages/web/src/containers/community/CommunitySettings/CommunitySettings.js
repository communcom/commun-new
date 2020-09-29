import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { Card, up } from '@commun/ui';

import { withTranslation } from 'shared/i18n';

const CardWrapper = styled(Card)`
  padding: 15px 15px;

  ${up.desktop} {
    padding-top: 20px;
  }
`;

const Content = styled.div`
  font-size: 15px;
  line-height: 22px;
  margin-bottom: 5px;
  white-space: pre-wrap;
`;

@withTranslation()
export default class CommunitySettings extends PureComponent {
  render() {
    const { t } = this.props;

    return (
      <CardWrapper>
        <Content>{t('components.createCommunity.default_settings')}</Content>
      </CardWrapper>
    );
  }
}

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectFeatureToggles } from '@flopflip/react-redux';
import styled from 'styled-components';

import { Card, up } from '@commun/ui';

import { FEATURE_COMMUNITY_SETTINGS_GENERAL } from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';

import General from './General';

const Wrapper = styled(Card)`
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

@injectFeatureToggles([FEATURE_COMMUNITY_SETTINGS_GENERAL])
@withTranslation()
export default class CommunitySettings extends PureComponent {
  static propTypes = {
    featureToggles: PropTypes.object.isRequired,
  };

  render() {
    const { t, featureToggles } = this.props;

    if (featureToggles[FEATURE_COMMUNITY_SETTINGS_GENERAL]) {
      return <General {...this.props} />;
    }

    return (
      <Wrapper>
        <Content>{t('components.createCommunity.default_settings')}</Content>
      </Wrapper>
    );
  }
}

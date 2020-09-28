import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectFeatureToggles } from '@flopflip/react-redux';
import { withRouter } from 'next/router';
import styled from 'styled-components';

import { Card, up } from '@commun/ui';

import { FEATURE_COMMUNITY_SETTINGS_GENERAL } from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';

import Rules from 'containers/community/Rules';
import General from './General';

// TODO fix width
const Wrapper = styled.div`
  max-width: 500px;
`;

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

// refactoing in progress
@withRouter
@injectFeatureToggles([FEATURE_COMMUNITY_SETTINGS_GENERAL])
@withTranslation()
export default class CommunitySettings extends PureComponent {
  static propTypes = {
    featureToggles: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  render() {
    const { t, featureToggles, router } = this.props;
    if (featureToggles[FEATURE_COMMUNITY_SETTINGS_GENERAL]) {
      return router.query.subSection === 'general' ? (
        <General {...this.props} />
      ) : (
        <Wrapper>
          <Rules {...this.props} />
        </Wrapper>
      );
    }

    return (
      <CardWrapper>
        <Content>{t('components.createCommunity.default_settings')}</Content>
      </CardWrapper>
    );
  }
}

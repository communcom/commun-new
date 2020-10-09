import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectFeatureToggles } from '@flopflip/react-redux';
import styled from 'styled-components';

import { Card, up } from '@commun/ui';

import { FEATURE_COMMUNITY_TOPICS } from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

import ChooseLanguage from 'components/common/ChooseLanguage';
import Linkify from 'components/common/Linkify';

const Wrapper = styled(Card)`
  position: relative;
  margin: 10px;

  ${up.tablet} {
    margin: 0;
  }

  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 22px 15px;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
`;

const Panel = styled.div`
  padding: 20px 15px 30px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const PanelTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const Description = styled.div`
  font-size: 14px;
`;

const ChooseLanguageStyled = styled(ChooseLanguage)`
  padding: 0;
`;

const TopicsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  font-size: 14px;
`;

const Topics = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  list-style: none;
`;

const Topic = styled.li`
  margin-bottom: 10px;
  padding: 10px 15px;

  color: ${({ theme }) => theme.colors.blue};
  text-transform: capitalize;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 40px;

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

@injectFeatureToggles([FEATURE_COMMUNITY_TOPICS])
@withTranslation()
export default class General extends PureComponent {
  static propTypes = {
    description: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,

    featureToggles: PropTypes.object.isRequired,
  };

  static defaultProps = {};

  renderTopics() {
    const { subject, t } = this.props;

    if (!subject) {
      return <>{t('components.community.about.empty_topics')}</>;
    }

    try {
      const topics = JSON.parse(subject);

      return (
        <Topics>
          {topics.map(topic => (
            <Topic key={topic}>
              <Link to={`/search?q=${window.encodeURIComponent(topic)}`} passHref>
                <a>#{topic}</a>
              </Link>
            </Topic>
          ))}
        </Topics>
      );
    } catch (err) {
      // nop
    }

    return null;
  }

  render() {
    const { description, language, t, featureToggles } = this.props;

    return (
      <Wrapper>
        <CardTitle>{t('components.community.about.title')}</CardTitle>
        <Panel>
          <PanelHeader>
            <PanelTitle>{t('components.community.about.panels.description')}</PanelTitle>
          </PanelHeader>
          <Description>
            {!description ? (
              t('components.community.about.empty_decsription')
            ) : (
              <Linkify>{description}</Linkify>
            )}
          </Description>
        </Panel>
        <Panel>
          <PanelHeader>
            <PanelTitle>{t('components.community.about.panels.language')}</PanelTitle>
          </PanelHeader>
          <ChooseLanguageStyled language={language} readOnly />
        </Panel>
        {featureToggles[FEATURE_COMMUNITY_TOPICS] && (
          <Panel>
            <PanelHeader>
              <PanelTitle>{t('components.community.about.panels.topics')}</PanelTitle>
            </PanelHeader>
            <TopicsWrapper>{this.renderTopics()}</TopicsWrapper>
          </Panel>
        )}
      </Wrapper>
    );
  }
}

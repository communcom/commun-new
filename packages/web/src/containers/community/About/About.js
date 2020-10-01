import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Card, up } from '@commun/ui';

import { withTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

import ChooseLanguage from 'containers/createCommunity/CreateDescription/ChooseLanguage';
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

const EditButton = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue};

  cursor: pointer;
`;

const EditMobileButton = styled(Icon).attrs({ name: 'chevron' })`
  width: 20px;
  height: 20px;
  transform: rotate(-90deg);
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
  font-size: 14px;
  text-transform: capitalize;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 40px;

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

@withTranslation()
export default class General extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    communityAlias: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    isLeader: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,

    openDescriptionEditModal: PropTypes.func.isRequired,
    openCommunityLanguageEditModal: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  renderEditButton = (onClick, text) => {
    const { isMobile, isLeader, t } = this.props;

    if (!isLeader) {
      return null;
    }

    if (isMobile) {
      return <EditMobileButton onClick={onClick} />;
    }

    return (
      <EditButton onClick={onClick}>
        {text || t('components.community.about.buttons.edit')}
      </EditButton>
    );
  };

  onEditDescriptionClick = () => {
    const { description, communityId, openDescriptionEditModal } = this.props;
    openDescriptionEditModal({ communityId, description });
  };

  onEditLanguageClick = () => {
    const { communityId, openCommunityLanguageEditModal } = this.props;

    openCommunityLanguageEditModal({ communityId });
  };

  renderEditTopicsButton = () => {
    const { communityAlias, t } = this.props;

    return (
      <Link to={`/leaderboard/${communityAlias}/settings/general`} passHref>
        <a>{t('components.community.about.buttons.edit')}</a>
      </Link>
    );
  };

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
    const { description, language, t } = this.props;

    return (
      <Wrapper>
        <CardTitle>{t('components.community.about.title')}</CardTitle>
        <Panel>
          <PanelHeader>
            <PanelTitle>{t('components.community.about.panels.description')}</PanelTitle>
            {this.renderEditButton(this.onEditDescriptionClick)}
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
            {this.renderEditButton(this.onEditLanguageClick)}
          </PanelHeader>
          <ChooseLanguageStyled language={language} readOnly />
        </Panel>
        <Panel>
          <PanelHeader>
            <PanelTitle>{t('components.community.about.panels.topics')}</PanelTitle>
            {this.renderEditTopicsButton()}
          </PanelHeader>
          <TopicsWrapper>{this.renderTopics()}</TopicsWrapper>
        </Panel>
      </Wrapper>
    );
  }
}

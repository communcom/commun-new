import React, { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNot } from 'styled-is';

import { Icon } from '@commun/icons';
import { Button, Card, Input, styles, up } from '@commun/ui';

import { communityType } from 'types/common';
import { withTranslation } from 'shared/i18n';
import { getImageRotationByExif } from 'utils/images/common';
import { validateImageFile } from 'utils/images/upload';
import { displaySuccess } from 'utils/toastsMessages';
import { SHOW_MODAL_AVATAR_EDIT } from 'store/constants/modalTypes';

import ChooseLanguage from 'containers/createCommunity/CreateDescription/ChooseLanguage';
import AsyncAction from 'components/common/AsyncAction';
import Avatar from 'components/common/Avatar';

const Wrapper = styled.div``;

const CardWrapper = styled(Card)`
  position: relative;
  margin: 10px;
  border-radius: 6px;

  ${up.tablet} {
    margin: 0;
    border-radius: 0;
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

const GreyText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const CoverAvatarWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const AvatarStyled = styled(Avatar)`
  width: 120px;
  height: 120px;
`;

const HiddenInput = styled.input`
  ${styles.visuallyHidden};
`;

const CoverPhoto = styled.div`
  height: 150px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 10px;
`;

const CommunityName = styled.div`
  font-size: 16px;
  text-transform: capitalize;
`;

const Description = styled.div`
  font-size: 14px;
`;

const DescriptionEdit = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChooseLanguageStyled = styled(ChooseLanguage)`
  padding: 0;
`;

const ButtonStyled = styled(Button)`
  height: 42px;
  padding: 15px 20px;
  font-size: 14px;
  border-radius: 100px;
  cursor: pointer;
`;

const ActionsWrapper = styled.div`
  margin-top: 15px;
`;

const ResetButton = styled(ButtonStyled)`
  height: 42px;
  padding: 15px 20px;
  margin-left: 15px;
  font-size: 14px;
  border-radius: 100px;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  transition: background-color 0.15s;

  &:hover,
  &:focus {
    color: #fff;
    background-color: ${({ theme }) => theme.colors.blueHover};
  }

  ${isNot('isChanged')`
    &:hover, &:focus {
      color: ${({ theme }) => theme.colors.black};
      background-color: ${({ theme }) => theme.colors.lightGrayBlue};
    }
  `};
`;

@withTranslation()
export default class General extends PureComponent {
  static propTypes = {
    community: communityType.isRequired,
    language: PropTypes.string.isRequired,
    isLeader: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,

    setCommunityInfo: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  state = {
    isUpdating: false,
    descriptionEdit: false,
    languageEdit: false,
    // eslint-disable-next-line react/destructuring-assignment
    description: this.props.community.description,
    // eslint-disable-next-line react/destructuring-assignment
    language: this.props.language,
  };

  fileInputRef = createRef();

  onAvatarEditClick = () => {
    if (this.fileInputRef.current) {
      this.fileInputRef.current.click();
    }
  };

  onAddPhoto = async e => {
    const { openModal } = this.props;
    const file = e.target ? e.target.files[0] : e;

    if (validateImageFile(file)) {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const image = reader.result;
        const imageRotation = await getImageRotationByExif(file);

        openModal(SHOW_MODAL_AVATAR_EDIT, {
          image,
          onUpdate: async url => {
            this.onAvatarUpdate(url);
            await this.onCreateProposalClick('avatar')();
          },
          fileInputRef: this.fileInputRef,
          imageRotation,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  onAvatarUpdate = avatarUrl => {
    this.setState({ avatarUrl });
  };

  onDescriptionChange = e => {
    this.setState({ description: e.target.value });
  };

  onLanguageSelect = language => {
    this.setState({ language });
  };

  onEditClick = type => () => {
    this.setState({ [`${type}Edit`]: true });
  };

  onCancelClick = type => () => {
    // eslint-disable-next-line react/destructuring-assignment
    this.setState({ [`${type}Edit`]: false, [type]: this.props[type] });
  };

  onCreateProposalClick = type => async () => {
    const { community, setCommunityInfo, t } = this.props;
    const { avatarUrl, description, language } = this.state;

    const updates = {};
    switch (type) {
      case 'avatar':
        updates.avatarUrl = avatarUrl;
        break;
      case 'description':
        updates.description = description.trim();
        break;
      case 'language':
        updates.language = language.code.toLowerCase();
        break;
      default:
    }

    this.setState({
      isUpdating: true,
    });

    try {
      await setCommunityInfo({
        communityId: community.communityId,
        updates,
      });

      displaySuccess(t('modals.description_edit.toastsMessages.proposal_created'));
      this.onCancelClick(type)();
    } catch {
      this.setState({
        isUpdating: false,
      });
    }
  };

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
        {text || t('components.leaderboard.settings.buttons.edit')}
      </EditButton>
    );
  };

  render() {
    const { community, isLeader, t } = this.props;
    const { descriptionEdit, description, languageEdit, language, isUpdating } = this.state;

    const isDescriptionChanged = description !== community.description;
    const isLanguageChanged = language.code !== community.language.toUpperCase();

    return (
      <Wrapper>
        <CardWrapper>
          <CardTitle>{t('components.leaderboard.settings.sections.general')}</CardTitle>
          <Panel>
            <PanelHeader>
              <PanelTitle>{t('components.leaderboard.settings.panels.avatar')}</PanelTitle>
              {this.renderEditButton(this.onAvatarEditClick)}
            </PanelHeader>
            <CoverAvatarWrapper>
              <AvatarStyled communityId={community.id} />
              {isLeader ? (
                <HiddenInput
                  ref={this.fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={this.onAddPhoto}
                />
              ) : null}
            </CoverAvatarWrapper>
          </Panel>
          <Panel>
            <PanelHeader>
              <PanelTitle>{t('components.leaderboard.settings.panels.cover')}</PanelTitle>
              {/* TODO {this.renderEditButton(
                this.onAvatarEditClick,
                t('components.leaderboard.settings.buttons.manage')
              )} */}
            </PanelHeader>

            <CoverPhoto
              style={{
                backgroundImage: `url(${community.coverUrl})`,
              }}
            />
          </Panel>
          <Panel>
            <PanelHeader>
              <PanelTitle>{t('components.leaderboard.settings.panels.community')}</PanelTitle>
              {isLeader ? /* TODO locale */ <GreyText>Can’t be edited</GreyText> : null}
            </PanelHeader>
            <CommunityName>{community.alias}</CommunityName>
          </Panel>
          <Panel>
            <PanelHeader>
              <PanelTitle>{t('components.leaderboard.settings.panels.description')}</PanelTitle>
              {this.renderEditButton(this.onEditClick('description'))}
            </PanelHeader>
            {descriptionEdit ? (
              <DescriptionEdit>
                <Input
                  type="text"
                  title={t('components.leaderboard.settings.placeholders.description')}
                  value={description}
                  multiline
                  onChange={this.onDescriptionChange}
                />
                <ActionsWrapper>
                  <AsyncAction onClickHandler={this.onNextClick}>
                    <ButtonStyled
                      primary
                      disabled={!isDescriptionChanged || isUpdating}
                      onClick={this.onCreateProposalClick('description')}
                    >
                      {t('components.leaderboard.settings.buttons.save')}
                    </ButtonStyled>
                    <ResetButton
                      disabled={isUpdating}
                      isChanged={isDescriptionChanged}
                      onClick={this.onCancelClick('description')}
                    >
                      {t('common.cancel')}
                    </ResetButton>
                  </AsyncAction>
                </ActionsWrapper>
              </DescriptionEdit>
            ) : (
              <Description>{community.description}</Description>
            )}
          </Panel>
          <Panel>
            <PanelHeader>
              <PanelTitle>{t('components.leaderboard.settings.panels.language')}</PanelTitle>
              {this.renderEditButton(this.onEditClick('language'))}
            </PanelHeader>
            <ChooseLanguageStyled
              language={language}
              readOnly={!languageEdit}
              onSelect={this.onLanguageSelect}
            />
            {languageEdit ? (
              <ActionsWrapper>
                <AsyncAction onClickHandler={this.onNextClick}>
                  <ButtonStyled
                    primary
                    disabled={!isLanguageChanged || isUpdating}
                    onClick={this.onCreateProposalClick('language')}
                  >
                    {t('components.leaderboard.settings.buttons.save')}
                  </ButtonStyled>
                  <ResetButton
                    disabled={isUpdating}
                    isChanged={isLanguageChanged}
                    onClick={this.onCancelClick('language')}
                  >
                    {t('common.cancel')}
                  </ResetButton>
                </AsyncAction>
              </ActionsWrapper>
            ) : null}
          </Panel>
          {/* <Panel>
            <PanelHeader>
              <PanelTitle>{t('components.leaderboard.settings.panels.website')}</PanelTitle>
            </PanelHeader>
          </Panel>
          <Panel>
            <PanelHeader>
              <PanelTitle>{t('components.leaderboard.settings.panels.topics')}</PanelTitle>
            </PanelHeader>
          </Panel>
          <Panel>
            <PanelHeader>
              <PanelTitle>{t('components.leaderboard.settings.panels.social_links')}</PanelTitle>
            </PanelHeader>
          </Panel> */}
        </CardWrapper>
      </Wrapper>
    );
  }
}

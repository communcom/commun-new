import React, { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'ramda/src/isEmpty';
import mergeAll from 'ramda/src/mergeAll';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Button, Card, CloseButton, Input, styles, up } from '@commun/ui';

import { communityType } from 'types/common';
import { withTranslation } from 'shared/i18n';
import { generateTopicId } from 'utils/community';
import { getImageRotationByExif } from 'utils/images/common';
import { validateImageFile } from 'utils/images/upload';
import { displaySuccess } from 'utils/toastsMessages';
import { SHOW_MODAL_AVATAR_EDIT } from 'store/constants/modalTypes';

import ChooseLanguage from 'containers/createCommunity/CreateDescription/ChooseLanguage';
import Avatar from 'components/common/Avatar';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';

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

  & button:first-child {
    margin-right: 15px;
  }
`;

const TopicsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Topics = styled.ul`
  list-style: none;
`;

const Topic = styled.li`
  padding: 12px 15px;
  position: relative;

  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 10px;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const TopicChanges = styled.li`
  display: flex;
  flex-direction: column;

  position: relative;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const TopicName = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;
`;

const InputStyled = styled(Input)`
  & input {
    padding-right: 45px;
  }
`;

const AddNewTopicButton = styled(Button)`
  text-align: left;
  background-color: ${({ theme }) => theme.colors.white};
`;

const PlusIcon = styled(Icon).attrs({ name: 'cross' })`
  display: inline-block;
  width: 12px;
  height: 12px;

  margin-right: 10px;

  transform: rotate(45deg);
  color: ${({ theme }) => theme.colors.blue};
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-right: -11px;
  color: ${({ theme }) => theme.colors.black};
`;

const DropDownMenuStyled = styled(DropDownMenu)`
  position: absolute;
  top: 0;
  right: 15px;
`;

const MoreIcon = styled(Icon).attrs({
  name: 'more',
})`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.gray};
`;

const DeleteMenuItem = styled(DropDownMenuItem)`
  color: red;
`;

const CloseButtonStyled = styled(CloseButton)`
  position: absolute;
  width: 30px;
  height: 30px;
  top: 15px;
  right: 15px;
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
    topics: {},
    isTopicsChanged: false,
  };

  fileInputRef = createRef();

  componentDidMount() {
    this.parseSubject();
  }

  parseSubject() {
    const { community } = this.props;

    let topics;
    if (community.subject) {
      try {
        const topicsArr = JSON.parse(community.subject);
        topics = mergeAll(
          topicsArr.map(topic => ({
            [generateTopicId(topic)]: {
              name: topic,
              originalName: topic,
              changes: {},
              showInput: false,
            },
          }))
        );
      } catch (err) {
        // nop
      }
    } else {
      topics = {};
    }
    this.setState({ topics });
  }

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
            await this.onCreateProposalClick('avatar');
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

  onCoverEditClick = () => {
    // TODO
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

  onCancelClick = type => {
    if (type === 'topics') {
      this.onTopicsEditingCancelClick();
      return;
    }

    // eslint-disable-next-line react/destructuring-assignment
    this.setState({ [`${type}Edit`]: false, [type]: this.props[type] });
  };

  onCreateProposalClick = async type => {
    const { community, setCommunityInfo, t } = this.props;
    const { avatarUrl, description, language, topics } = this.state;

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
      case 'topics':
        updates.subject = JSON.stringify(
          Object.values(topics)
            .filter(topic => !topic.changes?.removed)
            .map(topic => topic.name)
        );
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
    } finally {
      this.onCancelClick(type);
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

  getChangesTopics = topics => Object.values(topics).filter(t => !isEmpty(t.changes));

  checkChanges() {
    const { topics } = this.state;

    const changesCount = this.getChangesTopics(topics).length;

    this.setState({ isTopicsChanged: changesCount > 0 });
  }

  onEditTopicClick = topicId => {
    const { topics } = this.state;

    this.setState({
      topics: {
        ...topics,
        [topicId]: { ...topics[topicId], showInput: true },
      },
    });
  };

  onEditTopicCloseClick = topicId => {
    const { topics } = this.state;

    const topic = topics[topicId];

    if (topic.changes.isNew) {
      delete topics[topicId];

      this.setState(
        {
          topics: {
            ...topics,
          },
        },
        () => {
          this.checkChanges();
        }
      );
    } else {
      topic.showInput = false;
      topic.changes = {};
      topic.name = topic.originalName;

      this.setState(
        {
          topics: {
            ...topics,
            [topicId]: topic,
          },
        },
        () => {
          this.checkChanges();
        }
      );
    }
  };

  onRemoveTopicClick = topicId => {
    const { topics } = this.state;

    const topic = topics[topicId];

    topic.changes = { removed: true };

    this.setState(
      {
        topics: {
          ...topics,
          [topicId]: topic,
        },
      },
      () => {
        this.checkChanges();
      }
    );
  };

  onAddNewTopicClick = () => {
    const { topics } = this.state;

    const newTopic = {
      name: '',
      changes: {
        isNew: true,
      },
      showInput: true,
    };

    this.setState({
      topics: {
        ...topics,
        [generateTopicId()]: newTopic,
      },
    });
  };

  onTopicChange = topicId => e => {
    const { topics } = this.state;
    const { value } = e.target;

    const topic = topics[topicId];

    topic.name = value;

    const isValueChanged = value !== topic.originalName;

    if (isValueChanged) {
      topic.changes.edit = isValueChanged;
    } else {
      delete topic.changes.edit;
    }

    this.setState(
      {
        topics: {
          ...topics,
          [topicId]: topic,
        },
      },
      () => {
        this.checkChanges();
      }
    );
  };

  onTopicsEditingCancelClick = () => {
    this.parseSubject();
    this.setState({ isTopicsChanged: false });
  };

  renderTopics() {
    const { isLeader, t } = this.props;
    const { topics } = this.state;

    return (
      topics &&
      Object.keys(topics).map(topicId => {
        const topic = topics[topicId];

        if (topic.changes.removed) {
          return null;
        }

        if (topic.showInput) {
          return (
            <TopicChanges>
              <InputStyled
                key={topicId}
                type="text"
                title={
                  topic.changes.isNew
                    ? t('components.leaderboard.settings.placeholders.new_topic')
                    : t('components.leaderboard.settings.placeholders.topic_name')
                }
                value={topic.name}
                onChange={this.onTopicChange(topicId)}
              />
              <CloseButtonStyled
                onClick={() => {
                  this.onEditTopicCloseClick(topicId);
                }}
              />
            </TopicChanges>
          );
        }

        return (
          <Topic key={topicId}>
            <TopicName>{topic.name}</TopicName>
            {isLeader ? (
              <DropDownMenuStyled
                align="right"
                handler={props => (
                  <Action {...props}>
                    <MoreIcon />
                  </Action>
                )}
                items={() => (
                  <>
                    <DropDownMenuItem
                      name="topic__edit"
                      onClick={() => {
                        this.onEditTopicClick(topicId);
                      }}
                    >
                      {t('components.leaderboard.settings.menu.edit_topic')}
                    </DropDownMenuItem>
                    <DeleteMenuItem
                      name="topic__delete"
                      onClick={() => {
                        this.onRemoveTopicClick(topicId);
                      }}
                    >
                      {t('components.leaderboard.settings.menu.remove_topic')}
                    </DeleteMenuItem>
                  </>
                )}
              />
            ) : null}
          </Topic>
        );
      })
    );
  }

  render() {
    const { community, isLeader, t } = this.props;
    const {
      descriptionEdit,
      description,
      languageEdit,
      language,
      isUpdating,
      isTopicsChanged,
    } = this.state;

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
              {this.renderEditButton(
                this.onCoverEditClick,
                t('components.leaderboard.settings.buttons.manage')
              )}
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
              {isLeader ? (
                <GreyText>{t('components.leaderboard.settings.text.cant_edit')}</GreyText>
              ) : null}
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
                  <ButtonStyled
                    primary
                    disabled={!isDescriptionChanged || isUpdating}
                    onClick={() => this.onCreateProposalClick('description')}
                  >
                    {t('components.leaderboard.settings.buttons.save')}
                  </ButtonStyled>
                  <ButtonStyled
                    big
                    disabled={isUpdating}
                    isChanged={isDescriptionChanged}
                    onClick={() => this.onCancelClick('description')}
                  >
                    {t('common.cancel')}
                  </ButtonStyled>
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
                <ButtonStyled
                  primary
                  disabled={!isLanguageChanged || isUpdating}
                  onClick={() => this.onCreateProposalClick('language')}
                >
                  {t('components.leaderboard.settings.buttons.save')}
                </ButtonStyled>
                <ButtonStyled
                  big
                  disabled={isUpdating}
                  isChanged={isLanguageChanged}
                  onClick={() => this.onCancelClick('language')}
                >
                  {t('common.cancel')}
                </ButtonStyled>
              </ActionsWrapper>
            ) : null}
          </Panel>
          <Panel>
            <PanelHeader>
              <PanelTitle>{t('components.leaderboard.settings.panels.topics')}</PanelTitle>
            </PanelHeader>
            <TopicsWrapper>
              <Topics>{this.renderTopics()}</Topics>
              <AddNewTopicButton big onClick={this.onAddNewTopicClick}>
                <PlusIcon />
                {t('components.leaderboard.settings.buttons.add_new_topic')}
              </AddNewTopicButton>
              {isLeader && isTopicsChanged ? (
                <ActionsWrapper>
                  <ButtonStyled
                    primary
                    disabled={isUpdating}
                    onClick={() => this.onCreateProposalClick('topics')}
                  >
                    {t('components.leaderboard.settings.buttons.save')}
                  </ButtonStyled>
                  <ButtonStyled
                    big
                    disabled={isUpdating}
                    isChanged={isTopicsChanged}
                    onClick={this.onTopicsEditingCancelClick}
                  >
                    {t('common.cancel')}
                  </ButtonStyled>
                </ActionsWrapper>
              ) : null}
            </TopicsWrapper>
          </Panel>
        </CardWrapper>
      </Wrapper>
    );
  }
}
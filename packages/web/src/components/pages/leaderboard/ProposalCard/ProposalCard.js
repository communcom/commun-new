import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Button, Card, Loader } from '@commun/ui';

import { proposalType } from 'types';
import { LANGUAGES } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { wait } from 'utils/time';
import { displayError, displaySuccess } from 'utils/toastsMessages';

import ChooseLanguage from 'containers/createCommunity/CreateDescription/ChooseLanguage';
import CardCommunityHeader from 'components/common/CardCommunityHeader';
import { DropDownMenuItem } from 'components/common/DropDownMenu';
import SplashLoader from 'components/common/SplashLoader';
import UserRow from 'components/common/UserRow';
import CardFooterDecision from 'components/pages/leaderboard/CardFooterDecision';
import ExpirationTime from 'components/pages/leaderboard/ProposalCard/common/ExpirationTime';
import AvatarChange from './AvatarChange';
import BanEntity from './BanEntity';
import ReasonRow from './common/ReasonRow';
import CoverChange from './CoverChange';

const Wrapper = styled(Card)`
  position: relative;
  padding-bottom: 5px;

  &:not(:last-child) {
    margin-bottom: 15px;
  }
`;

const Content = styled.div`
  padding: 15px;
`;

const ChangesBlock = styled.div``;

const TextBlock = styled.div`
  &:not(:first-child) {
    margin-top: 30px;
  }
`;

const ChangeTitle = styled.div`
  display: flex;
  align-items: center;
  min-height: 24px;
  margin-bottom: 5px;
`;

const ChangeTitleText = styled.h2`
  display: flex;
  align-items: center;
  flex-grow: 1;
  line-height: 1;
  font-size: 14px;

  ${is('warning')`
    color: ${({ theme }) => theme.colors.red};
  `};
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const ToggleIcon = styled(Icon).attrs({ name: 'chevron' })`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.gray};
  transform: rotate(0);
  transition: transform 0.1s;

  ${is('toggled')`
    transform: rotate(0.5turn);
  `};
`;

const RuleBlock = styled.div`
  margin-top: 15px;
`;

const RuleTitle = styled.h3`
  font-size: 16px;
`;

const RuleText = styled.p`
  margin-top: 8px;
`;

const DescriptionText = styled.p``;

const LoaderStyled = styled(Loader)`
  margin-right: 10px;
`;

const ChooseLanguageStyled = styled(ChooseLanguage)`
  padding: 0;
`;

const ReasonsWrapper = styled.div`
  margin-top: 15px;
`;

/* eslint-disable react/prop-types */
function Rule({ data }) {
  return (
    <RuleBlock>
      <RuleTitle>{data.title}</RuleTitle>
      {data.text ? <RuleText>{data.text}</RuleText> : null}
    </RuleBlock>
  );
}
/* eslint-enable */

@withTranslation()
export default class ProposalCard extends PureComponent {
  static propTypes = {
    proposal: proposalType.isRequired,
    userId: PropTypes.string,

    approveProposal: PropTypes.func.isRequired,
    execProposal: PropTypes.func.isRequired,
    cancelProposalApprove: PropTypes.func.isRequired,
    cancelProposal: PropTypes.func.isRequired,
    openConfirmDialog: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userId: null,
  };

  state = {
    isShowOld: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  componentDidCatch(error) {
    this.setState({
      error,
    });
  }

  onToggleOldClick = () => {
    const { isShowOld } = this.state;

    this.setState({
      isShowOld: !isShowOld,
    });
  };

  onExecClick = async () => {
    const { t } = this.props;

    this.setState({
      isUpdating: true,
    });

    try {
      await this.execProposal();
      displaySuccess(t('components.proposal_card.toastsMessages.applied'));
    } catch (err) {
      displayError(err);
    }

    if (!this.unmount) {
      this.setState({
        isUpdating: false,
      });
    }
  };

  onApproveClick = async execAfterApprove => {
    const { proposal, approveProposal, t } = this.props;

    this.setState({
      isUpdating: true,
    });

    try {
      await approveProposal(proposal.contentId);

      if (execAfterApprove) {
        // Wait for increase chance of approve processed
        await wait(1000);
        await this.execProposal();
        displaySuccess(t('components.proposal_card.toastsMessages.applied'));
      } else {
        displaySuccess(t('components.proposal_card.toastsMessages.approved'));
      }
    } catch (err) {
      displayError(err);
    }

    if (!this.unmount) {
      this.setState({
        isUpdating: false,
      });
    }
  };

  onRejectClick = async () => {
    const { proposal, cancelProposalApprove, t } = this.props;

    this.setState({
      isUpdating: true,
    });

    try {
      await cancelProposalApprove(proposal.contentId);
      displaySuccess(t('toastsMessages.success'));
    } catch (err) {
      displayError(err);
    }

    if (!this.unmount) {
      this.setState({
        isUpdating: false,
      });
    }
  };

  onRemoveClick = async () => {
    const { proposal, cancelProposal, openConfirmDialog, t } = this.props;

    if (!(await openConfirmDialog())) {
      return;
    }

    this.setState({
      isDeleting: true,
    });

    try {
      await cancelProposal(proposal.contentId);
      displaySuccess(t('toastsMessages.success'));
    } catch (err) {
      displayError(err);

      this.setState({
        isDeleting: false,
      });
    }
  };

  async execProposal() {
    const { proposal, execProposal } = this.props;
    await execProposal(proposal.contentId);
  }

  renderDescription(changes) {
    const { proposal, t } = this.props;
    const { isShowOld } = this.state;

    const { expiration } = proposal;

    return (
      <ChangesBlock>
        <TextBlock>
          <ChangeTitle>
            <ChangeTitleText>
              {changes.old
                ? t('components.proposal_card.update_description')
                : t('components.proposal_card.set_description')}
              <ExpirationTime expiration={expiration} />
            </ChangeTitleText>
          </ChangeTitle>
          <DescriptionText>{changes.new}</DescriptionText>
        </TextBlock>
        {changes.old ? (
          <TextBlock>
            <ChangeTitle>
              <ChangeTitleText>{t('components.proposal_card.old_description')} </ChangeTitleText>
              <ToggleButton onClick={this.onToggleOldClick}>
                <ToggleIcon toggled={isShowOld} />
              </ToggleButton>
            </ChangeTitle>
            {isShowOld ? <DescriptionText>{changes.old}</DescriptionText> : null}
          </TextBlock>
        ) : null}
      </ChangesBlock>
    );
  }

  renderLanguage(changes) {
    const { proposal, t } = this.props;
    const { isShowOld } = this.state;

    const { expiration } = proposal;

    const languageNew = LANGUAGES.find(item => item.code === changes.new.toUpperCase());
    const languageOld = changes.old
      ? LANGUAGES.find(item => item.code === changes.old.toUpperCase())
      : null;

    return (
      <ChangesBlock>
        <TextBlock>
          <ChangeTitle>
            <ChangeTitleText>
              {changes.old
                ? t('components.proposal_card.update_language')
                : t('components.proposal_card.set_language')}
              <ExpirationTime expiration={expiration} />
            </ChangeTitleText>
          </ChangeTitle>
          <DescriptionText>
            <ChooseLanguageStyled language={languageNew} readOnly />
          </DescriptionText>
        </TextBlock>
        {changes.old ? (
          <TextBlock>
            <ChangeTitle>
              <ChangeTitleText>{t('components.proposal_card.old_language')} </ChangeTitleText>
              <ToggleButton onClick={this.onToggleOldClick}>
                <ToggleIcon toggled={isShowOld} />
              </ToggleButton>
            </ChangeTitle>
            {isShowOld ? (
              <DescriptionText>
                <ChooseLanguageStyled language={languageOld} readOnly />
              </DescriptionText>
            ) : null}
          </TextBlock>
        ) : null}
      </ChangesBlock>
    );
  }

  renderUser() {
    const { proposal, t } = this.props;
    const { action, data, proposer, expiration } = proposal;

    const type = action === 'ban' ? 'ban' : 'unban';

    return (
      <ChangesBlock>
        <TextBlock>
          <ChangeTitle>
            <ChangeTitleText>
              {t(`components.proposal_card.${type}_user`)}
              <ExpirationTime expiration={expiration} />
            </ChangeTitleText>
          </ChangeTitle>
          <UserRow userId={data.account} isProposal />
        </TextBlock>
        <ReasonsWrapper>
          <ReasonRow reason={data.reason} author={proposer} />
        </ReasonsWrapper>
      </ChangesBlock>
    );
  }

  renderRules(changes) {
    const { proposal, t } = this.props;
    const { isShowOld } = this.state;

    const { expiration } = proposal;

    switch (changes.subType) {
      case 'add':
        return (
          <ChangesBlock>
            <TextBlock>
              <ChangeTitle>
                <ChangeTitleText>
                  {t('components.proposal_card.add_rule')}
                  <ExpirationTime expiration={expiration} />
                </ChangeTitleText>
              </ChangeTitle>
              <Rule data={changes.new} />
            </TextBlock>
          </ChangesBlock>
        );

      case 'update':
        return (
          <ChangesBlock>
            <TextBlock>
              <ChangeTitle>
                <ChangeTitleText>
                  {t('components.proposal_card.update_rule')}
                  <ExpirationTime expiration={expiration} />
                </ChangeTitleText>
              </ChangeTitle>
              <Rule data={changes.new} />
            </TextBlock>
            <TextBlock>
              <ChangeTitle>
                <ChangeTitleText>{t('components.proposal_card.old_rule')} </ChangeTitleText>
                <ToggleButton onClick={this.onToggleOldClick}>
                  <ToggleIcon toggled={isShowOld} />
                </ToggleButton>
              </ChangeTitle>
              {isShowOld ? <Rule data={changes.old} /> : null}
            </TextBlock>
          </ChangesBlock>
        );

      case 'remove':
        return (
          <ChangesBlock>
            <TextBlock>
              <ChangeTitle>
                <ChangeTitleText warning>
                  {t('components.proposal_card.remove_rule')}
                  <ExpirationTime expiration={expiration} />
                </ChangeTitleText>
              </ChangeTitle>
              <Rule data={changes.old} />
            </TextBlock>
          </ChangesBlock>
        );

      default:
        // eslint-disable-next-line no-console
        console.log('Not implemented yet changes:', changes);
        return 'Not implemented yet';
    }
  }

  renderBanEntity() {
    const { proposal, t } = this.props;
    const { data, expiration } = proposal;
    const { permlink } = data.message_id;

    // TODO: string check should be removed when back will be ready
    const isComment =
      proposal?.contentType === 'comment' || (permlink && permlink.startsWith('re-'));

    return (
      <ChangesBlock>
        <TextBlock>
          <ChangeTitle>
            <ChangeTitleText>
              {isComment
                ? t('components.proposal_card.ban_comment')
                : t('components.proposal_card.ban_post')}
              <ExpirationTime expiration={expiration} />
            </ChangeTitleText>
          </ChangeTitle>
          <BanEntity proposal={proposal} />
        </TextBlock>
      </ChangesBlock>
    );
  }

  renderContent() {
    const { proposal, t } = this.props;

    const { contract, action, change, type, expiration } = proposal;

    if (contract === 'c.list' && action === 'setinfo') {
      if (change) {
        switch (change.type) {
          case 'rules':
            return this.renderRules(change);

          case 'avatarUrl':
            return <AvatarChange change={change} expiration={expiration} />;

          case 'coverUrl':
            return <CoverChange change={change} expiration={expiration} />;

          case 'description':
            return this.renderDescription(change);

          case 'language':
            return this.renderLanguage(change);

          default:
            return t('components.proposal_card.not_implemented_type', {
              type: change ? ` (${change.type})` : '',
            });
        }
      } else {
        return t('components.proposal_card.nothing');
      }
    }

    if (contract === 'c.list' && (action === 'ban' || action === 'unban')) {
      return this.renderUser();
    }

    if (type === 'banPost') {
      return this.renderBanEntity();
    }

    return t('components.proposal_card.not_implemented_action', { contract, action });
  }

  render() {
    const { userId, proposal, t } = this.props;
    const { isUpdating, isDeleting, error } = this.state;

    if (!proposal) {
      return null;
    }

    const { community, proposer, approvesCount, approvesNeed, isApproved, blockTime } = proposal;

    const isAllowExec = approvesCount + (isApproved ? 0 : 1) >= approvesNeed;

    if (error) {
      return (
        <Wrapper>
          <Content>Wrong data</Content>
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        {isDeleting ? <SplashLoader /> : null}
        <CardCommunityHeader
          community={community}
          user={proposer}
          time={blockTime}
          menuItems={
            userId && userId === proposer.userId
              ? () => (
                  <DropDownMenuItem isWarning onClick={this.onRemoveClick}>
                    {t('common.remove')}
                  </DropDownMenuItem>
                )
              : null
          }
        />
        <Content>{this.renderContent()}</Content>
        <CardFooterDecision
          title={t('components.proposal_card.voted')}
          text={t('components.proposal_card.voted_text', { approvesCount, approvesNeed })}
          actions={() => {
            if (isUpdating || isDeleting) {
              return <LoaderStyled />;
            }

            if (isApproved) {
              return (
                <>
                  <Button onClick={this.onRejectClick}>
                    {t('components.proposal_card.refuse')}
                  </Button>
                  {isAllowExec ? (
                    <Button primary onClick={this.onExecClick}>
                      {t('components.proposal_card.apply')}
                    </Button>
                  ) : null}
                </>
              );
            }

            return (
              <Button primary onClick={() => this.onApproveClick(isAllowExec)}>
                {isAllowExec
                  ? t('components.proposal_card.accept_and_apply')
                  : t('components.proposal_card.accept')}
              </Button>
            );
          }}
        />
      </Wrapper>
    );
  }
}

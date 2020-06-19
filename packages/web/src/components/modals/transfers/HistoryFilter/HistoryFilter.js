import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Button, CloseButton, up } from '@commun/ui';

import { HOLD_TYPE, REWARDS_TYPE, TRANSACTIONS_TYPE } from 'shared/constants';
import { withTranslation } from 'shared/i18n';

const DIRECTION = {
  all: '100',
  receive: '010',
  send: '001',
};

const DIRECTION_FROM_BUTTONS_STATE = {
  '100': 'all',
  '010': 'receive',
  '001': 'send',
};

const isPrimary = value => value !== '0';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  position: absolute;
  bottom: 0;

  width: 100%;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 24px 24px 0 0;

  ${up.mobileLandscape} {
    position: relative;

    width: 330px;

    border-radius: 15px;
  }
`;

const Header = styled.h4`
  position: relative;
  padding: 20px 0;

  text-align: center;
`;

const CloseButtonStyled = styled(CloseButton)`
  position: absolute;
  top: 20px;
  right: 15px;
`;

const Body = styled.div`
  padding: 10px 20px;
`;

const Title = styled.div`
  margin-bottom: 20px;

  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const Direction = styled.div`
  display: flex;
  justify-content: space-between;

  margin-bottom: 30px;

  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 15px;
`;

const DirectionButton = styled(Button)`
  flex: 2;
  padding: 20px 0;
  height: 60px;

  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
  background-color: unset;
  border-radius: 15px;

  ${is('primary')`
      color: #fff;
      background-color: ${({ theme }) => theme.colors.blue};
  `};
`;

const ButtonGroup = styled.div`
  margin-bottom: 30px;
`;

const ButtonWrapper = styled(Button)`
  margin-right: 20px;

  color: ${({ theme }) => theme.colors.black};

  ${is('primary')`
      color: #fff;
  `};
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > :not(:last-child) {
    margin-bottom: 10px;
  }
`;

const ActionButton = styled(Button)`
  height: 50px;

  width: 100%;
  font-size: 15px;
`;

@withTranslation()
export default class Filter extends PureComponent {
  static propTypes = {
    filters: PropTypes.object,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    filters: null,
  };

  constructor(props) {
    super(props);

    const initialState = {
      direction: DIRECTION.all,
      transfer: true,
      convert: true,
      rewards: true,
      like: true,
      dislike: true,
    };

    if (props.filters) {
      const { direction, transferType, rewardsType, holdType } = props.filters;

      initialState.direction = DIRECTION[direction];

      switch (transferType) {
        case TRANSACTIONS_TYPE.TRANSFER:
          initialState.transfer = true;
          initialState.convert = false;
          break;
        case TRANSACTIONS_TYPE.CONVERT:
          initialState.convert = true;
          initialState.transfer = false;
          break;
        case TRANSACTIONS_TYPE.NONE:
          initialState.transfer = false;
          initialState.convert = false;
          break;
        case TRANSACTIONS_TYPE.ALL:
        default:
          initialState.transfer = true;
          initialState.convert = true;
      }

      switch (rewardsType) {
        case REWARDS_TYPE.NONE:
          initialState.rewards = false;
          break;
        case REWARDS_TYPE.ALL:
        default:
          initialState.rewards = true;
      }

      switch (holdType) {
        case HOLD_TYPE.LIKE:
          initialState.like = true;
          initialState.dislike = false;
          break;
        case HOLD_TYPE.DISLIKE:
          initialState.like = false;
          initialState.dislike = true;
          break;
        case HOLD_TYPE.NONE:
          initialState.like = false;
          initialState.dislike = false;
          break;
        case HOLD_TYPE.ALL:
        default:
          initialState.like = true;
          initialState.dislike = true;
      }
    }

    this.state = initialState;
  }

  onDirectionButtonClick = direction => () => {
    this.setState({
      direction,
    });
  };

  onTypeButtonClick = txType => () => {
    this.setState(state => ({
      [txType]: !state[txType],
    }));
  };

  onSaveButtonClick = () => {
    const { close } = this.props;
    const { direction, transfer, convert, rewards, like, dislike } = this.state;

    let transferType;
    if (transfer && convert) {
      transferType = TRANSACTIONS_TYPE.ALL;
    } else if (transfer) {
      transferType = TRANSACTIONS_TYPE.TRANSFER;
    } else if (convert) {
      transferType = TRANSACTIONS_TYPE.CONVERT;
    } else {
      transferType = TRANSACTIONS_TYPE.NONE;
    }

    let rewardsType = REWARDS_TYPE.NONE;
    if (rewards) {
      rewardsType = REWARDS_TYPE.ALL;
    }

    let holdType;
    if (like && dislike) {
      holdType = HOLD_TYPE.ALL;
    } else if (like) {
      holdType = HOLD_TYPE.LIKE;
    } else if (dislike) {
      holdType = HOLD_TYPE.DISLIKE;
    } else {
      holdType = HOLD_TYPE.NONE;
    }

    close({
      direction: DIRECTION_FROM_BUTTONS_STATE[direction],
      transferType,
      rewardsType,
      holdType,
    });
  };

  onRewardsButtonClick = () => {
    this.setState(state => ({
      rewards: !state.rewards,
    }));
  };

  onClearAllButtonClick = () => {
    this.setState({
      direction: DIRECTION.all,
      transfer: false,
      convert: false,
      rewards: false,
      like: false,
      dislike: false,
    });
  };

  closeModal = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { t } = this.props;
    const { direction, transfer, convert, rewards, like, dislike } = this.state;
    const [all, income, outcome] = direction.split('');

    return (
      <Wrapper>
        <Header>
          {t('modals.transfers.history_filter.title')}
          <CloseButtonStyled onClick={this.closeModal} />
        </Header>
        <Body>
          <Direction>
            <DirectionButton
              primary={isPrimary(all)}
              onClick={this.onDirectionButtonClick(DIRECTION.all)}
            >
              {t('modals.transfers.history_filter.all')}
            </DirectionButton>
            <DirectionButton
              primary={isPrimary(income)}
              onClick={this.onDirectionButtonClick(DIRECTION.receive)}
            >
              {t('modals.transfers.history_filter.income')}
            </DirectionButton>
            <DirectionButton
              primary={isPrimary(outcome)}
              onClick={this.onDirectionButtonClick(DIRECTION.send)}
            >
              {t('modals.transfers.history_filter.outcome')}
            </DirectionButton>
          </Direction>
          <ButtonGroup>
            <Title>{t('modals.transfers.history_filter.type')}</Title>
            <ButtonWrapper
              primary={transfer}
              onClick={this.onTypeButtonClick(TRANSACTIONS_TYPE.TRANSFER)}
            >
              {t('modals.transfers.history_filter.transfer')}
            </ButtonWrapper>
            <ButtonWrapper
              primary={convert}
              onClick={this.onTypeButtonClick(TRANSACTIONS_TYPE.CONVERT)}
            >
              {t('modals.transfers.history_filter.convert')}
            </ButtonWrapper>
          </ButtonGroup>
          <ButtonGroup>
            <Title>{t('modals.transfers.history_filter.rewards')}</Title>
            <ButtonWrapper primary={rewards} onClick={this.onRewardsButtonClick}>
              {t('modals.transfers.history_filter.rewards')}
            </ButtonWrapper>
          </ButtonGroup>
          <ButtonGroup>
            <Title>{t('modals.transfers.history_filter.hold_type_title')}</Title>
            <ButtonWrapper primary={like} onClick={this.onTypeButtonClick(HOLD_TYPE.LIKE)}>
              {t('modals.transfers.history_filter.like')}
            </ButtonWrapper>
            <ButtonWrapper primary={dislike} onClick={this.onTypeButtonClick(HOLD_TYPE.DISLIKE)}>
              {t('modals.transfers.history_filter.dislike')}
            </ButtonWrapper>
          </ButtonGroup>
          <Actions>
            <ActionButton primary onClick={this.onSaveButtonClick}>
              {t('common.save')}
            </ActionButton>
            <ActionButton onClick={this.onClearAllButtonClick}>
              {t('modals.transfers.history_filter.clear_all')}
            </ActionButton>
          </Actions>
        </Body>
      </Wrapper>
    );
  }
}

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, CheckBox, CloseButton, Input } from '@commun/ui';

import { BanReason, banReasons } from 'shared/constants';
import { withTranslation } from 'shared/i18n';

import AsyncButton from 'components/common/AsyncButton';
import UserRow from 'components/common/UserRow';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  flex-basis: 400px;
  padding: 20px;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const ModalName = styled.h3`
  font-weight: 600;
  font-size: 18px;
  line-height: 25px;
`;

const CloseButtonStyled = styled(CloseButton)`
  background-color: ${({ theme }) => theme.colors.white};
`;

const Question = styled.div`
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
`;

const UserWrapper = styled.div`
  margin-bottom: 15px;
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ReasonsWrapper = styled.div`
  margin-bottom: 15px;
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  height: 24px;
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;

  & > :first-child {
    margin-right: 15px;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 35px;

  & > :not(:last-child) {
    margin-bottom: 10px;
  }
`;

@withTranslation()
export default class BanModal extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,

    banCommunityUser: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  state = {
    selectedReasons: [],
    inputValue: '',
    isSending: false,
  };

  onCloseClick = () => {
    const { close } = this.props;

    close();
  };

  onInputChange = e => {
    const { value } = e.target;

    if (!value.trim()) {
      this.setState(prevState => ({
        inputValue: prevState.inputValue ? value : value.trim(),
        selectedReasons: prevState.selectedReasons.filter(item => item !== BanReason.OTHER),
      }));
      return;
    }

    this.setState(prevState => ({
      inputValue: prevState.inputValue ? value : value.trim(),
      selectedReasons: prevState.selectedReasons.includes(BanReason.OTHER)
        ? prevState.selectedReasons
        : prevState.selectedReasons.concat(BanReason.OTHER),
    }));
  };

  onSelectReason = id => {
    this.setState(prevState => ({
      selectedReasons: prevState.selectedReasons.includes(id)
        ? prevState.selectedReasons.filter(item => item !== id)
        : prevState.selectedReasons.concat(id),
    }));
  };

  onSendBan = async e => {
    const { communityId, userId, banCommunityUser, close } = this.props;
    const { selectedReasons, inputValue, isSending } = this.state;
    let chosenReasons = [...selectedReasons];
    const trimmedInputValue = inputValue.trim();

    e.preventDefault();

    if (!selectedReasons.length || isSending) {
      return;
    }

    if (selectedReasons.includes(BanReason.OTHER)) {
      if (trimmedInputValue) {
        chosenReasons = selectedReasons.map(item => {
          if (item === BanReason.OTHER) {
            return `other-${trimmedInputValue.replace(/\s+/g, ',')}`;
          }

          return item;
        });
      } else {
        chosenReasons = selectedReasons.filter(item => item !== BanReason.OTHER);
      }
    }

    const reasons = JSON.stringify(chosenReasons);

    this.setState({
      isSending: true,
    });

    await banCommunityUser(communityId, userId, reasons);

    this.setState(
      {
        isSending: false,
      },
      close
    );
  };

  renderReason(id) {
    const { t } = this.props;
    const { selectedReasons, inputValue } = this.state;

    return (
      <>
        <CheckBox
          disabled={id === BanReason.OTHER && !inputValue.trim()}
          checked={selectedReasons.includes(id)}
          onChange={() => this.onSelectReason(id)}
        />
        {t(`bans.${id}`)}
      </>
    );
  }

  render() {
    const { userId, t } = this.props;
    const { isSending, selectedReasons, inputValue } = this.state;
    const isDisabled = !selectedReasons.length || isSending;

    return (
      <Wrapper>
        <Header>
          <ModalName>{t('modals.ban.title')}</ModalName>
          <CloseButtonStyled onClick={this.onCloseClick} />
        </Header>
        <Question>{t('modals.ban.question')}</Question>
        <UserWrapper>
          <UserRow userId={userId} isProposal />
        </UserWrapper>
        <Form onSubmit={this.onSendBan}>
          <ReasonsWrapper>
            {banReasons.map(id => (
              <Label key={id}>{this.renderReason(id)}</Label>
            ))}
          </ReasonsWrapper>
          <Input
            title={t('modals.ban.ban_field')}
            value={inputValue}
            onChange={this.onInputChange}
          />
          <ButtonsWrapper>
            <AsyncButton full big primary disabled={isDisabled} onClick={this.onSendBan}>
              {t('modals.ban.send')}
            </AsyncButton>
            <Button full big onClick={this.onCloseClick}>
              {t('modals.ban.cancel')}
            </Button>
          </ButtonsWrapper>
        </Form>
      </Wrapper>
    );
  }
}

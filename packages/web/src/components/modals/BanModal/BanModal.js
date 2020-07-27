import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, CheckBox, CloseButton, Input } from '@commun/ui';

import { BanReason, banReasons } from 'shared/constants';
import { withTranslation } from 'shared/i18n';

import AsyncButton from 'components/common/AsyncButton';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  flex-basis: 355px;
  padding: 20px;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.colors.white};
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
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

const InfoBlock = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0 25px;

  & > :not(:last-child) {
    margin-right: 15px;
  }
`;

const InfoText = styled.p`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  height: 24px;
  width: 24px;
  background-color: ${({ theme }) => theme.colors.gray};
  color: #fff;
  border-radius: 50%;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
`;

const ButtonsWrapper = styled.div`
  display: flex;

  & > :not(:last-child) {
    margin-right: 10px;
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
    const { t } = this.props;
    const { isSending, selectedReasons, inputValue } = this.state;
    const isDisabled = !selectedReasons.length || isSending;

    return (
      <Wrapper>
        <Header>
          <ModalName>{t('modals.ban.title')}</ModalName>
          <CloseButton onClick={this.onCloseClick} />
        </Header>
        <Form onSubmit={this.onSendBan}>
          {banReasons.map(id => (
            <Label key={id}>{this.renderReason(id)}</Label>
          ))}
          <Input
            title={t('modals.ban.ban_field')}
            value={inputValue}
            onChange={this.onInputChange}
          />
          <InfoBlock>
            <IconContainer>!</IconContainer>
            <InfoText>{t('modals.ban.text')}</InfoText>
          </InfoBlock>
          <ButtonsWrapper>
            <AsyncButton primary disabled={isDisabled} onClick={this.onSendBan}>
              {t('modals.ban.send')}
            </AsyncButton>
            <Button onClick={this.onCloseClick}>{t('common.cancel')}</Button>
          </ButtonsWrapper>
        </Form>
      </Wrapper>
    );
  }
}

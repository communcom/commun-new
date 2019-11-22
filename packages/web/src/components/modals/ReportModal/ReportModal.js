import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, CheckBox, CloseButton } from '@commun/ui';
import { reportReasons } from 'shared/constants';
import { contentIdType } from 'types';

import AsyncButton from 'components/common/AsyncButton';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  flex-basis: 355px;
  padding: 20px;
  border-radius: 15px;
  background-color: #fff;
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
  text-transform: capitalize;

  & > :not(:last-child) {
    margin-right: 15px;
  }
`;

const InfoBlock = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 0 20px;

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

const ButtonStyled = styled(Button)`
  width: 80px;
`;

const AsyncButtonStyled = styled(AsyncButton)`
  width: 80px;
`;

export default class ReportModal extends Component {
  static propTypes = {
    contentId: contentIdType.isRequired,

    report: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  state = {
    selectedReasons: [],
    isSending: false,
  };

  onCloseClick = () => {
    const { close } = this.props;

    close();
  };

  onSelectReason = id => {
    this.setState(prevState => ({
      selectedReasons: prevState.selectedReasons.includes(id)
        ? prevState.selectedReasons.filter(item => item !== id)
        : prevState.selectedReasons.concat(id),
    }));
  };

  onSendReport = async () => {
    const { contentId, report, close } = this.props;
    const { selectedReasons } = this.state;

    if (!selectedReasons.length) {
      return;
    }

    const reasons = JSON.stringify(selectedReasons);

    this.setState({
      isSending: true,
    });

    await report(contentId, reasons);

    this.setState(
      {
        isSending: false,
      },
      close
    );
  };

  renderReason(id, desc) {
    const { selectedReasons } = this.state;

    return (
      <>
        <CheckBox checked={selectedReasons.includes(id)} onChange={() => this.onSelectReason(id)} />
        {desc}
      </>
    );
  }

  render() {
    const { isSending, selectedReasons } = this.state;
    const isDisabled = !selectedReasons.length || isSending;

    return (
      <Wrapper>
        <Header>
          <ModalName>Please select a problem</ModalName>
          <CloseButton onClick={this.onCloseClick} />
        </Header>
        <Form>
          {reportReasons.map(({ id, desc }) => (
            <Label key={id}>{this.renderReason(id, desc)}</Label>
          ))}

          <InfoBlock>
            <IconContainer>!</IconContainer>
            <InfoText>
              {`If someone is in immediate danger, call local emergency services. Don't wait.`}
            </InfoText>
          </InfoBlock>
          <ButtonsWrapper>
            <AsyncButtonStyled primary disabled={isDisabled} onClick={this.onSendReport}>
              Send
            </AsyncButtonStyled>
            <ButtonStyled onClick={this.onCloseClick}>Cancel</ButtonStyled>
          </ButtonsWrapper>
        </Form>
      </Wrapper>
    );
  }
}

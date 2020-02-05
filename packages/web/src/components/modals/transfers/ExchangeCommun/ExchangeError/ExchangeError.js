import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { EXCHANGE_MODALS } from 'components/modals/transfers/ExchangeCommun/constants';
import { Wrapper, Content } from 'components/modals/transfers/ExchangeCommun/common.styled';
import Header from 'components/modals/transfers/ExchangeCommun/common/Header';
import { ButtonStyled } from 'components/modals/transfers/common.styled';

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 146px;
  background-color: #fff;
  border-radius: 10px;
`;

const ErrorImage = styled.div`
  width: 32px;
  height: 32px;
  margin-bottom: 10px;
  background: url('/images/crying-cat.png');
  background-size: 32px 32px;
`;

const ErrorTitle = styled.h2`
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  text-transform: capitalize;
`;

const ErrorText = styled.p`
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
`;

const Body = styled.div`
  height: 492px;
`;

const ERRORS = {
  1: 'CVC error',
  2: 'Postal code error',
  3: 'Billing address error',
  4: 'Other incorrect field(s)',
  5: 'Transaction declined by bank.',
  6: 'Only Visa or Mastercard accepted right now',
  7: '3DS authentication failure',
  8: '3DS authentication could not be performed',
  9: `3DS authentication was performed but not completed by user's bank`,
};

export default class ExchangeError extends PureComponent {
  static propTypes = {
    errors: PropTypes.number.isRequired,

    setCurrentScreen: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  onBackClick = () => {
    const { setCurrentScreen } = this.props;

    setCurrentScreen({
      id: EXCHANGE_MODALS.EXCHANGE_SELECT,
      props: { showTokenSelect: false, sellToken: { symbol: 'USD' } },
    });
  };

  render() {
    const { errors, close } = this.props;

    const error = ERRORS[errors] || (
      <>
        We are working on this problem.
        <br />
        We apologize for the inconvenience
      </>
    );

    return (
      <Wrapper>
        <Header isBlack close={close} />
        <Content>
          <Body>
            <ErrorWrapper>
              <ErrorImage />
              <ErrorTitle>The payment is not made</ErrorTitle>
              <ErrorText>{error}</ErrorText>
            </ErrorWrapper>
          </Body>
          <ButtonStyled primary fluid onClick={this.onBackClick}>
            Repeat
          </ButtonStyled>
        </Content>
      </Wrapper>
    );
  }
}

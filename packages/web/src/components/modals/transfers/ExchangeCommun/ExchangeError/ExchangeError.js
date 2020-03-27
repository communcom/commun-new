import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withTranslation } from 'shared/i18n';

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

@withTranslation()
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
    const { errors, close, t } = this.props;

    const error =
      t(`modals.transfers.exchange_commun.error.errors.${errors}`) ||
      t('modals.transfers.exchange_commun.error.errors.default');

    return (
      <Wrapper>
        <Header isBlack close={close} />
        <Content>
          <Body>
            <ErrorWrapper>
              <ErrorImage />
              <ErrorTitle>{t('modals.transfers.exchange_commun.error.description')}</ErrorTitle>
              <ErrorText dangerouslySetInnerHTML={{ __html: error }} />
            </ErrorWrapper>
          </Body>
          <ButtonStyled primary fluid onClick={this.onBackClick}>
            {t('modals.transfers.exchange_commun.error.repeat')}
          </ButtonStyled>
        </Content>
      </Wrapper>
    );
  }
}

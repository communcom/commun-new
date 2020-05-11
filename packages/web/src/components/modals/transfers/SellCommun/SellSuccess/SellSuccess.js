import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { withTranslation } from 'shared/i18n';

import { Icon } from '@commun/icons';
import { SELL_MODALS } from 'components/modals/transfers/SellCommun/constants';
import Header from 'components/modals/transfers/common/Header';
import { ButtonStyled } from 'components/modals/transfers/common.styled';

const CheckIcon = styled(Icon).attrs({ name: 'check' })`
  width: 24px;
  height: 24px;
  color: #fff;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.blue};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin-top: 16px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.white};

  margin-bottom: 30px;
`;

const StrongText = styled.span`
  font-weight: bold;
  font-size: 17px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.black};

  margin-bottom: 8px;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 154px;
  padding: 20px;
`;

const CircleSuccess = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: ${({ theme }) => theme.colors.green};
  box-shadow: 0px 8px 24px #bbf3e2;
  border-radius: 40px;

  margin-bottom: 15px;
`;

const Delimeter = styled.div`
  position: relative;
  height: 24px;

  &::before {
    position: absolute;
    content: '';
    top: 11px;
    left: 27px;
    right: 27px;
    height: 2px;
    border-bottom: 2px dashed #e2e6e8;
  }
`;

const Circle = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.blue};

  ${is('left')`
    left: -12px;
  `};

  ${is('right')`
    right: -12px;
  `};
`;

const Bottom = styled.div`
  padding: 20px 30px 25px;
  text-align: center;
  overflow-wrap: break-word;
`;

const Title = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: 10px;
`;

const Text = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 25px;
  color: ${({ theme }) => theme.colors.black};
`;

const ButtonBack = styled(ButtonStyled)`
  background: rgba(255, 255, 255, 0.1);
`;

@withTranslation()
export default class SellSuccess extends PureComponent {
  static propTypes = {
    outAmount: PropTypes.string.isRequired,

    setCurrentScreen: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  onBackClick = () => {
    const { setCurrentScreen } = this.props;

    setCurrentScreen({ id: SELL_MODALS.SELL_SELECT, props: {} });
  };

  render() {
    const { outAmount, close, t } = this.props;

    return (
      <Wrapper>
        <Header
          titleLocaleKey="modals.transfers.exchange_commun.common.header.title"
          close={close}
        />
        <Content>
          <Body>
            <Top>
              <CircleSuccess>
                <CheckIcon />
              </CircleSuccess>

              <StrongText>{t('modals.transfers.exchange_commun.success.completed')}</StrongText>
            </Top>

            <Delimeter>
              <Circle left />
              <Circle right />
            </Delimeter>

            <Bottom>
              <Title>{t('modals.transfers.exchange_commun.success.total_charged')}:</Title>
              <Text>{outAmount} BTC</Text>
            </Bottom>
          </Body>
          <ButtonBack primary onClick={this.onBackClick}>
            {t('common.back')}
          </ButtonBack>
        </Content>
      </Wrapper>
    );
  }
}

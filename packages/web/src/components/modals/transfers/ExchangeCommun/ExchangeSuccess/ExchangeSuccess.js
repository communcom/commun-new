import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import dayjs from 'dayjs';

import { COMMUN_SYMBOL } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { displayError } from 'utils/toastsMessages';

import { Skeleton } from '@commun/ui';
import { Icon } from '@commun/icons';
import { EXCHANGE_MODALS } from 'components/modals/transfers/ExchangeCommun/constants';
import Header from 'components/modals/transfers/common/Header';
import PointAvatar from 'components/pages/wallet/PointAvatar';
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
  height: 492px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.white};

  margin-bottom: 30px;
`;

const Bold = styled.span`
  font-weight: bold;
`;

const StrongText = styled.span`
  font-weight: bold;
  font-size: 17px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.black};

  margin-bottom: 8px;
`;

const LightText = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.gray};
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

const Middle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 198px;
  padding: 25px 20px 21px;
`;

const AddedText = styled.span`
  font-style: normal;
  font-size: 20px;
  line-height: 100%;
  color: #4edbb0;

  margin-bottom: 35px;
`;

const PointAvatarStyled = styled(PointAvatar)`
  margin-bottom: 4px;
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
export default class ExchangeSuccess extends PureComponent {
  static propTypes = {
    orderId: PropTypes.string.isRequired,
    communPoint: PropTypes.object.isRequired,

    getCarbonStatus: PropTypes.func.isRequired,
    waitTransactionAndCheckBalance: PropTypes.func.isRequired,

    setCurrentScreen: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  state = {
    success: null,
    isBalanceLoading: false,
  };

  async componentDidMount() {
    const { orderId, getCarbonStatus, waitTransactionAndCheckBalance, close } = this.props;

    try {
      const result = await getCarbonStatus({ orderId });

      if (result.details.status === 0) {
        this.setState({ success: result.details, isBalanceLoading: true });
        await waitTransactionAndCheckBalance(result.details.transactionHash);
        this.setState({ isBalanceLoading: false });
      }
    } catch (err) {
      const message = err.data?.message || 'Something went wrong';
      displayError(message);

      close();
    }
  }

  onBackClick = () => {
    const { setCurrentScreen } = this.props;

    setCurrentScreen({ id: EXCHANGE_MODALS.EXCHANGE_SELECT, props: {} });
  };

  render() {
    const { communPoint, close, t } = this.props;
    const { success, isBalanceLoading } = this.state;

    if (!success) {
      return null;
    }

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
              <LightText>{dayjs(success.timeCompleted).format('D MMMM YYYY')}</LightText>
            </Top>

            <Delimeter>
              <Circle left />
              <Circle right />
            </Delimeter>

            <Middle>
              <AddedText>
                <Bold>+{success.cryptocurrencyAmountPurchase} Commun</Bold>
              </AddedText>
              <PointAvatarStyled point={{ symbol: COMMUN_SYMBOL }} size="56" />
              <StrongText>Commun</StrongText>
              <LightText>
                {isBalanceLoading ? (
                  <Skeleton
                    primaryColor="#d1d8fc"
                    secondaryColor="#fff"
                    secondaryOpacity={0.7}
                    width="100"
                    height="8"
                  />
                ) : (
                  communPoint.balance
                )}
              </LightText>
            </Middle>

            <Delimeter>
              <Circle left />
              <Circle right />
            </Delimeter>

            <Bottom>
              <Title>{t('modals.transfers.exchange_commun.success.total_charged')}:</Title>
              <Text>
                {(success.totalCharged / 100).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </Text>
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

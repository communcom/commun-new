import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { ListItem, ListItemAvatar, ListItemText } from '@commun/ui';

import { withTranslation } from 'shared/i18n';

import TrxLink from 'components/pages/wallet/common/TrxLink';

const Wrapper = styled(ListItem)`
  flex-direction: column;
  align-items: stretch;
  padding: 10px 15px;

  ${is('hasMemo')`
    cursor: pointer;
  `}
`;

const PointBalance = styled(ListItemText)`
  text-align: right;

  & > div {
    font-size: 14px;
  }
`;

const RightPanel = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const BottomStatusBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const TrxLinkStyled = styled(TrxLink)`
  margin-left: 6px;
`;

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Memo = styled.div`
  margin-top: 12px;

  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  color: ${({ theme }) => theme.colors.gray};
`;

@withTranslation()
export default class HistoryItem extends PureComponent {
  static propTypes = {
    item: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    item: [],
  };

  state = {
    show: false,
  };

  onItemClick = e => {
    const {
      item: { memo },
    } = this.props;

    if (memo && e.target.tagName !== 'a') {
      this.setState(state => ({
        show: !state.show,
      }));
    }
  };

  render() {
    const { item, t } = this.props;
    const { show } = this.state;
    const { trxId, memo, avatar, title, txType, amount, status } = item;

    let txTypeTitle = txType;

    if (typeof txType === 'string') {
      txTypeTitle = t(`components.wallet.history_list.types.${txType.toLowerCase()}`, {
        defaultValue: txType,
      });
    }

    return (
      <Wrapper hasMemo={Boolean(memo)} onItemClick={this.onItemClick}>
        <ItemWrapper>
          <ListItemAvatar>{avatar}</ListItemAvatar>
          <ListItemText primary={title} primaryBold secondary={txTypeTitle} />
          <RightPanel>
            <PointBalance
              primary={amount}
              primaryBold
              secondary={
                <BottomStatusBlock>
                  {status} <TrxLinkStyled trxId={trxId} hasMemo={Boolean(memo)} />
                </BottomStatusBlock>
              }
            />
          </RightPanel>
        </ItemWrapper>
        <Memo style={{ display: show ? 'block' : 'none' }}>Memo: {memo}</Memo>
      </Wrapper>
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@commun/ui';

import { useTranslation } from 'shared/i18n';

const Wrapper = styled(List)`
  padding: 15px 0;
  margin-bottom: 8px;
  min-height: 100%;
`;

const PointsItem = styled(ListItem)`
  margin-bottom: 10px;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  cursor: pointer;
`;

const PointBalance = styled(ListItemText)`
  text-align: right;
`;

const PointsText = styled.span`
  font-weight: 600;
  font-size: 13px;
`;

const RightPanel = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const PointList = ({ className, points, itemName, itemClickHandler }) => {
  const { t } = useTranslation();

  return (
    <Wrapper className={className}>
      {points.map(({ symbol, balance, logo, name, frozen, price }) => (
        <PointsItem key={symbol} onItemClick={() => itemClickHandler(symbol)} name={itemName}>
          <ListItemAvatar>
            <Avatar size="large" avatarUrl={logo} name={name} />
          </ListItemAvatar>
          <ListItemText
            primary={name}
            primaryBold
            secondary={
              frozen
                ? t('components.wallet.points_grid.on_hold', { quantity: Number(frozen) })
                : null
            }
          />
          <RightPanel>
            <PointBalance
              primary={
                <>
                  {balance} <PointsText>{t('common.point', { count: Number(balance) })}</PointsText>
                </>
              }
              primaryBold
              secondary={price ? `= ${price} Commun` : null}
            />
          </RightPanel>
        </PointsItem>
      ))}
    </Wrapper>
  );
};

PointList.propTypes = {
  points: PropTypes.instanceOf(Map),
  itemName: PropTypes.string,
  itemClickHandler: PropTypes.func,
};

PointList.defaultProps = {
  points: new Map(),
  itemName: null,
  itemClickHandler: undefined,
};

export default PointList;

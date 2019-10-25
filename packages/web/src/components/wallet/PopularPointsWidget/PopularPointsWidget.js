import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';
import Avatar from 'components/common/Avatar';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
  padding: 8px 16px;
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
  border-radius: 4px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
`;

const Title = styled.h4`
  font-size: 12px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const PointsList = styled.ul``;

const PointsItem = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  color: #000;
`;

const PointsName = styled.p`
  padding-left: 16px;
  font-size: 15px;
  font-weight: 600;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.contextBlue};
`;

const IconStyled = styled(Icon)`
  width: 24px;
  height: 24px;
`;

const CommunIcon = styled(Icon)`
  width: 7px;
  height: 16px;
`;

const PointsNumber = styled.p`
  font-weight: 600;
  line-height: normal;
  font-size: 15px;
  color: #000;
`;

const RightPanel = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const ConvertButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 15px;
  margin-left: auto;
  color: ${({ theme }) => theme.colors.contextGrey};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlue};
  }
`;

export default class PopularPointsWidget extends PureComponent {
  static propTypes = {
    points: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        communityId: PropTypes.string,
        count: PropTypes.number,
      })
    ).isRequired,
  };

  openConvertDialog = () => {
    // TODO: implement openConvertDialog
  };

  render() {
    const { points } = this.props;

    return (
      <Wrapper>
        <Header>
          <Title>Popular points</Title>
        </Header>
        <PointsList>
          {points.slice(0, 5).map(({ name, communityId, count }) => (
            <PointsItem key={name}>
              {name === 'COMMUN' ? (
                <IconWrapper>
                  <CommunIcon name="slash" />
                </IconWrapper>
              ) : (
                <Avatar communityId={communityId} />
              )}
              <PointsName>{name}</PointsName>
              <RightPanel>
                <PointsNumber>{count}</PointsNumber>
                <ConvertButton
                  name="popular-points-widget__covert-points"
                  aria-label="Convert points"
                  onClick={this.openConvertDialog}
                >
                  <IconStyled name="transfer-points" />
                </ConvertButton>
              </RightPanel>
            </PointsItem>
          ))}
        </PointsList>
      </Wrapper>
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SeeAll from 'components/common/SeeAll';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;

  padding: 0;
  min-height: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;

  padding: 0 15px 20px;
`;

const Title = styled.h3`
  display: flex;
  flex-grow: 1;

  font-weight: 600;
  font-size: 18px;
  text-align: left;
`;

const Content = styled.div`
  display: flex;
`;

const MobilePanel = ({ title, seeAllActionHndler, children, className }) => (
  <Wrapper className={className}>
    <Header>
      <Title>{title}</Title>
      <SeeAll onClick={seeAllActionHndler} />
    </Header>
    <Content>{children}</Content>
  </Wrapper>
);

MobilePanel.propTypes = {
  title: PropTypes.string.isRequired,
  seeAllActionHndler: PropTypes.func,
  children: PropTypes.node,
};

MobilePanel.defaultProps = {
  seeAllActionHndler: undefined,
  children: null,
};

export default MobilePanel;

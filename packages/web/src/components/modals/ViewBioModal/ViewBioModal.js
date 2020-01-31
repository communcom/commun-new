import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { styles, up } from '@commun/ui';

import { DescriptionHeader, CloseButtonStyled } from '../common/common.styled';

const Wrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 500px;
  margin: auto 10px 34px;
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;

  ${up.tablet} {
    height: auto;
    margin-top: 0;
    border-radius: 15px;
  }
`;

const DescriptionHeaderStyled = styled(DescriptionHeader)`
  margin-bottom: 17px;
  justify-content: space-between;

  ${up.tablet} {
    margin-bottom: 14px;
  }
`;

const ModalName = styled.h2`
  flex-grow: 1;
  font-size: 15px;
  line-height: 18px;

  ${up.tablet} {
    text-align: center;
    flex-grow: 0;
    font-weight: 600;
    font-size: 18px;
    line-height: 25px;
  }
`;

const Content = styled.p`
  display: block;
  max-width: 460px;
  overflow: hidden;

  font-size: 14px;
  line-height: 22px;
  ${styles.breakWord}
`;

const CloseButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px;
  margin-top: 30px;
  font-size: 15px;
  line-height: 18px;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 100px;
`;

function ViewBioModal({ username, bio, isMobile, close }) {
  return (
    <Wrapper>
      <DescriptionHeaderStyled>
        <ModalName>{`${username}'s bio`}</ModalName>
        {!isMobile ? <CloseButtonStyled onClick={close} /> : null}
      </DescriptionHeaderStyled>
      <Content>{bio}</Content>
      {isMobile ? <CloseButton onClick={close}>Close</CloseButton> : null}
    </Wrapper>
  );
}

ViewBioModal.propTypes = {
  username: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,

  close: PropTypes.func.isRequired,
};

ViewBioModal.defaultProps = {
  isMobile: false,
};

export default memo(ViewBioModal);

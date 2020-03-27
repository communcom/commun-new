import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Button } from '@commun/ui';
import { Title } from 'components/modals/SignUp/commonStyled';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px 20px 20px;
`;

const Circle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #fdeaef;
`;

const AttentionIcon = styled(Icon).attrs({ name: 'attention' })`
  width: 28px;
  height: 24px;
  color: ${({ theme }) => theme.colors.red};
`;

const Description = styled.p`
  margin-top: 5px;
  font-weight: 500;
  font-size: 17px;
  line-height: 24px;
  text-align: center;
`;

const Text = styled.p`
  margin: 15px 0 34px;
  font-weight: 500;
  font-size: 15px;
  line-height: 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
`;

const ButtonStyled = styled(Button)`
  display: block;
  width: 100%;
  margin-top: 10px;
`;

export default function AttentionScreen(props) {
  const {
    title,
    description,
    text,
    firstButtonText,
    firstButtonDisabled,
    firstButtonClick,
    secondButtonText,
    secondButtonClick,
  } = props;

  return (
    <Wrapper>
      <Circle>
        <AttentionIcon />
      </Circle>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <Text dangerouslySetInnerHTML={{ __html: text }} />
      {firstButtonText ? (
        <ButtonStyled primary big disabled={firstButtonDisabled} onClick={firstButtonClick}>
          {firstButtonText}
        </ButtonStyled>
      ) : null}
      {secondButtonText ? (
        <ButtonStyled big onClick={secondButtonClick}>
          {secondButtonText}
        </ButtonStyled>
      ) : null}
    </Wrapper>
  );
}

AttentionScreen.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  firstButtonText: PropTypes.string.isRequired,
  firstButtonDisabled: PropTypes.bool,
  firstButtonClick: PropTypes.func.isRequired,
  secondButtonText: PropTypes.string.isRequired,
  secondButtonClick: PropTypes.func.isRequired,
};

AttentionScreen.defaultProps = {
  firstButtonDisabled: false,
};

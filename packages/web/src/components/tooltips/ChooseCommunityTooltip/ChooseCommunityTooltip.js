import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'shared/routes';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';
import { IS_CHOOSE_COMMUNITY_TOOLTIP_SHOWED } from 'shared/constants';
import { useTranslation } from 'shared/i18n';

const Wrapper = styled.div`
  /* TODO: will be added later */
  display: none;

  ${up.mobileLandscape} {
    position: absolute;
    bottom: calc(100% + 12px);
    left: calc(100% - 40px);
    z-index: 5;
    display: flex;
    flex-direction: column;
    width: 243px;
    max-width: 243px;
    padding: 12px;
    background-color: #fff;
    color: #000;
    box-shadow: 0 1px 25px rgba(0, 0, 0, 0.25);
    border-radius: 6px;

    &::after {
      content: '';
      position: absolute;
      left: 27px;
      bottom: -7px;
      z-index: 2;
      display: block;
      width: 10px;
      height: 10px;
      transform: rotate(45deg) translateX(-50%);
      background: #fff;
      border-radius: 2px;
    }
  }

  @media (min-width: 820px) {
    bottom: 0;
    left: calc(100% + 12px);

    &::after {
      left: 0;
      bottom: 12px;
    }
  }
`;

const Title = styled.h4`
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
`;

const Desc = styled.p`
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const FaqLink = styled.a`
  align-self: flex-end;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.blue};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const CloseButton = styled.button.attrs({ type: 'button' })`
  position: absolute;
  top: 10px;
  right: 10px;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const CloseIcon = styled(Icon).attrs({ name: 'close' })`
  width: 18px;
  height: 18px;
`;

function ChooseCommunityTooltip({ onClose, onCloseEditor, className }) {
  const { t } = useTranslation();

  useEffect(
    () => () => {
      sessionStorage.setItem(IS_CHOOSE_COMMUNITY_TOOLTIP_SHOWED, true);
    },
    []
  );

  return (
    <Wrapper className={className}>
      <Title>{t('tooltips.choose_community.title')}</Title>
      <Desc>{t('tooltips.choose_community.desc')}</Desc>
      <Link route="faq" passHref>
        <FaqLink onClick={onCloseEditor}>{t('common.learn_more')}</FaqLink>
      </Link>
      <CloseButton aria-label="Close tooltip" onClick={onClose}>
        <CloseIcon />
      </CloseButton>
    </Wrapper>
  );
}

ChooseCommunityTooltip.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCloseEditor: PropTypes.func.isRequired,
};

export default ChooseCommunityTooltip;

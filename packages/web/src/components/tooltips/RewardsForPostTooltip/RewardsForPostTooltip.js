import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNot } from 'styled-is';
import { Link } from 'shared/routes';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';
import { ONBOARDING_TOOLTIP_TYPE, DISABLE_TOOLTIPS_KEY } from 'shared/constants';
import { useTranslation } from 'shared/i18n';
import { setFieldValue } from 'utils/localStore';

const Wrapper = styled.div`
  position: absolute;
  bottom: calc(100% + 16px);
  right: -10px;
  z-index: 5;
  width: 310px;
  max-width: 310px;
  padding: 12px 15px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  box-shadow: 0 1px 25px rgba(0, 0, 0, 0.25);
  border-radius: 6px;

  &::after {
    content: '';
    position: absolute;
    right: 40px;
    bottom: -4px;
    z-index: 2;
    display: block;
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    background: ${({ theme }) => theme.colors.white};
    border-radius: 2px;
  }

  ${isNot('isAuthorized')`
    right: 9px !important;

    &::after {
      right: 48px !important;
    }
  `};

  ${up.mobileLandscape} {
    top: calc(100% + 16px);
    bottom: unset;
    right: -10px;

    &::after {
      top: -4px;
      bottom: unset;
      right: 40px;
    }
  }

  ${up.desktop} {
    bottom: -30px;
    top: unset;
    right: unset !important;
    left: calc(100% + 12px);

    &::after {
      top: unset;
      bottom: 40px;
      left: -4px;
      right: unset !important;
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

const Action = styled.button.attrs({ type: 'button' })`
  appearance: none;
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

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
`;

function RewardForPostTooltip({ isAuthorized, onClose, onCloseEditor, className }) {
  const { t } = useTranslation();

  function onDisableTooltips() {
    setFieldValue(DISABLE_TOOLTIPS_KEY, ONBOARDING_TOOLTIP_TYPE.REWARDS_FOR_POST, true);
    onClose();
  }

  return (
    <Wrapper isAuthorized={isAuthorized} className={className}>
      <Title>{t('tooltips.reward_for_post.title')}</Title>
      <Desc>
        {/* TODO: get time from community settings */}
        {t('tooltips.reward_for_post.desc', { hours: 48 })}
      </Desc>
      <Actions>
        <Action onClick={onDisableTooltips}>{t('tooltips.common.dont_show')}</Action>
        <Link route="faq" passHref>
          <Action as="a" onClick={onCloseEditor}>
            {t('common.learn_more')}
          </Action>
        </Link>
      </Actions>
      <CloseButton aria-label={t('tooltips.common.close')} onClick={onClose}>
        <CloseIcon />
      </CloseButton>
    </Wrapper>
  );
}

RewardForPostTooltip.propTypes = {
  isAuthorized: PropTypes.bool,

  onClose: PropTypes.func.isRequired,
  onCloseEditor: PropTypes.func.isRequired,
};

RewardForPostTooltip.defaultProps = {
  isAuthorized: false,
};

export default RewardForPostTooltip;

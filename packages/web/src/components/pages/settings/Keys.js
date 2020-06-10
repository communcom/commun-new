import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Panel, up } from '@commun/ui';
import { useTranslation } from 'shared/i18n';
import { displaySuccess, displayError } from 'utils/toastsMessages';

const KeyPanel = styled.section`
  display: flex;
  flex-direction: column;

  padding: 16px 0;
`;

const Title = styled.h4`
  margin-bottom: 4px;

  font-size: 15px;
  font-weight: bold;
`;

const Description = styled.p`
  margin-bottom: 16px;

  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const Password = styled.p`
  padding: 10px 57px 10px 16px;

  background: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 8px;
  word-wrap: break-word;

  ${up.tablet} {
    padding: 15px 57px 15px 16px;
  }
`;

const CopyButton = styled.button.attrs({ type: 'button' })`
  position: absolute;

  top: 18px;
  right: 14px;
  width: 20px;
  height: 20px;

  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blue};
  }

  ${up.mobileLandscape} {
    top: 7px;
  }

  ${up.tablet} {
    top: 25px;
  }
`;

const CopyIcon = styled(Icon).attrs({ name: 'copy' })`
  width: 20px;
  height: 20px;
`;

export default function Keys({ publicKeys }) {
  const { t } = useTranslation();

  const renderKeys = (keysList = publicKeys) => {
    const keys = [
      // TODO
      // {
      //   role: 'posting',
      //   title: 'Posting key',
      //   description: 'Allows you to make publications',
      // },
      {
        role: 'active',
      },
      {
        role: 'owner',
      },
    ];

    const onCopyKey = (e, key) => {
      try {
        navigator.clipboard.writeText(key);
        displaySuccess(t('components.settings.keys.messages.copied'));
        e.target.blur();
      } catch (err) {
        displayError(t('components.settings.keys.messages.copy_failed'), err);
      }
    };

    return keys.map(({ role }) => (
      <KeyPanel key={role}>
        <Title>{t(`components.settings.keys.${role}.title`)}</Title>
        <Description>{t(`components.settings.keys.${role}.description`)}</Description>
        <PasswordWrapper>
          <Password>{keysList[role]}</Password>
          <CopyButton
            aria-label={t(`components.settings.keys.copy`)}
            onClick={e => onCopyKey(e, keysList[role])}
          >
            <CopyIcon />
          </CopyButton>
        </PasswordWrapper>
      </KeyPanel>
    ));
  };
  return <Panel title={t(`components.settings.keys.title`)}>{renderKeys(publicKeys)}</Panel>;
}

Keys.propTypes = {
  publicKeys: PropTypes.shape({}).isRequired,
};

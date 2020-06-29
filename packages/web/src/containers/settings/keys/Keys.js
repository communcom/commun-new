import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fromSeed } from 'commun-client/lib/auth';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Button, Panel, up } from '@commun/ui';

import { useTranslation } from 'shared/i18n';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { SHOW_MODAL_PASSWORD } from 'store/constants';

const PanelTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

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

export default function Keys({ currentUserId, publicKeys, openModal, fetchAccountPermissions }) {
  const { t } = useTranslation();
  const [isShowPrivateKeys, setShowPrivateKeys] = useState(false);
  const [password, setPassword] = useState(null);

  useEffect(() => {
    async function mount() {
      try {
        await fetchAccountPermissions();
      } catch (err) {
        // eslint-disable-next-line
        console.warn(err);
      }
    }

    mount();
  }, [fetchAccountPermissions]);

  async function showKeys() {
    if (!isShowPrivateKeys) {
      if (!password) {
        const userPassword = await openModal(SHOW_MODAL_PASSWORD);
        setPassword(userPassword);
      }

      setShowPrivateKeys(true);
    } else {
      setShowPrivateKeys(false);
    }
  }

  function renderKeys(keysList = publicKeys) {
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

    function getPrivateKey(role) {
      return fromSeed(currentUserId, password, role);
    }

    function onCopyKey(e, key) {
      try {
        navigator.clipboard.writeText(key);
        displaySuccess(t('components.settings.keys.messages.copied'));
        e.target.blur();
      } catch (err) {
        displayError(t('components.settings.keys.messages.copy_failed'), err);
      }
    }

    return keys.map(({ role }) => (
      <KeyPanel key={role}>
        <Title>{t(`components.settings.keys.${role}.title`)}</Title>
        <Description>{t(`components.settings.keys.${role}.description`)}</Description>
        <PasswordWrapper>
          <Password>{isShowPrivateKeys ? getPrivateKey(role) : keysList[role]}</Password>
          <CopyButton
            aria-label={t('components.settings.keys.copy')}
            onClick={e => onCopyKey(e, keysList[role])}
          >
            <CopyIcon />
          </CopyButton>
        </PasswordWrapper>
      </KeyPanel>
    ));
  }

  return (
    <Panel
      title={
        <PanelTitle>
          {t(`components.settings.keys.${isShowPrivateKeys ? 'title_private' : 'title'}`)}
          <Button primary onClick={showKeys}>
            {t(
              `components.settings.keys.${
                isShowPrivateKeys ? 'show_public_keys' : 'show_private_keys'
              }`
            )}
          </Button>
        </PanelTitle>
      }
    >
      {renderKeys(publicKeys)}
    </Panel>
  );
}

Keys.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  publicKeys: PropTypes.shape({}).isRequired,

  openModal: PropTypes.func.isRequired,
  fetchAccountPermissions: PropTypes.func.isRequired,
};

import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import commun from 'commun-client';
import { generateKeys } from 'commun-client/lib/auth';
import styled from 'styled-components';

import { Button, CheckBox, Input, Panel } from '@commun/ui';

import { withTranslation } from 'shared/i18n';
import { secondsToDays } from 'utils/time';
import { displayError, displaySuccess } from 'utils/toastsMessages';

const RulesBlock = styled.div`
  padding: 13px 18px;
  margin-bottom: 28px;
  border: 1px solid ${({ theme }) => theme.colors.blue};
  border-radius: 6px;
`;

const Ol = styled.ol`
  list-style: none;
  counter-reset: li;
  margin: 0 0 0 15px;
`;

const Li = styled.li`
  counter-increment: li;
  font-size: 15px;

  &::before {
    content: counter(li);
    display: inline-block;
    width: 1em;
    margin-left: -1.75em;
    margin-right: 10px;

    font-weight: 900;
    font-size: 14px;
    text-align: right;
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const DelayWarning = styled.div`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.lightRed};
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;

  &:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const Hint = styled.div`
  margin-top: 15px;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.grey};
`;

const LabelCheckBox = styled.label`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;

  & > :first-child {
    margin-right: 16px;
  }
`;

const FormError = styled.span`
  margin-top: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.lightRed};
`;

const Agrees = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 0;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px 0;
`;

// eslint-disable-next-line no-unused-vars
const ResetKeys = ({
  currentUserId,
  currentUsername,
  publicKeys,
  permissions,
  fetchAccountPermissions,
  changePassword,
  t,
}) => {
  const { handleSubmit, control, watch, errors, formState } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  function extractOwnerKey(password) {
    const ownerKey = publicKeys?.owner;

    let keyPair = commun.getActualAuth(currentUserId, password, 'owner');

    if (!ownerKey || keyPair.publicKey === ownerKey) {
      return keyPair.privateKey;
    }

    if (currentUsername) {
      keyPair = commun.getActualAuth(currentUsername, password, 'owner');

      if (!ownerKey || keyPair.publicKey === ownerKey) {
        return keyPair.privateKey;
      }
    }

    return null;
  }

  function validateCurrentPassword(password) {
    if (!password) {
      return t('common.required');
    }

    try {
      const ownerKey = extractOwnerKey(password);

      if (!ownerKey) {
        return t('components.settings.new_keys.errors.wrong_password');
      }
    } catch (err) {
      return t('components.settings.new_keys.errors.wrong_password');
    }

    return true;
  }

  function getNecessaryDelay(permissions, role) {
    const ownerPerm = permissions.find(({ perm_name }) => perm_name === role);

    if (!ownerPerm) {
      throw new Error(t('components.settings.new_keys.toastsMessages.owner_not_found'));
    }

    const { threshold, keys, waits } = ownerPerm.required_auth;

    if (!waits || waits.length === 0) {
      return 0;
    }

    const keyWeight = keys[0]?.weight || 0;
    const waitWeight = waits[0].weight;

    if (keyWeight >= threshold || keyWeight + waitWeight < threshold) {
      return 0;
    }

    return waits[0].wait_sec;
  }

  async function onSubmit(data) {
    const { currentPassword, newPassword } = data;
    const generatedKeys = await generateKeys(currentUserId, newPassword);

    if (!publicKeys) {
      displayError(t('components.settings.new_keys.toastsMessages.keys_not_found'));
      return;
    }

    const availableRoles = Object.keys(publicKeys);
    const pubKeys = {};

    for (const role of availableRoles) {
      pubKeys[role] = generatedKeys[role].publicKey;
    }

    const ownerKey = extractOwnerKey(currentPassword);

    if (!ownerKey) {
      displayError(t('components.settings.new_keys.toastsMessages.cant_extract'));
      return;
    }

    let delay;

    try {
      delay = getNecessaryDelay(permissions, 'owner');
    } catch (err) {
      displayError(err);
      return;
    }

    try {
      await changePassword({
        ownerKey,
        publicKeys: pubKeys,
        availableRoles,
        delaySec: delay,
      });
    } catch (err) {
      displayError(err);
      return;
    }

    if (delay) {
      displaySuccess(
        t('components.settings.new_keys.toastsMessages.password_dalay', {
          delay: secondsToDays(delay),
        })
      );
    } else {
      displaySuccess(t('components.settings.new_keys.toastsMessages.password_updated'));
    }
  }

  useEffect(() => {
    fetchAccountPermissions();
  }, [fetchAccountPermissions]);

  function renderRules() {
    const rules = t('components.settings.new_keys.password_rules', { returnObjects: true });

    return (
      <Ol>
        {rules.map((rule, key) => {
          if (key === 1) {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Li key={key}>
                <strong>{rule}</strong>
              </Li>
            );
          }

          // eslint-disable-next-line react/no-array-index-key
          return <Li key={key}>{rule}</Li>;
        })}
      </Ol>
    );
  }

  let delay;

  if (permissions) {
    try {
      delay = getNecessaryDelay(permissions, 'owner');
    } catch {}
  }

  return (
    <Panel title={t('components.settings.new_keys.title')}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RulesBlock>{renderRules()}</RulesBlock>
        {delay ? (
          <DelayWarning>
            {t('components.settings.new_keys.delay_warning', { delay: secondsToDays(delay) })}
          </DelayWarning>
        ) : null}
        <FieldGroup>
          <Controller
            name="currentPassword"
            control={control}
            as={
              <Input
                type="password"
                title={t('components.settings.new_keys.fields.currentPassword')}
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="current-password"
                spellCheck="false"
              />
            }
            rules={{ required: t('common.required'), validate: validateCurrentPassword }}
          />
          {errors.currentPassword && <FormError>{errors.currentPassword.message}</FormError>}
        </FieldGroup>
        <FieldGroup>
          <Controller
            name="newPassword"
            control={control}
            as={
              <Input
                type="password"
                title={t('components.settings.new_keys.fields.newPassword')}
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="new-password"
                spellCheck="false"
              />
            }
            rules={{
              required: t('common.required'),
              validate: value =>
                value !== watch('currentPassword') ||
                t('components.settings.new_keys.errors.passwords_same'),
            }}
          />
          {errors.newPassword && <FormError>{errors.newPassword.message}</FormError>}
          <Hint>{t('components.settings.new_keys.backup_password_by_storing_it')}</Hint>
        </FieldGroup>
        <FieldGroup>
          <Controller
            name="confirmNewPassword"
            control={control}
            as={
              <Input
                type="password"
                title={t('components.settings.new_keys.fields.confirmNewPassword')}
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="new-password"
                spellCheck="false"
              />
            }
            rules={{
              required: t('common.required'),
              validate: value =>
                value === watch('newPassword') ||
                t('components.settings.new_keys.errors.passwords_do_not_match'),
            }}
          />
          {errors.confirmNewPassword && <FormError>{errors.confirmNewPassword.message}</FormError>}
        </FieldGroup>
        <Agrees>
          <FieldGroup>
            <LabelCheckBox>
              <Controller
                name="confirmCheck"
                control={control}
                as={<CheckBox />}
                rules={{ required: true }}
              />
              {t('components.settings.new_keys.cannot_recover_password')}
            </LabelCheckBox>
          </FieldGroup>
          <FieldGroup>
            <LabelCheckBox>
              <Controller
                name="confirmSaved"
                control={control}
                as={<CheckBox />}
                rules={{ required: true }}
              />
              {t('components.settings.new_keys.i_saved_password')}
            </LabelCheckBox>
          </FieldGroup>
        </Agrees>
        <Footer>
          <Button type="submit" medium danger disabled={!formState.isValid}>
            {t('common.update')}
          </Button>
        </Footer>
      </form>
    </Panel>
  );
};

ResetKeys.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  currentUsername: PropTypes.string.isRequired,
  publicKeys: PropTypes.object.isRequired,
  permissions: PropTypes.arrayOf(PropTypes.object),

  fetchAccountPermissions: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
};

ResetKeys.defaultProps = {
  permissions: null,
};

export default withTranslation()(ResetKeys);

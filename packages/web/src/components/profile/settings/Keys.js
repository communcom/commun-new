import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { Icon } from '@commun/icons';
import { Panel } from '@commun/ui';
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
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const Password = styled.p`
  padding: 10px 57px 10px 16px;

  background: ${({ theme }) => theme.colors.contextWhite};
  border-radius: 8px;
  word-wrap: break-word;

  ${up('tablet')} {
    padding: 15px 57px 15px 16px;
  }
`;

const CopyButton = styled.button.attrs({ type: 'button' })`
  position: absolute;

  top: 18px;
  right: 14px;
  width: 20px;
  height: 20px;

  color: ${({ theme }) => theme.colors.contextGrey};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlue};
  }

  ${up('mobileLandscape')} {
    top: 7px;
  }

  ${up('tablet')} {
    top: 25px;
  }
`;

const CopyIcon = styled(Icon).attrs({ name: 'copy' })`
  width: 20px;
  height: 20px;
`;

export default function Keys({ publicKeys }) {
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
        title: 'Active key',
        description: 'Allows you to transfer points',
      },

      {
        role: 'owner',
        title: 'Owner key',
        description: 'Full access',
      },
    ];

    const onCopyKey = (e, key) => {
      try {
        navigator.clipboard.writeText(key);
        displaySuccess('Key was copied to clipboard!');
        e.target.blur();
      } catch (err) {
        displayError('Copy to clipboard failed!', err);
      }
    };

    return keys.map(({ role, title, description }) => (
      <KeyPanel key={role}>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <PasswordWrapper>
          <Password>{keysList[role]}</Password>
          <CopyButton aria-label="Copy key" onClick={e => onCopyKey(e, keysList[role])}>
            <CopyIcon />
          </CopyButton>
        </PasswordWrapper>
      </KeyPanel>
    ));
  };
  return <Panel title="Keys">{renderKeys(publicKeys)}</Panel>;
}

Keys.propTypes = {
  publicKeys: PropTypes.shape({}).isRequired,
};

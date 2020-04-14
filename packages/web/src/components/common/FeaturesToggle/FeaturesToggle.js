import React, { useState, useCallback, memo } from 'react';
import styled from 'styled-components';
import { map } from 'ramda';
import flopFlip, { updateFlags } from '@flopflip/memory-adapter';
import cookie from 'cookie';

import { Switch } from '@commun/ui';

import defaultFlags from 'shared/featureFlags';
import { COOKIE_ALL_FEATURES } from 'shared/constants';
import { useKeyboardEvent } from 'utils/hooks';
import { setCookie, resetCookie } from 'utils/cookies';

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 55;

  margin: 10px;
  padding: 10px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const LabelStyled = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:not(:last-child) {
    margin-bottom: 2px;
  }
`;

const SwitchStyled = styled(Switch)`
  margin: 5px 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FeaturesToggle = memo(() => {
  const [isToggled, setToggle] = useState(() => {
    if (process.browser) {
      const cookies = cookie.parse(document.cookie);
      return Boolean(cookies[COOKIE_ALL_FEATURES]);
    }

    return false;
  });

  // Toggle all features
  const onToggleFeatures = useCallback(() => {
    setToggle(state => {
      const newState = !state;

      let flags;

      if (newState) {
        flags = map(() => true, defaultFlags);
      } else {
        flags = defaultFlags;
      }

      try {
        if (newState) {
          setCookie(COOKIE_ALL_FEATURES, '1', { years: 1 });
        } else {
          resetCookie(COOKIE_ALL_FEATURES);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }

      flopFlip.waitUntilConfigured().then(() => {
        updateFlags(flags);
      });

      return newState;
    });
  }, []);

  return (
    <Wrapper>
      <LabelStyled>
        Turn on all
        <SwitchStyled value={isToggled} name="features__turn-on-all" onChange={onToggleFeatures} />
      </LabelStyled>
    </Wrapper>
  );
});

export default function() {
  const [isShow, setShow] = useState(false);

  useKeyboardEvent('mod+i', () => setShow(state => !state));

  if (!isShow) {
    return null;
  }

  return <FeaturesToggle />;
}

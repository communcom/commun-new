import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cookie from 'cookie';
import styled from 'styled-components';
import is from 'styled-is';

import { Button, up } from '@commun/ui';

import { DOC_COOKIES_POLICY_LINK } from 'shared/constants';
import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

const Wrapper = styled.div`
  position: fixed;
  z-index: 11;
  max-width: 196px;
  bottom: 70px;
  left: 50%;
  padding: 15px;
  margin-left: -98px;
  border-radius: 15px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: -1px 9px 56px rgba(184, 191, 221, 0.16);

  ${up.tablet} {
    bottom: 30px;
    right: 60px;
    left: auto;
    margin-left: auto;
  }

  ${is('isDark')`
    box-shadow: 0 5px 22px rgba(0, 0, 0, 0.5);
  `};
`;

const Text = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  margin-bottom: 10px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;

  & > :not(:last-child) {
    margin-right: 15px;
  }
`;

const ButtonStyled = styled(Button)`
  min-width: 78px;
  font-size: 12px;
`;

const ReadMoreLink = styled(Link).attrs({ as: 'a' })`
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.blue};
  text-decoration: none;
`;

export default function CookiesPermission({ isDark }) {
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const cookies = document.cookie ? cookie.parse(document.cookie) : {};

    if (!cookies.commun_cookie_accept) {
      setIsShow(true);
    }
  }, []);

  function onAccept() {
    // 31104000000 === 1 year
    const expires = new Date(Date.now() + 31104000000).toGMTString();
    document.cookie = `commun_cookie_accept=1; path=/; expires=${expires}`;

    setIsShow(false);
  }

  if (!isShow) {
    return null;
  }

  return (
    <Wrapper isDark={isDark}>
      <Text>{t('components.cookies.text')}</Text>
      <Actions>
        <ButtonStyled small onClick={onAccept}>
          {t('common.accept')}
        </ButtonStyled>
        <ReadMoreLink href={DOC_COOKIES_POLICY_LINK} target="_blank" rel="noopener noreferrer">
          {t('common.read_more')}
        </ReadMoreLink>
      </Actions>
    </Wrapper>
  );
}

CookiesPermission.propTypes = {
  isDark: PropTypes.bool.isRequired,
};

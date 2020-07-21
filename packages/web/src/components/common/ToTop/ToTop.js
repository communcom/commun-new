import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import { darken } from 'polished';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { CONTAINER_DESKTOP_PADDING } from '@commun/ui';

import { useTranslation } from 'shared/i18n';

import { HEADER_DESKTOP_HEIGHT } from 'components/common/Header';

const OFFSET = HEADER_DESKTOP_HEIGHT + CONTAINER_DESKTOP_PADDING;
const WIDTH = 120;

const Content = styled.div`
  width: ${WIDTH}px;
  height: 100%;
  padding-top: ${OFFSET}px;
  color: ${({ theme }) => darken(0.2, theme.colors.lightGrayBlue)};
  transition: background-color 200ms linear, opacity 200ms linear, color 200ms linear;
`;

const Wrapper = styled.div`
  position: fixed;
  display: none;
  top: 0;
  left: 0;
  bottom: 0;

  ${is('isShow', 'isVisible')`
    display: block;
    cursor: pointer;
  `}

  &:hover {
    ${Content} {
      background-color: ${({ theme }) => darken(0.02, theme.colors.lightGrayBlue)};
      color: ${({ theme }) => theme.colors.blue};
    }
  }
`;

const Text = styled.div`
  margin: 0 20px;
  font-size: 12.5px;
  font-weight: 700;
  white-space: nowrap;
`;

const ArrowIcon = styled(Icon).attrs({ name: 'upvote' })`
  display: inline-block;
  margin-right: 8px;
  vertical-align: bottom;
`;

const ToTop = ({ mainContainerRef }) => {
  const { t } = useTranslation();
  const toTopRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [isShow, setIsShow] = useState(false);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

      const opacity = (scrollTop - OFFSET) / 500;

      if (opacity >= 1) {
        setIsShow(true);
        toTopRef.current.style.opacity = 1;
      } else if (opacity <= 0) {
        setIsShow(false);
        toTopRef.current.style.opacity = 0;
      } else {
        setIsShow(true);
        toTopRef.current.style.opacity = opacity.toFixed(2);
      }
    }, 50);

    const handleResize = throttle(() => {
      const width = mainContainerRef.current.offsetLeft - WIDTH;

      if (width >= 0) {
        toTopRef.current.style.width = `${mainContainerRef.current.offsetLeft}px`;
      }

      setIsVisible(width >= 0);
    }, 100);

    handleScroll();
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      handleScroll.cancel();
      handleResize.cancel();
    };
  }, [mainContainerRef]);

  function handleClick() {
    if (!isVisible) {
      return;
    }

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  return (
    <Wrapper ref={toTopRef} isVisible={isVisible} isShow={isShow} onClick={handleClick}>
      <Content>
        <Text>
          <ArrowIcon />
          {t('common.go_up')}
        </Text>
      </Content>
    </Wrapper>
  );
};

ToTop.propTypes = {
  mainContainerRef: PropTypes.shape({ current: PropTypes.object }).isRequired,
};

export default ToTop;

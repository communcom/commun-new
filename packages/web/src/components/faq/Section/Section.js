import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import {
  CONTAINER_DESKTOP_PADDING,
  // Button,
  up,
} from '@commun/ui';
import { HEADER_DESKTOP_HEIGHT } from 'components/common/Header';
// import { Icon } from '@commun/icons';
import { useTranslation } from 'shared/i18n';
import { DOC_WHITEPAPER_LINK } from 'shared/constants';

const Wrapper = styled.div`
  padding: 15px 15px 20px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 10px;

  ${isNot('isOpen')`
    padding: 15px;
  `};

  &:not(:last-of-type) {
    margin-bottom: 10px;
  }

  ${up.tablet} {
    padding: 0;
    border-radius: 0;

    &:not(:last-of-type) {
      margin-bottom: 40px;
    }
  }
`;

const Title = styled.h2`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.black};

  ${up.tablet} {
    font-weight: bold;
    font-size: 30px;
    line-height: 41px;
    margin-bottom: 15px;
  }
`;

const Anchor = styled.a`
  position: absolute;
  left: 0px;
  top: -${HEADER_DESKTOP_HEIGHT + CONTAINER_DESKTOP_PADDING}px;
`;

/*
const CollapseButton = styled.button.attrs({ type: 'button' })`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin: 3px 0 0 10px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  overflow: hidden;

  &:hover {
    color: #fff;
    background-color: ${({ theme }) => theme.colors.blue};
  }
`;

const CollapseIcon = styled(Icon).attrs({ name: 'chevron' })`
  margin-bottom: -2px;
  transform: rotate(0);
  transition: transform 0.1s;

  ${is('isOpen')`
    transform: rotate(0.5turn);
  `};
`;
 */

const Description = styled.p`
  margin-top: 10px;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.black};

  ${up.tablet} {
    font-size: 18px;
    line-height: 26px;
  }
`;

const Content = styled.div`
  position: relative;

  ${up.tablet} {
    ${is('isChildren')`
        padding-left: 17px;

        ${Title} {
          font-size: 24px;
          line-height: 1;
          color: ${({ theme }) => theme.colors.blue};
          margin-bottom: 10px;
        }

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 5px;
          background: ${({ theme }) => theme.colors.blue};
          border-radius: 0 5px 5px 0;
        }
    `}
  }
`;

const Image = styled.img`
  max-width: 100%;
  margin-top: 15px;

  ${up.tablet} {
    margin-top: 20px;
  }
`;

/*
const ButtonStyled = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  width: 100%;

  ${up.tablet} {
    width: auto;
  }
`;

const IconStyled = styled(Icon).attrs({ name: 'discussion' })`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;
 */

export default function Section({
  section,
  isChildren,
  // isMobile, idOpened, setIdOpened
}) {
  const { t } = useTranslation(['page_faq']);
  const sectionRef = useRef();
  // const isCurrentOpen = idOpened === section.id;

  // TODO: temp decision
  const showWide = true;

  /*
  function onCollapseClick() {
    if (isCurrentOpen) {
      setIdOpened(null);
      return;
    }

    setIdOpened(section.id);
    window.scrollTo(0, sectionRef.current.offsetTop);
  }
  */

  return (
    <Wrapper ref={sectionRef} isOpen={showWide}>
      <Content isChildren={isChildren}>
        <Title>
          <Anchor id={section.id} />
          {t(`faq.sections.${section.id}.title`)}
          {/* {isMobile ? ( */}
          {/*  <CollapseButton onClick={onCollapseClick}> */}
          {/*    <CollapseIcon isOpen={showWide} /> */}
          {/*  </CollapseButton> */}
          {/* ) : null} */}
        </Title>
        {showWide ? (
          <Description
            dangerouslySetInnerHTML={{
              __html: t(`faq.sections.${section.id}.description`, { DOC_WHITEPAPER_LINK }),
            }}
          />
        ) : null}
      </Content>

      {showWide ? (
        <>
          {section.imageUrl ? (
            <Image src={section.imageUrl} alt={t(`faq.sections.${section.id}.title`)} />
          ) : null}
          {section.component ? <section.component /> : null}

          {/* TODO: links */}
          {/* <ButtonStyled hollow={!isMobile} medium={!isMobile} big={isMobile}> */}
          {/*  <IconStyled /> */}
          {/*  Go to the discussion */}
          {/* </ButtonStyled> */}
        </>
      ) : null}
    </Wrapper>
  );
}

Section.propTypes = {
  section: PropTypes.object.isRequired,
  isChildren: PropTypes.bool.isRequired,
  /*
  isMobile: PropTypes.bool.isRequired,
  idOpened: PropTypes.string,
  setIdOpened: PropTypes.func.isRequired,
   */
};

/*
Section.defaultProps = {
  idOpened: null,
};
 */

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import by from 'styled-by';
import { Link } from 'shared/routes';

import { up } from '@commun/ui';
import {
  DISABLE_TOOLTIPS_KEY,
  FEED_ONBOARDING_TOOLTIP_TYPES,
  FEED_ONBOARDING_TOOLTIP_TYPE,
  POST_VOTE_PANEL_NAME,
  POST_COMMENTS_LINK_NAME,
  POST_SHARE_BUTTON_NAME,
  REWARDS_BADGE_NAME,
} from 'shared/constants';
import { setFieldValue } from 'utils/localStore';

const Wrapper = styled.div`
  position: relative;
  left: 0;
  z-index: 2;
  display: flex;
  width: 100%;
  min-height: 140px;
  padding: 12px 15px 12px 10px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.blue};
  box-shadow: 0 1px 25px rgba(0, 0, 0, 0.25);
  border-radius: 6px;

  ${up.mobileLandscape} {
    padding: 10px 15px;
  }
`;

const Rect = styled.div`
  position: absolute;
  z-index: 1;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  transform: rotate(45deg) translate(-50%);

  ${({ theme, left }) => `
    background-color: ${theme.colors.blue};
    left: ${left}px;
  `}

  ${by('renderAt', {
    bottom: 'top: 0',
    top: 'bottom: -7px',
  })};
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Content = styled.section`
  color: #fff;
  max-width: 230px;

  ${up.mobileLandscape} {
    max-width: 280px;
  }
`;

const Title = styled.h1`
  padding-bottom: 20px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;

  ${up.mobileLandscape} {
    padding-bottom: 6px;
    line-height: 17px;
  }
`;

const Desc = styled.p`
  padding-bottom: 20px;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: -0.31px;

  ${up.mobileLandscape} {
    padding-bottom: 10px;
    letter-spacing: unset;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Action = styled.button`
  appearance: none;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  text-decoration-line: underline;
  color: #fff;

  ${up.mobileLandscape} {
    line-height: 16px;
  }
`;

const Image = styled.img`
  align-self: center;

  ${by('tooltipType', {
    [FEED_ONBOARDING_TOOLTIP_TYPE.SHARE]: `
      margin: 0 10px 0 0;
      width: 135px;
    `,
    [FEED_ONBOARDING_TOOLTIP_TYPE.COMMENTS]: `
      margin: 16px 20px 16px 5px;
      width: 86px;
    `,
    [FEED_ONBOARDING_TOOLTIP_TYPE.VOTE]: `
      margin: 0 15px 0 0;
      width: 104px;
    `,

    [FEED_ONBOARDING_TOOLTIP_TYPE.REWARD]: `
      margin: 12px 15px 12px 0;
      width: 100px;
    `,
  })};

  ${up.tablet} {
    display: block;

    ${by('tooltipType', {
      [FEED_ONBOARDING_TOOLTIP_TYPE.SHARE]: `
        margin: -10px 10px 0 0;
        width: 160px;
      `,
      [FEED_ONBOARDING_TOOLTIP_TYPE.COMMENTS]: `
        margin: 3px 35px 3px 20px;
        width: 115px;
      `,
      [FEED_ONBOARDING_TOOLTIP_TYPE.VOTE]: `
        margin: 0 15px 0 0;
        width: 155px;
      `,
      [FEED_ONBOARDING_TOOLTIP_TYPE.REWARD]: `
        margin: 7px 47px 7px 7px;
        width: 116px;
      `,
    })};
  }
`;

export default class FeedOnboardingTooltip extends Component {
  static propTypes = {
    renderAt: PropTypes.string,
    tooltipType: PropTypes.string,
    postElement: PropTypes.node,

    onHide: PropTypes.func.isRequired,
  };

  static defaultProps = {
    renderAt: 'bottom',
    tooltipType: null,
    postElement: null,
  };

  onboardingTooltipRef = createRef();

  onDisableTooltips = () => {
    const { onHide, tooltipType } = this.props;

    setFieldValue(DISABLE_TOOLTIPS_KEY, tooltipType, true);
    onHide(false);
  };

  getRectPosition() {
    const { tooltipType, postElement } = this.props;
    const tooltipElement = this.onboardingTooltipRef.current;
    let rectLeft = 0;
    let tooltipTargetElement = null;

    if (tooltipElement && postElement) {
      switch (tooltipType) {
        case FEED_ONBOARDING_TOOLTIP_TYPE.REWARD:
          tooltipTargetElement = postElement.querySelector(`[name=${REWARDS_BADGE_NAME}]`);
          break;
        case FEED_ONBOARDING_TOOLTIP_TYPE.VOTE:
          tooltipTargetElement = postElement.querySelector(`[name=${POST_VOTE_PANEL_NAME}]`);
          break;
        case FEED_ONBOARDING_TOOLTIP_TYPE.COMMENTS:
          tooltipTargetElement = postElement.querySelector(`[name=${POST_COMMENTS_LINK_NAME}]`);
          break;
        case FEED_ONBOARDING_TOOLTIP_TYPE.SHARE:
          tooltipTargetElement = postElement.querySelector(`[name=${POST_SHARE_BUTTON_NAME}]`);
          break;
        default:
          break;
      }

      if (tooltipTargetElement) {
        const { left, right } = tooltipTargetElement.getBoundingClientRect();
        rectLeft = left + (right - left) / 2 - tooltipElement.getBoundingClientRect().left;
      }
    }

    return rectLeft;
  }

  render() {
    const { renderAt, tooltipType, className } = this.props;
    const tooltip = FEED_ONBOARDING_TOOLTIP_TYPES[tooltipType];

    if (!tooltip) {
      return null;
    }

    return (
      <Wrapper ref={this.onboardingTooltipRef} className={className}>
        <Rect left={this.getRectPosition()} renderAt={renderAt} />
        <Image src={tooltip.image} tooltipType={tooltipType} alt="" />
        <RightWrapper>
          <Content>
            <Title>{tooltip.title}</Title>
            <Desc>{tooltip.desc}</Desc>
          </Content>
          <Actions>
            <Action type="button" onClick={this.onDisableTooltips}>
              Don’t show this again
            </Action>
            <Link route="faq" passHref>
              <Action as="a">Learn more</Action>
            </Link>
          </Actions>
        </RightWrapper>
      </Wrapper>
    );
  }
}

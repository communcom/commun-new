import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Avatar from 'components/common/Avatar';

const DEGREE = 0.017453292519943295; // Math.PI / 180;
const DEGREE_90 = DEGREE * 90;

const R = 25;

const offset = {
  x: R + 2,
  y: 2,
};

const shift = {
  x: 2.17,
  y: 0.1,
};

const PATTERN = `<svg width="54" height="54" fill="none" xmlns="http://www.w3.org/2000/svg">
  <mask id="_ma">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M26.058 1.972a1.5 1.5 0 01-1.345 1.64 23.608 23.608 0 00-12.61 5.214 1.5 1.5 0 01-1.9-2.322A26.608 26.608 0 0124.418.627a1.5 1.5 0 011.64 1.345zm1.915 0a1.5 1.5 0 011.64-1.344c2.534.252 5.072.876 7.54 1.9a26.493 26.493 0 016.671 3.997 1.5 1.5 0 01-1.904 2.318A23.493 23.493 0 0036.004 5.3a23.493 23.493 0 00-6.687-1.686 1.5 1.5 0 01-1.344-1.642zM8.637 9.968a1.5 1.5 0 01.207 2.11A23.493 23.493 0 005.3 17.996a23.494 23.494 0 00-1.686 6.687 1.5 1.5 0 11-2.985-.297 26.492 26.492 0 011.9-7.54 26.494 26.494 0 013.997-6.67 1.5 1.5 0 012.11-.207zm36.747.023a1.5 1.5 0 012.11.211 26.608 26.608 0 015.878 14.215 1.5 1.5 0 11-2.985.295 23.608 23.608 0 00-5.214-12.61 1.5 1.5 0 01.21-2.11zM1.973 27.941a1.5 1.5 0 011.64 1.345 23.608 23.608 0 005.214 12.61 1.5 1.5 0 11-2.322 1.9A26.608 26.608 0 01.628 29.581a1.5 1.5 0 011.345-1.64zm50.054.031a1.5 1.5 0 011.344 1.641 26.493 26.493 0 01-1.9 7.54 26.495 26.495 0 01-3.997 6.67 1.5 1.5 0 01-2.318-1.903 23.495 23.495 0 003.544-5.917 23.492 23.492 0 001.686-6.687 1.5 1.5 0 011.64-1.344zM9.968 45.362a1.5 1.5 0 012.111-.207 23.494 23.494 0 005.917 3.544 23.495 23.495 0 006.687 1.686 1.5 1.5 0 11-.297 2.985 26.49 26.49 0 01-7.54-1.9 26.493 26.493 0 01-6.67-3.996 1.5 1.5 0 01-.208-2.112zm34.04.021a1.5 1.5 0 01-.211 2.111 26.607 26.607 0 01-14.215 5.878 1.5 1.5 0 01-.295-2.986 23.608 23.608 0 0012.61-5.214 1.5 1.5 0 012.11.211z" fill="#E5E7ED" />
  </mask>
  <g mask="url(#_ma)">
    <path fill="#E5E7ED" d="M0 0h54v54H0z" />
    <path d="$$d" stroke="#6A80F5" stroke-width="3" stroke-linecap="round" />
  </g>
</svg>`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
`;

const BorderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const LeaderAvatar = forwardRef(({ userId, percent, useLink, ...props }, ref) => {
  let d = '';

  if (percent > 0) {
    const displayPercent = percent * 0.98;

    const qPercent = displayPercent * 4;

    const c = 1 - Math.cos(qPercent * DEGREE_90);
    const s = Math.sin(qPercent * DEGREE_90);

    const cr = R * c;
    const sr = R * s;

    // example: d = 'm29.17 2.1 a25 25 0 0 1 22.83 24.9';
    d = [
      `m${offset.x + shift.x} ${offset.y + shift.y}`,
      `a25 25 0 ${displayPercent > 0.5 ? '1' : '0'} 1`,
      `${sr - shift.x} ${cr - shift.y}`,
    ].join(' ');
  }

  const svg = PATTERN.replace('$$d', d);

  return (
    <Wrapper as={useLink ? 'a' : undefined} {...props} ref={ref}>
      <BorderWrapper
        dangerouslySetInnerHTML={{
          __html: svg,
        }}
      />
      <Avatar userId={userId} />
    </Wrapper>
  );
});

LeaderAvatar.propTypes = {
  userId: PropTypes.string.isRequired,
  percent: PropTypes.number,
  useLink: PropTypes.bool,
};

LeaderAvatar.defaultProps = {
  percent: 0,
  useLink: false,
};

export default LeaderAvatar;

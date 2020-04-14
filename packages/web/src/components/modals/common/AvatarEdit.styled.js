import styled from 'styled-components';
import is from 'styled-is';

import { up } from '@commun/ui';
import { Icon } from '@commun/icons';

import { SaveButton, ResetButton } from './common.styled';

export const RANGE_MIN = 1;
export const RANGE_MAX = 2;
export const RANGE_STEP = 0.05;
export const ROTATE_STEP = 90;
export const MOZ_RANGE_THUMB_SIZE = 13;
export const WEBKIT_RANGE_THUMB_SIZE = 15;
export const RANGE_THUMB_SIZE = 15;

export const EditorWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 50px;
  background-color: ${({ theme }) => theme.colors.black};
  overflow: hidden;

  ${up.tablet} {
    margin-bottom: 20px;
  }
`;

export const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 34px;
  padding: 9px 0 8px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.gray};

  ${up.tablet} {
    margin-bottom: 0;
    padding-right: 20px;
  }
`;

export const RangeWrapper = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
  height: 15px;
  margin: 0 10px;

  /* styles for firefox and webkit should be splitted! */
  input[type='range']::-webkit-slider-container {
    display: flex;
    align-items: center;
  }

  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.gray};
    cursor: pointer;
  }

  input[type='range']::-webkit-slider-thumb {
    appearance: none;
    width: ${WEBKIT_RANGE_THUMB_SIZE}px;
    height: ${WEBKIT_RANGE_THUMB_SIZE}px;
    border: 1px solid ${({ theme }) => theme.colors.blue};
    border-radius: 100%;
    background-color: ${({ theme }) => theme.colors.white};
    transform: translateY(-50%);
    cursor: pointer;
  }

  input[type='range']::-moz-range-track {
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.gray};
    cursor: pointer;
  }

  input[type='range']::-moz-range-thumb {
    appearance: none;
    width: ${MOZ_RANGE_THUMB_SIZE}px;
    height: ${MOZ_RANGE_THUMB_SIZE}px;
    border: 1px solid ${({ theme }) => theme.colors.blue};
    border-radius: 100%;
    background-color: ${({ theme }) => theme.colors.white};
    cursor: pointer;
  }

  input[type='range']:focus {
    outline: none !important;
  }

  input[type='range']:focus::-webkit-slider-runnable-track {
    background-color: none !important;
  }
`;

export const RangeFilledLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  content: '';
  display: block;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.blue};
  transform: translateY(-100%);
`;

export const Range = styled.input.attrs({ type: 'range' })`
  width: 100%;
`;

export const ScaleIcon = styled(Icon).attrs({ name: 'mountains' })`
  width: 12px;
  height: 8px;

  ${is('isBig')`
    width: 17px;
    height: 12px;
  `};
`;

export const RotateIcon = styled(Icon).attrs({ name: 'transfer-points' })`
  width: 20px;
  height: 20px;
  transform: rotate(45deg);
`;

export const RotateButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 34px;
  margin-right: 12px;
  color: ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 100%;
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blue};
  }
`;

export const SaveButtonStyled = styled(SaveButton)`
  width: 100%;

  ${up.tablet} {
    width: auto;
    min-width: 80px;
    height: 34px;
    padding: 0px;
  }
`;

export const CancelButton = styled(ResetButton)`
  ${up.tablet} {
    width: auto;
    min-width: 80px;
    height: 34px;
    padding: 10px;
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;

  ${up.tablet} {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
`;

// Styled wrapper doesn't work for AvatarEditor
export const editorStyles = { margin: '-5px 0' };

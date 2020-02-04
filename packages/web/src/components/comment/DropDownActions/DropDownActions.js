import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNot } from 'styled-is';

import { Icon } from '@commun/icons';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';

import { ActionButton } from '../common';

const DropDownMenuStyled = styled(DropDownMenu)`
  ${isNot('inBottom')`
    margin-left: auto;
  `};
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 34px;
  margin-right: -11px;
  color: #000;
`;

const MoreIcon = styled(Icon).attrs({
  name: 'more',
})`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.gray};
`;

export default function DropDownActions({
  isOwner,
  inBottom,
  onReportClick,
  onEditClick,
  onDeleteClick,
  className,
}) {
  return (
    <DropDownMenuStyled
      align="right"
      openAt={inBottom ? 'top' : undefined}
      inBottom={inBottom}
      className={className}
      handler={props =>
        inBottom ? (
          <ActionButton inPost={inBottom} {...props}>
            More
          </ActionButton>
        ) : (
          <Action name="card__more-actions" aria-label="More actions" {...props}>
            <MoreIcon />
          </Action>
        )
      }
      items={() => (
        <>
          {!isOwner ? (
            <DropDownMenuItem name="comment__report" onClick={onReportClick}>
              Report
            </DropDownMenuItem>
          ) : null}
          {isOwner ? (
            <>
              <DropDownMenuItem name="comment__edit" onClick={onEditClick}>
                Edit
              </DropDownMenuItem>
              <DropDownMenuItem name="comment__delete" onClick={onDeleteClick}>
                Delete
              </DropDownMenuItem>
            </>
          ) : null}
        </>
      )}
    />
  );
}

DropDownActions.propTypes = {
  isOwner: PropTypes.bool,
  inBottom: PropTypes.bool,
  onReportClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

DropDownActions.defaultProps = {
  isOwner: false,
  inBottom: false,
};

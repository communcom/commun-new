import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNot } from 'styled-is';

import { Icon } from '@commun/icons';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';

import { ActionButton } from '../common';

const DropDownMenuStyled = styled(DropDownMenu)`
  ${isNot('inPost')`
    margin-left: auto;
  `};
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-right: -11px;
  color: #000;
`;

const MoreIcon = styled(Icon).attrs({
  name: 'vertical-more',
})`
  width: 20px;
  height: 20px;
`;

export default function DropDownActions({ inPost, onEditClick, onDeleteClick }) {
  return (
    <DropDownMenuStyled
      align="right"
      openAt={inPost ? 'top' : undefined}
      inPost={inPost}
      handler={props =>
        inPost ? (
          <ActionButton inPost={inPost} {...props}>
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
          <DropDownMenuItem name="comment__edit" onClick={onEditClick}>
            Edit
          </DropDownMenuItem>
          <DropDownMenuItem name="comment__delete" onClick={onDeleteClick}>
            Delete
          </DropDownMenuItem>
        </>
      )}
    />
  );
}

DropDownActions.propTypes = {
  inPost: PropTypes.bool,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

DropDownActions.defaultProps = {
  inPost: false,
};

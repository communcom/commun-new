import React, { useState, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { usePopup, useEffectOnChange } from 'utils/hooks';
import { Link } from 'shared/routes';

import { extractLinkFromItem } from './common';
import AutocompleteItem from './AutocompleteItem';

const Wrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 11px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 5px 30px rgba(107, 115, 143, 0.15);
  overflow: hidden;
`;

const HeaderBlock = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  padding: 0 15px 1px;
  cursor: pointer;

  ${is('isSomeFound')`
    height: 47px;
    border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
  `};

  ${is('isSelected')`
     background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  `};

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  }
`;

const HeaderText = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.blue};
`;

const ArrowIcon = styled(Icon).attrs({ name: 'arrow-back' })`
  width: 8px;
  height: 12px;
  margin-right: 4px;
  color: ${({ theme }) => theme.colors.gray};
  transform: rotate(180deg);
`;

const List = styled.ul`
  padding: 5px 0;
`;

function AutocompleteResults({ searchState, searchText, panelRef }, ref) {
  const { isOpen, open, close } = usePopup(panelRef);
  const [index, setIndex] = useState(0);

  useEffectOnChange(open, [searchState.items]);

  // +1 because of one item used for row "search all"
  const itemsCount = searchState.items.length + 1;

  useImperativeHandle(
    ref,
    () => ({
      open,
      moveCursorUp() {
        if (index === null || index === 0 || index > itemsCount) {
          setIndex(itemsCount - 1);
        } else {
          setIndex(index - 1);
        }
      },
      moveCursorDown() {
        if (index === null || index >= itemsCount - 1) {
          setIndex(0);
        } else {
          setIndex(index + 1);
        }
      },
      getCursorRoute() {
        if (index === null) {
          return null;
        }

        if (index !== 0) {
          const item = searchState.items[index - 1];

          if (item) {
            return extractLinkFromItem(item);
          }
        }

        return null;
      },
      close,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open]
  );

  if (!isOpen) {
    return null;
  }

  const isSomeFound = searchState.items.length > 0;

  return (
    <Wrapper>
      <Link route="search" params={{ q: searchText }} passHref>
        <HeaderBlock
          isSomeFound={isSomeFound}
          isSelected={index === 0}
          onMouseEnter={() => setIndex(0)}
          onMouseLeave={() => {
            if (index === 0) {
              setIndex(null);
            }
          }}
          onClick={() => close()}
        >
          <HeaderText>Show all results</HeaderText>
          <ArrowIcon />
        </HeaderBlock>
      </Link>
      {isSomeFound ? (
        <List>
          {searchState.items.map((item, i) => {
            // +1 because of index == 0 used for row "search all"
            const itemIndex = i + 1;

            return (
              <AutocompleteItem
                key={item.userId || item.communityId}
                item={item}
                isSelected={itemIndex === index}
                onMouseEnter={() => {
                  setIndex(itemIndex);
                }}
                onMouseLeave={() => {
                  if (itemIndex === index) {
                    setIndex(null);
                  }
                }}
                onClick={close}
              />
            );
          })}
        </List>
      ) : null}
    </Wrapper>
  );
}

AutocompleteResults.propTypes = {
  searchState: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  searchText: PropTypes.string.isRequired,
  panelRef: PropTypes.shape({
    current: PropTypes.object,
  }).isRequired,
};

export default forwardRef(AutocompleteResults);

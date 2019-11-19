import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from '@commun/icons';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const Img = styled.img`
  max-width: 100%;
`;

const Description = styled.span`
  margin-top: 6px;
  font-size: 12px;
`;

const CrossButton = styled.button`
  position: absolute;
  display: flex;

  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  top: 8px;
  right: 8px;

  border-radius: 24px;
  background: rgba(0, 0, 0, 0.4);
  color: ${({ theme }) => theme.colors.lightGrayBlue};
  cursor: pointer;
`;

const CrossIcon = styled(Icon).attrs({
  name: 'cross',
})`
  width: 14px;
  height: 14px;
  color: ${({ theme }) => theme.colors.lightGrayBlue};
`;

export default function Image({ data, className, onRemove }) {
  const { id, content, attributes = {} } = data;
  const { url = content, description } = attributes;

  return (
    <Wrapper className={className}>
      <Img src={url} alt={description || ''} />
      {description ? <Description>{description}</Description> : null}
      {onRemove ? (
        <CrossButton onClick={() => onRemove(id)}>
          <CrossIcon />
        </CrossButton>
      ) : null}
    </Wrapper>
  );
}

Image.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string.isRequired,
  }).isRequired,
  onRemove: PropTypes.func,
};

Image.defaultProps = {
  onRemove: undefined,
};

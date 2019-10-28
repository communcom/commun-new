import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from '@commun/icons';

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const Image = styled.img`
  max-width: 100%;
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
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
`;

const CrossIcon = styled(Icon).attrs({
  name: 'cross',
})`
  width: 14px;
  height: 14px;
  color: ${({ theme }) => theme.colors.white};
`;

export default function Photo({ data, onClose }) {
  const { id, content, attributes } = data;
  const { url = content } = attributes || {};

  return (
    <Wrapper>
      <Image src={url} />
      {onClose ? (
        <CrossButton onClick={() => onClose(id)}>
          <CrossIcon />
        </CrossButton>
      ) : null}
    </Wrapper>
  );
}

Photo.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func,
};

Photo.defaultProps = {
  onClose: null,
};

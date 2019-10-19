import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 48px;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.div`
  font-size: 15px;
  line-height: 1;

  ${is('hasIcon')`
    margin-left: 20px;
  `}
`;

const ControlComponent = styled.div`
  display: flex;
`;

const SettingsItem = ({ icon, label, controlComponent }) => (
  <Item>
    <LabelWrapper>
      {icon}
      <Label hasIcon={Boolean(icon)}>{label}</Label>
    </LabelWrapper>
    <ControlComponent>{controlComponent}</ControlComponent>
  </Item>
);

SettingsItem.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  controlComponent: PropTypes.node.isRequired,
};

SettingsItem.defaultProps = {
  icon: null,
};

export default SettingsItem;

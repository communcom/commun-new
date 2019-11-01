import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, Button, up } from '@commun/ui';

const Wrapper = styled(Card)`
  min-height: 240px;
  padding: 15px 15px;
  margin-bottom: 8px;

  ${up.desktop} {
    padding-top: 20px;
  }
`;

const Content = styled.p`
  font-size: 15px;
  line-height: 22px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default class Description extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    isLeader: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    openRuleEditModal: PropTypes.func.isRequired,
  };

  onProposalsClick = () => {
    // TODO:
    // eslint-disable-next-line no-undef,no-alert
    alert('Not ready yet');
  };

  onEditClick = description => {
    const { communityId, openRuleEditModal } = this.props;
    openRuleEditModal({ communityId, description });
  };

  render() {
    const { description, isLeader } = this.props;

    return (
      <Wrapper>
        <Content>{description}</Content>
        {isLeader ? (
          <ButtonsWrapper>
            <Button onClick={this.onProposalsClick}>10 new proposals</Button>
            <Button primary onClick={() => this.onEditClick(description)}>
              Edit
            </Button>
          </ButtonsWrapper>
        ) : null}
      </Wrapper>
    );
  }
}

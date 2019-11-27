import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, Button, up } from '@commun/ui';
import EmptyList from 'components/common/EmptyList/EmptyList';
import AsyncButton from 'components/common/AsyncButton';

const Wrapper = styled(Card)`
  min-height: 240px;
  padding: 15px 15px;

  ${up.desktop} {
    padding-top: 20px;
  }
`;

const Content = styled.p`
  font-size: 15px;
  line-height: 22px;
  margin-bottom: 5px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
`;

export default class Description extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    isLeader: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    openDescriptionEditModal: PropTypes.func.isRequired,
  };

  onEditClick = description => {
    const { communityId, openDescriptionEditModal } = this.props;
    openDescriptionEditModal({ communityId, description });
  };

  render() {
    const { description, isLeader } = this.props;

    return (
      <Wrapper>
        <Content>
          {!description ? (
            <EmptyList headerText="No description" subText="Community hasn't description ">
              {isLeader ? (
                <AsyncButton primary onClickHandler={() => this.onEditClick(description)}>
                  Create
                </AsyncButton>
              ) : null}
            </EmptyList>
          ) : (
            description
          )}
        </Content>
        {isLeader && description ? (
          <ButtonsWrapper>
            {/* <Button onClick={this.onProposalsClick}>10 new proposals</Button> */}
            <Button primary onClick={() => this.onEditClick(description)}>
              Edit
            </Button>
          </ButtonsWrapper>
        ) : null}
      </Wrapper>
    );
  }
}

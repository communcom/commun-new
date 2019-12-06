import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, Button, up } from '@commun/ui';
import EmptyList from 'components/common/EmptyList/EmptyList';

const Wrapper = styled(Card)`
  padding: 15px 15px;

  ${up.desktop} {
    padding-top: 20px;
  }
`;

const Content = styled.div`
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

  onEditClick = () => {
    const { description, communityId, openDescriptionEditModal } = this.props;
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
                <Button primary onClick={this.onEditClick}>
                  Create
                </Button>
              ) : null}
            </EmptyList>
          ) : (
            description
          )}
        </Content>
        {isLeader && description ? (
          <ButtonsWrapper>
            {/* <Button onClick={this.onProposalsClick}>10 new proposals</Button> */}
            <Button primary onClick={this.onEditClick}>
              Edit
            </Button>
          </ButtonsWrapper>
        ) : null}
      </Wrapper>
    );
  }
}

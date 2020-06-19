import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, Card, up } from '@commun/ui';

import { withTranslation } from 'shared/i18n';

import EmptyList from 'components/common/EmptyList';
import Linkify from 'components/common/Linkify';

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
  white-space: pre-wrap;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
`;

@withTranslation()
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
    const { description, isLeader, t } = this.props;

    return (
      <Wrapper>
        <Content>
          {!description ? (
            <EmptyList
              headerText={t('components.community.description.no_found')}
              subText={t('components.community.description.no_found_desc')}
            >
              {isLeader ? (
                <Button primary onClick={this.onEditClick}>
                  {t('common.create')}
                </Button>
              ) : null}
            </EmptyList>
          ) : (
            <Linkify>{description}</Linkify>
          )}
        </Content>
        {isLeader && description ? (
          <ButtonsWrapper>
            {/* <Button onClick={this.onProposalsClick}>10 new proposals</Button> */}
            <Button primary onClick={this.onEditClick}>
              {t('common.edit')}
            </Button>
          </ButtonsWrapper>
        ) : null}
      </Wrapper>
    );
  }
}

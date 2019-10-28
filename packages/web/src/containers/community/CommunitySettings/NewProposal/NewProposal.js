import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { TextButton } from '@commun/ui';

import { ButtonsBar } from '../../common';

const FIELDS = [
  {
    name: 'leaders_num',
    title: 'Leaders count',
    type: 'number',
  },
  {
    name: 'emission_rate',
    title: 'Emission rate',
    type: 'number',
  },
  {
    name: 'leaders_percent',
    title: "Leader's reward percent",
    type: 'number',
  },
  {
    name: 'author_percent',
    title: "Author's reward percent",
    type: 'number',
  },
];

const Body = styled.div``;

const Field = styled.label`
  display: block;
  margin: 12px 0;
`;

const FieldTitle = styled.div`
  margin-bottom: 6px;
  font-size: 15px;
  color: #555;
`;

const FieldValue = styled.div``;

const InputStyled = styled.input`
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 15px;
  color: #222;
  background-color: ${({ theme }) => theme.colors.white};
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0;
`;

// eslint-disable-next-line react/prefer-stateless-function
export default class NewProposal extends PureComponent {
  state = {
    data: {},
  };

  onCreateClick = () => {
    // eslint-disable-next-line no-alert
    window.alert('Not ready yet');
  };

  onResetClick = () => {
    this.setState({
      data: {},
    });
  };

  onChange(e, fieldName) {
    const { data } = this.state;

    this.setState({
      data: {
        ...data,
        [fieldName]: e.target.value,
      },
    });
  }

  render() {
    const { data } = this.state;

    return (
      <Body>
        {FIELDS.map(({ name, title, type }) => (
          <Field key={name}>
            <FieldTitle>{title}:</FieldTitle>
            <FieldValue>
              <InputStyled
                label={title}
                type={type}
                value={data[name] || ''}
                onChange={e => this.onChange(e, name)}
              />
            </FieldValue>
          </Field>
        ))}
        <Footer>
          <ButtonsBar>
            <TextButton onClick={this.onCreateClick}>Create</TextButton>
            <TextButton onClick={this.onResetClick}>Reset</TextButton>
          </ButtonsBar>
        </Footer>
      </Body>
    );
  }
}

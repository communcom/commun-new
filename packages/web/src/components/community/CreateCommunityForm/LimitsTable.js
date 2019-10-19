import React from 'react';
import PropTypes from 'prop-types';
import { keys } from 'ramda';
import { Field } from 'react-final-form';

import { Input } from 'components/common/prototyping';

const COLUMN_NAMES = ['Limit', 'Charge id', 'Price', 'Cutoff', 'Vest price', 'Min vest'];

const LimitsTable = ({ limits }) => {
  const rows = [];
  for (const limit of keys(limits)) {
    const cells = [];
    for (const field of keys(limits[limit])) {
      const propKey = `limits.${limit}.${field}`;
      cells.push(
        <td key={propKey}>
          <Field name={propKey}>{({ input }) => <Input {...input} />}</Field>
        </td>
      );
    }
    rows.push(
      <tr key={limit}>
        <td>{limit}</td>
        {cells}
      </tr>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          {COLUMN_NAMES.map(name => (
            <th key={name}>{name}</th>
          ))}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

LimitsTable.propTypes = {
  limits: PropTypes.shape({}).isRequired,
};

export default LimitsTable;

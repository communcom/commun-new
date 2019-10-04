import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';

import { Panel } from '@commun/ui';

import { notEmpty, validateAccountName } from 'utils/validatingInputs';
import { Row, Button, InputGroup, ParamGroup } from 'components/Prototyping';
// import LimitsTable from './LimitsTable';

/*
  @deprecated
*/
const CreateCommunityForm = ({ onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit, hasValidationErrors }) => (
      <form onSubmit={handleSubmit}>
        <Panel title="General">
          <Row>
            <Field name="communityName" validate={notEmpty}>
              {({ input }) => <InputGroup label="Name" placeholder="community name" {...input} />}
            </Field>
            <Field name="ticker" validate={notEmpty}>
              {({ input }) => <InputGroup label="Ticker" placeholder="GLS" {...input} />}
            </Field>
          </Row>
          <Row>
            <Field name="tokenPrecision" validate={notEmpty}>
              {({ input }) => <InputGroup label="Token precision" placeholder="3" {...input} />}
            </Field>
            <Field name="vestingPrecision" validate={notEmpty}>
              {({ input }) => <InputGroup label="Vesting Precision" placeholder="6" {...input} />}
            </Field>
          </Row>
          <Field name="tokenLimit" validate={notEmpty}>
            {({ input }) => <InputGroup label="Token limit" placeholder="10000000000" {...input} />}
          </Field>
        </Panel>

        <Panel title="Contract accounts">
          <Field name="accounts.issuer" validate={validateAccountName}>
            {({ input }) => <InputGroup label="issuer" {...input} />}
          </Field>
          <Field name="accounts.ctrl" validate={validateAccountName}>
            {({ input }) => <InputGroup label="ctrl" {...input} />}
          </Field>
          <Field name="accounts.emit" validate={validateAccountName}>
            {({ input }) => <InputGroup label="emit" {...input} />}
          </Field>
          <Field name="accounts.publish" validate={validateAccountName}>
            {({ input }) => <InputGroup label="publish" {...input} />}
          </Field>
          <Field name="accounts.social" validate={validateAccountName}>
            {({ input }) => <InputGroup label="social" {...input} />}
          </Field>
          <Field name="accounts.charge" validate={validateAccountName}>
            {({ input }) => <InputGroup label="charge" {...input} />}
          </Field>
        </Panel>

        <Panel title="Contract params">
          <ParamGroup title="Emit inflation rate">
            <Row>
              <Field name="emit.inflation.start">
                {({ input }) => <InputGroup label="start" {...input} />}
              </Field>
              <Field name="emit.inflation.stop">
                {({ input }) => <InputGroup label="stop" {...input} />}
              </Field>
              <Field name="emit.inflation.narrowing">
                {({ input }) => <InputGroup label="narrowing" {...input} />}
              </Field>
            </Row>
          </ParamGroup>

          <ParamGroup title="Emit reward pools">
            <Row>
              <Field name="emit.reward_pools.vesting_percent">
                {({ input }) => <InputGroup label="Vesting percent" {...input} />}
              </Field>
              <Field name="emit.reward_pools.ctrl_percent">
                {({ input }) => <InputGroup label="Ctrl percent" {...input} />}
              </Field>
              <Field name="emit.reward_pools.publish_percent">
                {({ input }) => <InputGroup label="Publish percent" {...input} />}
              </Field>
            </Row>
          </ParamGroup>

          <ParamGroup title="ctrl params">
            <Row>
              <Field name="ctrl.max_witnesses">
                {({ input }) => <InputGroup label="Max witnesses" {...input} />}
              </Field>
              <Field name="ctrl.max_witness_votes">
                {({ input }) => <InputGroup label="Max witness votes" {...input} />}
              </Field>
            </Row>
          </ParamGroup>

          <ParamGroup title="ctrl multisig perms">
            <Row>
              <Field name="ctrl.multisig_perms.super_majority">
                {({ input }) => <InputGroup label="Super majority" {...input} />}
              </Field>
              <Field name="ctrl.multisig_perms.majority">
                {({ input }) => <InputGroup label="Majority" {...input} />}
              </Field>
              <Field name="ctrl.multisig_perms.minority">
                {({ input }) => <InputGroup label="Minority" {...input} />}
              </Field>
            </Row>
          </ParamGroup>
        </Panel>

        <Panel title="Publish contract params">
          <Field name="publish.max_vote_changes">
            {({ input }) => <InputGroup label="Max vote changes" {...input} />}
          </Field>
          <Field name="publish.max_comment_depth">
            {({ input }) => <InputGroup label="Max comment depth" {...input} />}
          </Field>
          <Field name="publish.max_beneficiaries">
            {({ input }) => <InputGroup label="Max beneficiaries" {...input} />}
          </Field>
          <ParamGroup title="Cashout window">
            <Row>
              <Field name="publish.cashout_window.window">
                {({ input }) => <InputGroup label="Window" {...input} />}
              </Field>
              <Field name="publish.cashout_window.upvote_lockout">
                {({ input }) => <InputGroup label="Upvote lockout" {...input} />}
              </Field>
            </Row>
          </ParamGroup>
        </Panel>

        <Panel title="Publish contract rules">
          <Field name="publish.curatorsprop">
            {({ input }) => <InputGroup label="Curators prop" {...input} />}
          </Field>
          <Field name="publish.maxtokenprop">
            {({ input }) => <InputGroup label="Max token prop" {...input} />}
          </Field>

          <ParamGroup title="Main func">
            <Field name="publish.mainfunc.str">
              {({ input }) => <InputGroup label="str" {...input} />}
            </Field>
            <Field name="publish.mainfunc.maxarg">
              {({ input }) => <InputGroup label="Max args" {...input} />}
            </Field>
          </ParamGroup>

          <ParamGroup title="Curation func">
            <Field name="publish.curationfunc.str">
              {({ input }) => <InputGroup label="str" {...input} />}
            </Field>
            <Field name="publish.curationfunc.maxarg">
              {({ input }) => <InputGroup label="Max args" {...input} />}
            </Field>
          </ParamGroup>

          <ParamGroup title="Time penalty">
            <Field name="publish.timepenalty.str">
              {({ input }) => <InputGroup label="str" {...input} />}
            </Field>
            <Field name="publish.timepenalty.maxarg">
              {({ input }) => <InputGroup label="Max args" {...input} />}
            </Field>
          </ParamGroup>
        </Panel>

        <Panel title="Publish contract limits">
          {/* eslint-disable-next-line spaced-comment */}
          {/*<LimitsTable limits={initialValues.limits} />*/}
          <Button type="submit" disabled={hasValidationErrors}>
            Create
          </Button>
        </Panel>
      </form>
    )}
  />
);

CreateCommunityForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default CreateCommunityForm;

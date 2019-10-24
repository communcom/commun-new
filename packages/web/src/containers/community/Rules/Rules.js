import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TextButton } from '@commun/ui';

import { Wrapper, Header, Title, EditableText, ButtonsBar } from '../common';

const WrapperStyled = styled(Wrapper)`
  padding-bottom: 20px;
`;

export default class Rules extends PureComponent {
  static propTypes = {
    isLeader: PropTypes.bool,
  };

  static defaultProps = {
    isLeader: false,
  };

  state = {
    rules: '',
    isEditNow: false,
  };

  rulesContentRef = createRef();

  componentDidMount() {
    // TODO: replace with real rules from server
    const rules =
      localStorage.getItem('communityRules') ||
      `1. Content must target the Overwatch audience

      The primordial rule, upon which all others are based. The lifeblood and heartbeat of the subreddit; to ignore this rule is to ignore /r/Overwatch itself. All posts should directly feature Overwatch or the associated culture in some way; posting content from another movie, game, etc. and relating it to Overwatch in some way is not allowed.

      2. Content should be Safe for Work

      All content (title, articles, video, image, website, etc.) must be SFW: Safe For Work. Content that is NSFW: Not Safe For Work, is banned. This rule applies to all posts and comments.

      Examples of NSFW posts:

      – Pornographic images - Does it qualify as pornography?
      – Intense gore - no serious wounds, abuse, torture or general gore.
      – Erotic literature - whether stories, poetry or graphic imagery.
      – Linking to NSFW subreddits - in exceptional circumstances, only when serious discussion lends requirement to it, this is allowed.
      – Thinly veiled inappropriate innuendo or puns - titles that refer to sexual acts (ex. "British girl puts it in behind to secure the load").
      `;

    this.setState({
      rules,
    });
  }

  focus = () => {
    if (this.rulesContentRef) {
      const { current } = this.rulesContentRef;
      current.focus();
    }
  };

  renderEditButton = () => {
    const { isEditNow } = this.state;
    return isEditNow ? (
      <TextButton onClick={this.saveHandler}>Save</TextButton>
    ) : (
      <TextButton onClick={this.editHandler}>Edit</TextButton>
    );
  };

  editHandler = () => {
    this.setState(
      prevState => ({
        isEditNow: !prevState.isEditNow,
      }),
      this.focus
    );
  };

  saveHandler = () => {
    const { current } = this.rulesContentRef;
    const rules = current.innerText;

    localStorage.setItem('communityRules', rules);

    this.setState(prevState => ({
      isEditNow: !prevState.isEditNow,
      rules,
    }));
  };

  render() {
    const { isLeader } = this.props;
    const { isEditNow, rules } = this.state;

    return (
      <WrapperStyled>
        <Header>
          <Title>Rules</Title>
          {isLeader ? <ButtonsBar>{this.renderEditButton()}</ButtonsBar> : null}
        </Header>
        <EditableText value={rules} isEditNow={isEditNow} innerRef={this.rulesContentRef} />
      </WrapperStyled>
    );
  }
}

import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

import { TextButton } from '@commun/ui';

import { Wrapper, Header, Title, EditableText, ButtonsBar } from '../common';

export default class Description extends PureComponent {
  static propTypes = {
    isLeader: PropTypes.bool,
  };

  static defaultProps = {
    isLeader: false,
  };

  state = {
    desc: '',
    isEditNow: false,
  };

  descriptionContentRef = createRef();

  componentDidMount() {
    // TODO: replace with real description from server
    const desc =
      localStorage.getItem('communityDescription') ||
      `Cyclone Althea was a severe tropical cyclone that devastated parts of North Queensland just before Christmas during the 1971–72 Australian region cyclone season. The fourth system and second severe tropical cyclone of the season, Althea was one of the strongest storms ever to affect the Townsville area. After forming near the Solomon Islands on 19 December and heading southwest across the Coral Sea, the storm reached Category 4 on the Australian cyclone scale, peaking with 10-minute average maximum sustained winds of 165 km/h (105 mph). At 09:00 AEST on Christmas Eve, Althea struck the coast of Queensland near Rollingstone, about 50 km (30 mi) north of Townsville. While moving ashore, Althea generated wind gusts as high as 215 km/h (134 mph) that damaged thousands of homes and destroyed many. On nearby Magnetic Island almost all of the buildings were affected. Three people were killed, and damage totalled A$120 million.`;

    this.setState({
      desc,
    });
  }

  focus = () => {
    if (this.descriptionContentRef) {
      const { current } = this.descriptionContentRef;
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
    const { current: description } = this.descriptionContentRef;
    const desc = description.innerText;

    localStorage.setItem('communityDescription', desc);

    this.setState(prevState => ({
      isEditNow: !prevState.isEditNow,
      desc,
    }));
  };

  render() {
    const { isLeader } = this.props;
    const { isEditNow, desc } = this.state;

    return (
      <Wrapper>
        <Header>
          <Title>Description</Title>
          {isLeader ? <ButtonsBar>{this.renderEditButton()}</ButtonsBar> : null}
        </Header>
        <EditableText value={desc} isEditNow={isEditNow} innerRef={this.descriptionContentRef} />
      </Wrapper>
    );
  }
}

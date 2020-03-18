import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Iframe = styled.iframe`
  flex: 1;
  min-height: 700px;
  background: #fff;
  border: 0;
`;

export default class Exchange3DS extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,

    close: PropTypes.func.isRequired,
  };

  handleUrlParams = e => {
    if (e.origin !== window.location.origin) {
      return;
    }

    if (typeof e.data !== 'string') {
      return;
    }

    let status;
    let data;

    try {
      ({ status, data } = JSON.parse(e.data));
    } catch (err) {
      return;
    }

    if (!data.toString().startsWith('?')) {
      return;
    }

    const { close } = this.props;

    try {
      const urlParams = new URLSearchParams(data);

      close({
        status,
        data: Object.fromEntries(urlParams.entries()),
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  componentDidMount() {
    window.addEventListener('message', this.handleUrlParams);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleUrlParams);
  }

  render() {
    const { url } = this.props;

    return <Iframe src={url} />;
  }
}

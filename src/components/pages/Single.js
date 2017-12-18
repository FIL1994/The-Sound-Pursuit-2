/**
 * @author Philip Van Raalte
 * @date 2017-12-18
 */
import React, {Component} from 'react';
import {Page} from '../SpectreCSS';

class Single extends Component {
  render() {
    const {id} = this.props.match.params;

    return(
      <Page centered>
        <h1>Single #{id}</h1>
      </Page>
    );
  }
}

export default Single;
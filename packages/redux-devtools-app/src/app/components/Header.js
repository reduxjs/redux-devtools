import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Toolbar, Button, Divider, Spacer } from 'devui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocsIcon from 'react-icons/lib/go/book';
import FeedBackIcon from 'react-icons/lib/io/android-textsms';
import TwitterIcon from 'react-icons/lib/ti/social-twitter';
import SupportIcon from 'react-icons/lib/ti/heart-full-outline';
import { changeSection } from '../actions';

const tabs = [
  { name: 'Actions' },
  { name: 'Reports' },
  { name: 'Settings' }
];

class Header extends Component {
  static propTypes = {
    section: PropTypes.string.isRequired,
    changeSection: PropTypes.func.isRequired
  };

  openLink = url => () => {
    window.open(url);
  };

  render() {
    return (
      <Toolbar compact noBorder borderPosition="bottom">
        <Tabs
          main
          collapsible
          tabs={tabs}
          onClick={this.props.changeSection}
          selected={this.props.section || 'Actions'}
        />
        <Divider />
        <Button
          title="Documentation"
          tooltipPosition="bottom"
          onClick={this.openLink('http://extension.remotedev.io')}
        >
          <DocsIcon />
        </Button>
        <Button
          title="Feedback"
          tooltipPosition="bottom"
          onClick={this.openLink('http://extension.remotedev.io/docs/Feedback.html')}
        >
          <FeedBackIcon />
        </Button>
        <Button
          title="Follow us"
          tooltipPosition="bottom"
          onClick={this.openLink('https://twitter.com/RemoteDev')}
        >
          <TwitterIcon />
        </Button>
        <Button
          title="Support us"
          tooltipPosition="bottom-left"
          onClick={this.openLink('https://opencollective.com/redux-devtools-extension')}
        >
          <SupportIcon />
        </Button>
      </Toolbar>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeSection: bindActionCreators(changeSection, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(Header);

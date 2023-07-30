import React, { Component } from 'react';
import { Tabs, Toolbar, Button, Divider } from '@redux-devtools/ui';
import { connect, ResolveThunks } from 'react-redux';
import { GoBook } from 'react-icons/go';
import { IoMdText } from 'react-icons/io';
import { TiSocialTwitter } from 'react-icons/ti';
import { TiHeartFullOutline } from 'react-icons/ti';
import { changeSection } from '../actions';

const tabs = [{ name: 'Actions' }, { name: 'Settings' }];

type DispatchProps = ResolveThunks<typeof actionCreators>;
interface OwnProps {
  readonly section: string;
}
type Props = DispatchProps & OwnProps;

class Header extends Component<Props> {
  openLink = (url: string) => () => {
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
          onClick={this.openLink(
            'https://github.com/reduxjs/redux-devtools/blob/main/README.md',
          )}
        >
          <GoBook />
        </Button>
        <Button
          title="Feedback"
          tooltipPosition="bottom"
          onClick={this.openLink(
            'https://github.com/reduxjs/redux-devtools/discussions',
          )}
        >
          <IoMdText />
        </Button>
        <Button
          title="Follow us"
          tooltipPosition="bottom"
          onClick={this.openLink('https://twitter.com/NathanBierema')}
        >
          <TiSocialTwitter />
        </Button>
        <Button
          title="Support us"
          tooltipPosition="bottom-left"
          onClick={this.openLink(
            'https://opencollective.com/redux-devtools-extension',
          )}
        >
          <TiHeartFullOutline />
        </Button>
      </Toolbar>
    );
  }
}

const actionCreators = {
  changeSection,
};

export default connect(null, actionCreators)(Header);

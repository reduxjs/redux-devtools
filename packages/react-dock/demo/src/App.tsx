import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsX } from 'react-icons/bs';
import styled from 'styled-components';

import { Dock } from 'react-dock';

const Root = styled.div`
  font-size: 16px;
  color: #999;
  height: 100vh;
`;

const Main = styled.div`
  width: 100%;
  height: 150%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30vh;
`;

const DockContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Remove = styled(BsX)`
  position: absolute;
  z-index: 1;
  right: 10px;
  top: 10px;
  cursor: pointer;
`;

const positions = ['left', 'top', 'right', 'bottom'] as const;
const dimModes = ['transparent', 'none', 'opaque'] as const;

interface State {
  positionIdx: number;
  dimModeIdx: number;
  isVisible: boolean;
  fluid: boolean;
  customAnimation: boolean;
  slow: boolean;
  size: number;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default class App extends Component<{}, State> {
  state: State = {
    positionIdx: 0,
    dimModeIdx: 0,
    isVisible: true,
    fluid: true,
    customAnimation: false,
    slow: false,
    size: 0.25,
  };

  render() {
    const duration = this.state.slow ? 2000 : 200;
    const dur = duration / 1000;
    const transitions = ['left', 'top', 'width', 'height']
      .map((p) => `${p} ${dur}s cubic-bezier(0, 1.5, 0.5, 1)`)
      .join(',');

    return (
      <Root>
        <Main>
          <h1>Main Content</h1>
          <div>
            <div>
              Position: {positions[this.state.positionIdx]}
              <Button
                onClick={this.handlePositionClick}
                style={{ marginLeft: '20px' }}
              >
                Change
              </Button>
            </div>
            <div>
              Dim Mode: {dimModes[this.state.dimModeIdx]}
              <Button
                onClick={this.handleDimModeClick}
                style={{ marginLeft: '20px' }}
              >
                Change
              </Button>
            </div>
            <Form.Check
              label="is visible"
              checked={this.state.isVisible}
              onChange={() =>
                this.setState({
                  isVisible: !this.state.isVisible,
                })
              }
            />

            <Form.Check
              label="custom animation"
              checked={this.state.customAnimation}
              onChange={() =>
                this.setState({
                  customAnimation: !this.state.customAnimation,
                })
              }
            />

            <Form.Check
              label="slow"
              checked={this.state.slow}
              onChange={() =>
                this.setState({
                  slow: !this.state.slow,
                })
              }
            />

            <Form.Check
              label="fluid"
              checked={this.state.fluid}
              onChange={() =>
                this.setState({
                  fluid: !this.state.fluid,
                })
              }
            />
          </div>
        </Main>
        <Dock
          position={positions[this.state.positionIdx]}
          size={this.state.size}
          dimMode={dimModes[this.state.dimModeIdx]}
          isVisible={this.state.isVisible}
          onVisibleChange={this.handleVisibleChange}
          onSizeChange={this.handleSizeChange}
          fluid={this.state.fluid}
          dimStyle={{ background: 'rgba(0, 0, 100, 0.2)' }}
          dockStyle={
            this.state.customAnimation ? { transition: transitions } : null
          }
          dockHiddenStyle={
            this.state.customAnimation
              ? {
                  transition: [
                    transitions,
                    `opacity 0.01s linear ${dur}s`,
                  ].join(','),
                }
              : null
          }
          duration={duration}
        >
          {({ position, isResizing }) => (
            <DockContent>
              <h1>Dock Content</h1>
              <div>Position: {position}</div>
              <div>Resizing: {isResizing ? 'true' : 'false'}</div>
              <Remove onClick={() => this.setState({ isVisible: false })} />
            </DockContent>
          )}
        </Dock>
      </Root>
    );
  }

  handleVisibleChange = (isVisible: boolean) => {
    this.setState({ isVisible });
  };

  handleSizeChange = (size: number) => {
    this.setState({ size });
  };

  handlePositionClick = () => {
    this.setState({ positionIdx: (this.state.positionIdx + 1) % 4 });
  };

  handleDimModeClick = () => {
    this.setState({ dimModeIdx: (this.state.dimModeIdx + 1) % 3 });
  };
}

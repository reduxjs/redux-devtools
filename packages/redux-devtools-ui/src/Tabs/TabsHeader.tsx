import React, { Component } from 'react';
import PropTypes from 'prop-types';
import observeResize from 'simple-element-resize-detector';
import { FaAngleDoubleRight } from 'react-icons/fa';
import ContextMenu from '../ContextMenu';
import createStyledComponent from '../utils/createStyledComponent';
import * as styles from './styles';

const TabsWrapper = createStyledComponent(styles);

export type ReactButtonElement = React.ReactElement<
  JSX.IntrinsicElements['button'],
  'button'
>;

export interface Tab<P> {
  name: string;
  value?: string;
  component?: React.ComponentType<P>;
  selector?: (tab: this) => P;
}

interface Props<P> {
  tabs: ReactButtonElement[];
  items: Tab<P>[];
  main: boolean | undefined;
  onClick: (value: string) => void;
  position: 'left' | 'right' | 'center';
  collapsible: boolean | undefined;
  selected: string | undefined;
}

interface State {
  visibleTabs: ReactButtonElement[];
  hiddenTabs: ReactButtonElement[];
  subMenuOpened: boolean;
  contextMenu: { top: number; left: number } | undefined;
}

export default class TabsHeader<P> extends Component<Props<P>, State> {
  state: State = {
    visibleTabs: this.props.tabs.slice(),
    hiddenTabs: [],
    subMenuOpened: false,
    contextMenu: undefined,
  };

  iconWidth = 0;
  hiddenTabsWidth: number[] = [];
  tabsWrapperRef?: HTMLDivElement | null;
  tabsRef?: HTMLDivElement | null;
  resizeDetector?: HTMLIFrameElement;

  UNSAFE_componentWillReceiveProps(nextProps: Props<P>) {
    if (
      nextProps.tabs !== this.props.tabs ||
      nextProps.selected !== this.props.selected ||
      nextProps.collapsible !== this.props.collapsible
    ) {
      this.setState({ hiddenTabs: [], visibleTabs: nextProps.tabs.slice() });
    }
  }

  componentDidMount() {
    if (this.props.collapsible) {
      this.collapse();
      this.enableResizeEvents();
    }
  }

  componentDidUpdate(prevProps: Props<P>) {
    const { collapsible } = this.props;
    if (!collapsible) {
      if (prevProps.collapsible !== collapsible) this.disableResizeEvents();
      return;
    }

    let shouldCollapse = false;
    if (this.iconWidth === 0) {
      const tabButtons = this.tabsRef!.children;
      if (
        (this.tabsRef!.children[tabButtons.length - 1] as HTMLButtonElement)
          .value === 'expandIcon'
      ) {
        this.iconWidth =
          tabButtons[tabButtons.length - 1].getBoundingClientRect().width;
        shouldCollapse = true;
      }
    } else if (this.state.hiddenTabs.length === 0) {
      this.iconWidth = 0;
    }

    if (prevProps.collapsible !== collapsible) {
      this.enableResizeEvents();
      shouldCollapse = true;
    }

    if (shouldCollapse || this.props.selected !== prevProps.selected) {
      this.collapse();
    }
  }

  componentWillUnmount() {
    if (this.props.collapsible) {
      this.disableResizeEvents();
    }
  }

  enableResizeEvents() {
    this.resizeDetector = observeResize(this.tabsWrapperRef!, this.collapse);
    window.addEventListener('mousedown', this.hideSubmenu);
  }

  disableResizeEvents() {
    this.resizeDetector!.remove();
    window.removeEventListener('mousedown', this.hideSubmenu);
  }

  collapse = () => {
    if (this.state.subMenuOpened) this.hideSubmenu();

    const { selected, tabs } = this.props;
    const tabsWrapperRef = this.tabsWrapperRef;
    const tabsRef = this.tabsRef;
    const tabButtons = this.tabsRef!.children;
    const visibleTabs = this.state.visibleTabs;
    const hiddenTabs = this.state.hiddenTabs;
    let tabsWrapperRight = tabsWrapperRef!.getBoundingClientRect().right;
    if (!tabsWrapperRight) return; // tabs are hidden

    const tabsRefRight = tabsRef!.getBoundingClientRect().right;
    let i = visibleTabs.length - 1;
    let hiddenTab;

    if (tabsRefRight >= tabsWrapperRight - this.iconWidth) {
      if (
        this.props.position === 'right' &&
        hiddenTabs.length > 0 &&
        tabsRef!.getBoundingClientRect().width + this.hiddenTabsWidth[0] <
          tabsWrapperRef!.getBoundingClientRect().width
      ) {
        while (
          i < tabs.length - 1 &&
          tabsRef!.getBoundingClientRect().width + this.hiddenTabsWidth[0] <
            tabsWrapperRef!.getBoundingClientRect().width
        ) {
          hiddenTab = hiddenTabs.shift();
          visibleTabs.splice(Number(hiddenTab!.key), 0, hiddenTab!);
          i++;
        }
      } else {
        while (
          i > 0 &&
          tabButtons[i] &&
          tabButtons[i].getBoundingClientRect().right >=
            tabsWrapperRight - this.iconWidth
        ) {
          if ((tabButtons[i] as HTMLButtonElement).value !== selected) {
            hiddenTabs.unshift(...visibleTabs.splice(i, 1));
            this.hiddenTabsWidth.unshift(
              tabButtons[i].getBoundingClientRect().width
            );
          } else {
            tabsWrapperRight -= tabButtons[i].getBoundingClientRect().width;
          }
          i--;
        }
      }
    } else {
      while (
        i < tabs.length - 1 &&
        tabButtons[i] &&
        tabButtons[i].getBoundingClientRect().right + this.hiddenTabsWidth[0] <
          tabsWrapperRight - this.iconWidth
      ) {
        hiddenTab = hiddenTabs.shift();
        visibleTabs.splice(Number(hiddenTab!.key), 0, hiddenTab!);
        this.hiddenTabsWidth.shift();
        i++;
      }
    }
    this.setState({ visibleTabs, hiddenTabs });
  };

  hideSubmenu = () => {
    this.setState({ subMenuOpened: false, contextMenu: undefined });
  };

  getTabsWrapperRef: React.RefCallback<HTMLDivElement> = (node) => {
    this.tabsWrapperRef = node;
  };

  getTabsRef: React.RefCallback<HTMLDivElement> = (node) => {
    this.tabsRef = node;
  };

  expandMenu: React.MouseEventHandler = (e) => {
    const rect = e.currentTarget.children[0].getBoundingClientRect();
    this.setState({
      contextMenu: {
        top: rect.top + 10,
        left: rect.left,
      },
      subMenuOpened: true,
    });
  };

  render() {
    const { visibleTabs, hiddenTabs, contextMenu } = this.state;
    return (
      <TabsWrapper
        ref={this.getTabsWrapperRef}
        main={this.props.main}
        position={this.props.position}
      >
        <div ref={this.getTabsRef}>
          {visibleTabs}
          {this.props.collapsible &&
            visibleTabs.length < this.props.items.length && (
              <button onClick={this.expandMenu} value="expandIcon">
                <FaAngleDoubleRight />
              </button>
            )}
        </div>
        {this.props.collapsible && contextMenu && (
          <ContextMenu
            items={hiddenTabs}
            onClick={this.props.onClick}
            x={contextMenu.left}
            y={contextMenu.top}
            visible={this.state.subMenuOpened}
          />
        )}
      </TabsWrapper>
    );
  }

  static propTypes = {
    tabs: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    main: PropTypes.bool,
    onClick: PropTypes.func,
    position: PropTypes.string,
    collapsible: PropTypes.bool,
    selected: PropTypes.string,
  };
}

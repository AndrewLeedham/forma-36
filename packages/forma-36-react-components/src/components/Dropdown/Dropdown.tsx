import React, { Component } from 'react';
import cn from 'classnames';
import DropdownListItem from './DropdownListItem/DropdownListItem';
import DropdownContainer from './DropdownContainer';
import isBrowser from '../../utils/isBrowser';
import styles from './Dropdown.css';

export type positionType =
  | 'top'
  | 'right'
  | 'left'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-right'
  | 'top-left';

export interface DropdownProps {
  toggleElement?: React.ReactElement;
  submenuToggleLabel?: string;
  position: positionType;
  isOpen: boolean;
  onClose?: Function;
  testId?: string;
  dropdownContainerClassName?: string;
  getContainerRef?: (ref: HTMLElement | null) => void;
  className?: string;
  children: React.ReactNode;
  isFullWidth?: boolean;
  isAutoalignmentEnabled?: boolean;
}

export interface AnchorDimensionsAndPositonType {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface DropdownState {
  isOpen: boolean;
  position: positionType;
  anchorDimensionsAndPositon?: AnchorDimensionsAndPositonType;
}

const defaultProps: Partial<DropdownProps> = {
  testId: 'cf-ui-dropdown',
  position: 'bottom-left',
  isOpen: false,
  isAutoalignmentEnabled: true,
  getContainerRef: () => {},
};

export class Dropdown extends Component<DropdownProps, DropdownState> {
  static defaultProps = defaultProps;
  toggleElementWrapper: HTMLSpanElement | null = null;

  state = {
    isOpen: this.props.isOpen,
    position: this.props.position,
    anchorDimensionsAndPositon: {
      top: 0,
      left: 0,
      height: 0,
      width: 0,
    },
  };

  dropdownAnchor: HTMLDivElement | null = null;

  componentDidMount() {
    if (!isBrowser) {
      return;
    }
    this.setAnchorDimensions();
    this.bindEventListeners();
  }

  setAnchorDimensions = () => {
    if (this.dropdownAnchor) {
      const dropdownAnchorRect = this.dropdownAnchor.getBoundingClientRect();
      this.setState({
        anchorDimensionsAndPositon: {
          top: dropdownAnchorRect.top,
          left: dropdownAnchorRect.left,
          width: dropdownAnchorRect.width,
          height: dropdownAnchorRect.height,
        },
      });
    }
  };

  UNSAFE_componentWillReceiveProps(newProps: DropdownProps) {
    this.setState({
      isOpen: newProps.isOpen,
    });
  }

  componentDidUpdate(prevProps: DropdownProps) {
    if (!isBrowser) {
      return;
    }

    if (prevProps.isOpen !== this.props.isOpen) {
      this.setAnchorDimensions();
    }

    this.bindEventListeners();
  }

  bindEventListeners = () => {
    if (this.state.isOpen) {
      document.addEventListener('keydown', this.handleEscapeKey, true);
      window.addEventListener('resize', this.setAnchorDimensions, true);
      document.addEventListener('scroll', this.setAnchorDimensions, true);
    } else {
      document.removeEventListener('keydown', this.handleEscapeKey, true);
      window.removeEventListener('resize', this.setAnchorDimensions, true);
      document.removeEventListener('scroll', this.setAnchorDimensions, true);
    }
  };

  componentWillUnmount() {
    if (!isBrowser) {
      return;
    }

    document.removeEventListener('keydown', this.handleEscapeKey, true);
    window.removeEventListener('resize', this.setAnchorDimensions, true);
    document.removeEventListener('scroll', this.setAnchorDimensions, true);
  }

  openMenu = (isOpen: boolean) => {
    this.setState({ isOpen });
  };

  handleEscapeKey = (event: KeyboardEvent) => {
    const ESCAPE_KEYCODE = 27;

    if (event.keyCode === ESCAPE_KEYCODE) {
      event.stopPropagation();

      this.setState({
        isOpen: false,
      });

      if (this.props.onClose) {
        this.props.onClose();
      }
    }
  };

  openSubmenu = (isOpen: boolean) => {
    if (this.props.submenuToggleLabel) {
      this.openMenu(isOpen);
    }
  };

  render() {
    const {
      className,
      toggleElement,
      testId,
      submenuToggleLabel,
      getContainerRef,
      dropdownContainerClassName,
      children,
      isOpen,
      isAutoalignmentEnabled,
      isFullWidth,
      ...otherProps
    } = this.props;

    const classNames = cn(styles['Dropdown'], className);
    const width = isFullWidth && this.state.anchorDimensionsAndPositon.width;
    const containerTestId = testId ? `${testId}-container` : testId;

    return submenuToggleLabel ? (
      <DropdownListItem
        testId={testId}
        submenuToggleLabel={submenuToggleLabel}
        onEnter={() => this.openMenu(true)}
        onLeave={() => this.openMenu(false)}
        {...otherProps}
      >
        {toggleElement &&
          React.cloneElement(toggleElement, {
            'aria-haspopup': 'menu',
            'aria-expanded': this.state.isOpen,
          })}
        {this.state.isOpen && (
          <DropdownContainer
            anchorDimensionsAndPositon={this.state.anchorDimensionsAndPositon}
            position={this.props.position}
            width={width}
            className={dropdownContainerClassName}
            getRef={getContainerRef}
            dropdownAnchor={this.dropdownAnchor}
            onClose={this.props.onClose}
            openSubmenu={this.openSubmenu}
            submenu
          >
            {this.props.children}
          </DropdownContainer>
        )}
      </DropdownListItem>
    ) : (
      <div
        data-test-id={testId}
        className={classNames}
        ref={(ref) => {
          if (!submenuToggleLabel) {
            this.dropdownAnchor = ref;
          }
        }}
        {...otherProps}
      >
        {toggleElement &&
          React.cloneElement(toggleElement, {
            'aria-haspopup': 'menu',
            'aria-expanded': this.state.isOpen,
          })}
        {this.state.isOpen && (
          <DropdownContainer
            className={dropdownContainerClassName}
            getRef={getContainerRef}
            submenu={false}
            width={width}
            testId={containerTestId}
            dropdownAnchor={this.dropdownAnchor}
            isAutoalignmentEnabled={isAutoalignmentEnabled}
            anchorDimensionsAndPositon={this.state.anchorDimensionsAndPositon}
            onClose={this.props.onClose}
            openSubmenu={this.openSubmenu}
            position={this.props.position}
          >
            {this.props.children}
          </DropdownContainer>
        )}
      </div>
    );
  }
}

export default Dropdown;

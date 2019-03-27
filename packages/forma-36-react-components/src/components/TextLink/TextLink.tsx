import React, { Component, MouseEventHandler } from 'react';
import cn from 'classnames';
import Icon, { IconType } from '../Icon/Icon';
import TabFocusTrap from '../TabFocusTrap';

const styles = require('./TextLink.css');

export type TextLinkType =
  | 'primary'
  | 'positive'
  | 'negative'
  | 'secondary'
  | 'muted';

export type TextLinkProps = {
  children?: React.ReactNode;
  linkType?: TextLinkType;
  href?: string;
  isDisabled?: boolean;
  testId?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  className?: string;
  icon?: IconType;
  text?: string;
} & typeof defaultProps;

const defaultProps = {
  linkType: 'primary',
  testId: 'cf-ui-text-link',
  isDisabled: false,
};

export class TextLink extends Component<TextLinkProps> {
  static defaultProps = defaultProps;

  renderIcon(icon: IconType, linkType: TextLinkType) {
    if (!icon) return undefined;

    return (
      <div className={styles['TextLink__icon-wrapper']}>
        <Icon icon={icon} color={linkType} className={styles.TextLink__icon} />
      </div>
    );
  }

  render() {
    const {
      children,
      href,
      linkType,
      testId,
      onClick,
      isDisabled,
      className,
      icon,
      text,
      ...otherProps
    } = this.props;

    const classNames = cn(styles.TextLink, className, {
      [styles[`TextLink--${linkType}`]]: linkType,
      [styles['TextLink--is-disabled']]: isDisabled,
    });

    const content = (
      <TabFocusTrap>
        {icon && this.renderIcon(icon, linkType)}
        {text || children}
      </TabFocusTrap>
    );

    if (href) {
      return (
        <a
          className={classNames}
          data-test-id={testId}
          onClick={
            isDisabled
              ? e => {
                  e.preventDefault();
                }
              : onClick
          }
          href={href}
          {...otherProps}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        type="button"
        className={classNames}
        data-test-id={testId}
        onClick={!isDisabled ? onClick : () => {}}
        disabled={isDisabled}
        {...otherProps}
      >
        {content}
      </button>
    );
  }
}

export default TextLink;

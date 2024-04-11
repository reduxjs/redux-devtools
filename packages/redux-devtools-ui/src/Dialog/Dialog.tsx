import React, { PureComponent } from 'react';
import type { Base16Theme } from 'react-base16-styling';
import createStyledComponent from '../utils/createStyledComponent';
import * as styles from './styles';
import Button from '../Button';
import Form from '../Form';
import { Props as FormProps } from '../Form/Form';

const DialogWrapper = createStyledComponent(styles);

export interface DialogProps {
  open?: boolean;
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode[];
  submitText?: string;
  fullWidth?: boolean;
  noHeader?: boolean;
  noFooter?: boolean;
  modal?: boolean;
  onDismiss: (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement> | false,
  ) => void;
  onSubmit: () => void;
  theme?: Base16Theme;
}

type Rest<P> = Omit<
  DialogProps & FormProps<P>,
  | 'modal'
  | 'open'
  | 'fullWidth'
  | 'title'
  | 'children'
  | 'actions'
  | 'noHeader'
  | 'noFooter'
  | 'submitText'
  | 'onDismiss'
>;
function isForm<P>(rest?: FormProps<P>): rest is FormProps<P> {
  return (rest as FormProps<P>).schema !== undefined;
}

export default class Dialog<P> extends PureComponent<
  DialogProps | (Omit<DialogProps, 'onSubmit'> & FormProps<P>)
> {
  submitButton?: HTMLInputElement | null;

  onSubmit = () => {
    if (this.submitButton) this.submitButton.click();
    else (this.props.onSubmit as () => void)();
  };

  getFormButtonRef: React.RefCallback<HTMLInputElement> = (node) => {
    this.submitButton = node;
  };

  onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.keyCode === 27 /* esc */) {
      e.preventDefault();
      this.props.onDismiss(false);
    }
  };

  render() {
    const {
      modal,
      open,
      fullWidth,
      title,
      children,
      actions,
      noHeader,
      noFooter,
      submitText,
      onDismiss,
      ...rest
    } = this.props;
    const schema = (rest as Rest<P>).schema;

    return (
      <DialogWrapper
        open={open}
        fullWidth={fullWidth}
        onKeyDown={this.onKeyDown}
        theme={rest.theme}
      >
        <div onClick={!modal ? onDismiss : undefined} />
        <div>
          {!noHeader && (
            <div className="mc-dialog--header">
              <div>{schema ? schema.title || title : title}</div>
              {!modal && <button onClick={onDismiss}>×</button>}
            </div>
          )}
          <div className="mc-dialog--body">
            {children}
            {isForm(rest as FormProps<P>) && (
              <Form {...(rest as FormProps<P>)}>
                {!noFooter && (
                  <input
                    type="submit"
                    ref={this.getFormButtonRef}
                    className="mc-dialog--hidden"
                  />
                )}
              </Form>
            )}
          </div>
          {!noFooter &&
            (actions ? (
              <div className="mc-dialog--footer">
                {submitText
                  ? [
                      ...actions,
                      <Button
                        key="default-submit"
                        primary
                        onClick={this.onSubmit}
                      >
                        {submitText}
                      </Button>,
                    ]
                  : actions}
              </div>
            ) : (
              <div className="mc-dialog--footer">
                <Button onClick={onDismiss}>Cancel</Button>
                <Button primary onClick={this.onSubmit}>
                  {submitText || 'Submit'}
                </Button>
              </div>
            ))}
        </div>
      </DialogWrapper>
    );
  }
}

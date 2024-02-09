import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Element, Component, Event, Host, Prop, h } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { Color } from '../../interface';
import type { ChipEventDetail } from './chip-interface';
import { closeCircleOutline } from 'ionicons/icons';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-chip',
  styleUrls: {
    ios: 'chip.ios.scss',
    md: 'chip.md.scss',
    os: 'chip.os.scss'
  },
  shadow: true,
})
export class Chip implements ComponentInterface{

  @Element() el!: HTMLIonChipElement;
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * Display an outline style button.
   */
  @Prop() outline = false;

  /**
   * If `true`, the user cannot interact with the chip.
   */
  @Prop() disabled = false;

  @Prop({ reflect: true }) size?: 'small' | 'large' = 'large';

  @Prop({ reflect: true }) shape?: 'soft' | 'round' | 'rectangular' = 'round';

  @Prop() isSelectable = false;

  @Prop() showDismissButton = false;

  @Prop() dismissIcon?: string;

  @Prop({ mutable: true }) selected = false;

  @Event() ionChange!: EventEmitter<ChipEventDetail>;

  @Event() ionDismiss!: EventEmitter<void>;

  private setSelected = (state: boolean) => {
    const isSelected = (this.selected = state);
    this.ionChange.emit({
      selected: isSelected,
    });
  };

  private toggleSelected = () => {
    this.setSelected(!this.selected);
  };

  private onClick = () => {
    if (this.disabled || !this.isSelectable) {
      return;
    }

    this.toggleSelected();
  };

  private onDismiss = async (ev: MouseEvent) => {
    if (this.disabled) {
      return;
    }

    /** Prevent the onclick event to be triggered */
    ev.stopPropagation();

    this.ionDismiss.emit();

    /** This is just for test purposes, not the final implementation!
     * We still need to discuss if this is a good ideia to be done in the scope of the component
     * and iterate over any side effects.  
     */
    this.el.remove(); 
  };

  render() {
    const mode = getIonMode(this);
    const dismissIcon = this.dismissIcon || closeCircleOutline;

    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        onClick={this.onClick}
        class={createColorClasses(this.color, {
          [mode]: true,
          'chip-outline': this.outline,
          'chip-disabled': this.disabled,
          'ion-activatable': true,
          [`chip-${this.size}`]: this.size !== undefined,
          [`chip-${this.shape}`]: this.shape !== undefined,
          'chip-selected': this.selected,
        })}
      >
        <slot name="start"></slot>
        <slot></slot>
        <slot name="end"></slot>

        {this.showDismissButton && <button
            aria-label="dismiss"
            type="button"
            class="chip-clear-button"
            onClick={this.onDismiss}
          >
            <ion-icon
              aria-hidden="true"
              mode={mode}
              icon={dismissIcon}
              class="chip-dismiss-icon"
            ></ion-icon>
          </button>}

        {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </Host>
    );
  }
}

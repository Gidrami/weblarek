import { IBasketViewModel } from '../../types'
import { events as appEvents } from '../../utils/constants'
import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

export class HeaderView extends Component<IBasketViewModel> {
	protected counterElement: HTMLElement
	protected basketButton: HTMLButtonElement

	constructor(
		protected events: IEvents,
		container: HTMLElement,
	) {
		const state: IBasketViewModel = {
			counter: 0,
		}

		super(state, container)

		this.counterElement = ensureElement(
			'.header__basket-counter',
			this.container,
		)
		this.basketButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			this.container,
		)

		this.basketButton.addEventListener('click', () => {
			this.events.emit(appEvents.CART_OPEN, {})
		})
	}

  protected setValues(): void {
    this.counterElement.textContent = this.state.counter.toString()
  }
}

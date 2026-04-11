import { IProduct } from '../../types'
import { events as appEvents } from '../../utils/constants'
import { cloneTemplate, ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { IEvents } from '../base/Events'
import { CardBasketView } from './CardBasketView'

export interface IBasketState {
	items: IProduct[]
}

export class BasketView extends Component<IBasketState> {
	constructor(
		private readonly events: IEvents,
		items: IProduct[],
	) {
		super({ items }, cloneTemplate('#basket'))
		const checkout = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container,
		)
		checkout.addEventListener('click', e => {
			e.preventDefault()
			if (this.state.items.length === 0) {
				return
			}
			this.events.emit(appEvents.ORDER_OPEN, {})
		})
	}

	protected setValues(): void {
		const list = ensureElement('.basket__list', this.container)
		list.replaceChildren()

		this.state.items.forEach((product, i) => {
			const row = new CardBasketView(this.events, product, i + 1).render()
			list.append(row)
		})

		const total = this.state.items.reduce(
			(sum, item) => sum + (item.price ?? 0),
			0,
		)
		ensureElement('.basket__price', this.container).textContent =
			`${total} синапсов`
	}
}

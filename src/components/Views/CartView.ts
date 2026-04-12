import { IProduct } from '../../types'
import { events as appEvents } from '../../utils/constants'
import { cloneTemplate, ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { IEvents } from '../base/Events'
import { CartCardView } from './CartCardView'

export interface ICartState {
	items: IProduct[]
}

export class CartView extends Component<ICartState> {
	private readonly orderButtonElement: HTMLButtonElement

	constructor(
		private readonly events: IEvents,
		items: IProduct[],
	) {
		super({ items }, cloneTemplate('#basket'))
		this.orderButtonElement = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container,
		)
		this.orderButtonElement.addEventListener('click', e => {
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
			const row = new CartCardView(this.events, product, i + 1).render()
			list.append(row)
		})

		const total = this.state.items.reduce(
			(sum, item) => sum + (item.price ?? 0),
			0,
		)
		ensureElement('.basket__price', this.container).textContent =
			`${total} синапсов`

		this.orderButtonElement.disabled = this.state.items.length === 0
	}
}

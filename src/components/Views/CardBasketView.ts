import { IProduct } from '../../types'
import { events as appEvents } from '../../utils/constants'
import { cloneTemplate, ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

export interface ICardBasketState {
	product: IProduct
	index: number
}

export class CardBasketView extends Component<ICardBasketState> {
	constructor(
		private readonly events: IEvents,
		product: IProduct,
		index: number,
	) {
		super({ product, index }, cloneTemplate('#card-basket'))
		const deleteBtn = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container,
		)
		deleteBtn.addEventListener('click', (e) => {
			e.stopPropagation()
			this.events.emit(appEvents.BASKET_REMOVE, {
				product: this.state.product,
			})
		})
	}

	protected setValues(): void {
		const indexEl = this.container.querySelector(
			'.basket__item-index',
		) as HTMLElement
		const title = this.container.querySelector(
			'.card__title',
		) as HTMLElement
		const price = this.container.querySelector(
			'.card__price',
		) as HTMLElement

		indexEl.textContent = String(this.state.index)
		title.textContent = this.state.product.title
		price.textContent =
			this.state.product.price === null
				? 'Бесценно'
				: `${this.state.product.price} синапсов`
	}
}

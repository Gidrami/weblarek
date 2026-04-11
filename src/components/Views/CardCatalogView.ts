import { IProduct } from '../../types'
import { CDN_URL, events as appEvents, categoryMap } from '../../utils/constants'
import { cloneTemplate } from '../../utils/utils'
import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

export class CardCatalogView extends Component<IProduct> {
	constructor(
		private readonly events: IEvents,
		product: IProduct,
	) {
		super(product, cloneTemplate('#card-catalog'))
		this.container.addEventListener('click', () => {
			this.events.emit(appEvents.PRODUCT_SELECT, { product: this.state })
		})
	}

	protected setValues(): void {
		const cardCategory = this.container.querySelector(
			'.card__category',
		) as HTMLElement
		const cardTitle = this.container.querySelector(
			'.card__title',
		) as HTMLElement
		const cardImage = this.container.querySelector(
			'.card__image',
		) as HTMLImageElement
		const cardPrice = this.container.querySelector(
			'.card__price',
		) as HTMLElement

		const categoryClass =
			categoryMap[this.state.category as keyof typeof categoryMap] ??
			'card__category_other'
		cardCategory.className = `card__category ${categoryClass}`
		cardCategory.textContent = this.state.category
		cardTitle.textContent = this.state.title
		this.setImage(
			cardImage,
			`${CDN_URL}${this.state.image}`,
			this.state.title,
		)
		cardPrice.textContent =
			this.state.price === null
				? 'Бесценно'
				: `${this.state.price} синапсов`
	}
}

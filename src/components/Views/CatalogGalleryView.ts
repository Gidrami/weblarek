import { IProduct } from '../../types'
import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { IEvents } from '../base/Events'
import { CardCatalogView } from './CardCatalogView'

export interface ICatalogState {
	items: IProduct[]
}

export class CatalogGalleryView extends Component<ICatalogState> {
	constructor(
		private readonly events: IEvents,
		items: IProduct[],
	) {
		super({ items }, ensureElement('.gallery'))
	}

	protected setValues(): void {
		this.container.replaceChildren()

		const cards: HTMLElement[] = this.state.items.map((product) =>
			new CardCatalogView(this.events, product).render(),
		)

		this.container.append(...cards)
	}
}

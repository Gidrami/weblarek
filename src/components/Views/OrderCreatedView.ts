import { cloneTemplate, ensureElement } from '../../utils/utils'

export class OrderCreatedView {
	readonly container: HTMLElement

	constructor(total: number, onClose: () => void) {
		this.container = cloneTemplate('#success')
		ensureElement('.order-success__description', this.container).textContent =
			`Списано ${total} синапсов`
		ensureElement('.order-success__close', this.container).addEventListener(
			'click',
			() => onClose(),
		)
	}
}

import { IBuyer, TPayment } from '../../types'
import { cloneTemplate, ensureElement } from '../../utils/utils'

export class OrderSecondStepFormView {
	readonly container: HTMLElement
	private readonly form: HTMLFormElement
	private readonly cardBtn: HTMLButtonElement
	private readonly cashBtn: HTMLButtonElement
	private readonly addressInput: HTMLInputElement
	private readonly submitBtn: HTMLButtonElement
	private readonly errorsEl: HTMLElement
	private payment: TPayment = null

	constructor(
		private readonly onNext: (data: Pick<IBuyer, 'payment' | 'address'>) => void,
	) {
		this.container = cloneTemplate('#order')
		this.form = this.container as HTMLFormElement
		this.cardBtn = ensureElement<HTMLButtonElement>('[name="card"]', this.form)
		this.cashBtn = ensureElement<HTMLButtonElement>('[name="cash"]', this.form)
		this.addressInput = ensureElement<HTMLInputElement>(
			'[name="address"]',
			this.form,
		)
		this.submitBtn = ensureElement<HTMLButtonElement>(
			'[type="submit"]',
			this.form,
		)
		this.errorsEl = ensureElement('.form__errors', this.form)

		this.cardBtn.addEventListener('click', () => this.selectPayment('online'))
		this.cashBtn.addEventListener('click', () => this.selectPayment('cash'))
		this.addressInput.addEventListener('input', () => this.syncSubmitState())

		this.form.addEventListener('submit', (e) => {
			e.preventDefault()
			if (!this.isValid()) {
				return
			}
			this.onNext({
				payment: this.payment,
				address: this.addressInput.value.trim(),
			})
		})

		this.syncSubmitState()
	}

	private selectPayment(method: 'online' | 'cash'): void {
		this.payment = method
		this.cardBtn.classList.toggle('button_alt-active', method === 'online')
		this.cashBtn.classList.toggle('button_alt-active', method === 'cash')
		this.syncSubmitState()
	}

	private isValid(): boolean {
		return (
			this.payment !== null && this.addressInput.value.trim().length > 0
		)
	}

	private syncSubmitState(): void {
		this.submitBtn.disabled = !this.isValid()
		this.errorsEl.textContent = ''
	}
}

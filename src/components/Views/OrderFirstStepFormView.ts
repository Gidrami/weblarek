import { IBuyer } from '../../types'
import { cloneTemplate, ensureElement } from '../../utils/utils'

export class OrderFirstStepFormView {
	readonly container: HTMLElement
	private readonly form: HTMLFormElement
	private readonly emailInput: HTMLInputElement
	private readonly phoneInput: HTMLInputElement
	private readonly submitBtn: HTMLButtonElement
	private readonly errorsEl: HTMLElement

	constructor(
		private readonly onSubmit: (data: Pick<IBuyer, 'email' | 'phone'>) => void,
	) {
		this.container = cloneTemplate('#contacts')
		this.form = this.container as HTMLFormElement
		this.emailInput = ensureElement<HTMLInputElement>(
			'[name="email"]',
			this.form,
		)
		this.phoneInput = ensureElement<HTMLInputElement>(
			'[name="phone"]',
			this.form,
		)
		this.submitBtn = ensureElement<HTMLButtonElement>(
			'[type="submit"]',
			this.form,
		)
		this.errorsEl = ensureElement('.form__errors', this.form)

		this.emailInput.addEventListener('input', () => this.syncSubmitState())
		this.phoneInput.addEventListener('input', () => this.syncSubmitState())

		this.form.addEventListener('submit', (e) => {
			e.preventDefault()
			const email = this.emailInput.value
			const phone = this.phoneInput.value
			if (!email || !phone) {
				this.errorsEl.textContent = 'Заполните все поля'
				return
			}
			this.errorsEl.textContent = ''
			this.onSubmit({ email, phone })
		})

		this.syncSubmitState()
	}

	private syncSubmitState(): void {
		const ok =
			this.emailInput.value.trim().length > 0 &&
			this.phoneInput.value.trim().length > 0
		this.submitBtn.disabled = !ok
	}
}

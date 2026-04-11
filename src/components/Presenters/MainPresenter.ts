import { IOrder, IProduct } from '../../types'
import { API_URL, events as appEvents } from '../../utils/constants'
import { ensureElement } from '../../utils/utils'
import { AppApi } from '../api/AppApi'
import { Api } from '../base/Api'
import { EventEmitter, IEvents } from '../base/Events'
import { Buyer } from '../Models/Buyer'
import { Cart } from '../Models/Cart'
import { Products } from '../Models/Product'
import { BasketView } from '../Views/BasketView'
import { CardPreviewView } from '../Views/CardPreviewView'
import { CatalogGalleryView } from '../Views/CatalogGalleryView'
import { ContactsFormView } from '../Views/ContactsFormView'
import { HeaderView } from '../Views/HeaderView'
import { Modal } from '../Views/Modal'
import { OrderFormView } from '../Views/OrderFormView'
import { SuccessView } from '../Views/SuccessView'


export class MainPresenter {
	private readonly events: IEvents
	private readonly cart = new Cart()
	private readonly buyer = new Buyer()
	private readonly products = new Products()
	private readonly appApi: AppApi

	private readonly headerView: HeaderView
	private readonly catalogGalleryView: CatalogGalleryView
	private readonly modal: Modal

	constructor() {
		this.events = new EventEmitter()
		const api = new Api(API_URL)
		this.appApi = new AppApi(api)

		this.headerView = new HeaderView(
			this.events,
			document.querySelector('.header') as HTMLElement,
		)
		this.catalogGalleryView = new CatalogGalleryView(this.events, [])

		const modalRoot = ensureElement<HTMLElement>('#modal-container')
		const modalContent = ensureElement('.modal__content', modalRoot)
		this.modal = new Modal(modalRoot, modalContent)

		this.events.on(appEvents.PRODUCT_SELECT, (data: { product: IProduct }) => {
			this.openProductPreview(data.product)
		})
		this.events.on(appEvents.BASKET_OPEN, () => {
			this.openBasket()
		})
		this.events.on(appEvents.BASKET_ADD, (data: { product: IProduct }) => {
			if (!this.cart.hasItem(data.product.id)) {
				this.cart.addItem(data.product)
			}
			this.updateHeader()
			this.modal.close()
		})
		this.events.on(appEvents.BASKET_REMOVE, (data: { product: IProduct }) => {
			this.cart.removeItem(data.product)
			this.updateHeader()
		})
		this.events.on(appEvents.ORDER_OPEN, () => {
			this.showOrderForm()
		})
	}

	private updateHeader(): void {
		this.headerView.render({ counter: this.cart.getItemCount() })
	}

	private openProductPreview(product: IProduct): void {
		const preview = new CardPreviewView(this.events, product)
		this.modal.setContent(preview.render())
		this.modal.open()
	}

	private openBasket(): void {
		const basket = new BasketView(this.events, this.cart.getItems())
		this.modal.setContent(basket.render())
		this.modal.open()
	}

	private showOrderForm(): void {
		const form = new OrderFormView((data) => {
			this.buyer.setData(data)
			this.showContactsForm()
		})
		this.modal.setContent(form.container)
	}

	private showContactsForm(): void {
		const form = new ContactsFormView((data) => {
			this.buyer.setData(data)
			void this.submitOrder()
		})
		this.modal.setContent(form.container)
	}

	private async submitOrder(): Promise<void> {
		const buyerData = this.buyer.getData()
		const errors = this.buyer.validate()
		if (Object.keys(errors).length > 0) {
			console.error('Ошибка валидации:', errors)
			return
		}

		const order: IOrder = {
			...buyerData,
			total: this.cart.getTotalPrice(),
			items: this.cart.getItems().map((item) => item.id),
		}

		const response = await this.appApi.createOrder(order)
		const success = new SuccessView(response.total, () => {
			this.modal.close()
			this.cart.clear()
			this.buyer.clear()
			this.updateHeader()
		})
		this.modal.setContent(success.container)
	}

	async reload(): Promise<void> {
		const productsResponse = await this.appApi.getProducts()
		this.products.setItems(productsResponse.items)
		this.catalogGalleryView.render({ items: productsResponse.items })
		this.updateHeader()
	}
}

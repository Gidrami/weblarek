/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 

/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

/* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
export const categoryMap = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

export const settings = {

};

export const events = {
	CART_OPEN: 'cart:open',
	PRODUCTS_CHANGED: 'products:changed',
  PRODUCTS_ITEM_SELECTED: 'products:item_selected',
  PRODUCTS_SELECTED_ITEM_CLEARED: 'products:selected_item_cleared',
	BUYER_CHANGE: 'buyer:change',
	BUYER_CHANGED: 'buyer:changed',
	CART_CLEARED: 'cart:cleared',
	CART_ITEM_ADDED: 'cart:item_added',
	CART_ITEM_REMOVED: 'cart:item_removed',
	ORDER_FIRST_FORM_OPEN: 'order:first_form_open',
  ORDER_SECOND_FORM_OPEN: 'order:first_form_filled',
  ORDER_SECOND_FORM_FILLED: 'order:second_form_filled',
	ORDER_CREATED: 'order:created',
	ORDER_COMPLETED: 'order:completed',
	ORDER_PAYMENT_CHANGED: 'order:payment_changed',
  ORDER_ADDRESS_CHANGED: 'order:address_changed'
} as const
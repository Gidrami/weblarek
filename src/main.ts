import "./scss/styles.scss";

import { apiProducts } from "./utils/data";
import { Products } from "./components/base/Models/Product";
import { Cart } from "./components/base/Models/Cart";
import { Buyer } from "./components/base/Models/Buyer";

import { Api } from "./components/base/Api";
import { AppApi } from "./components/base/Api/AppApi";

const api = new Api("https://larek-api.nomoreparties.co");
const appApi = new AppApi(api);

const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

productsModel.setItems(apiProducts.items);
console.log("Массив товаров из каталога:", productsModel.getItems());
console.log("Товар по id:", productsModel.getItemById(apiProducts.items[0].id));

cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log("Корзина:", cartModel.getItems());
console.log("Общая сумма:", cartModel.getTotalPrice());
console.log(
  "Есть ли товар в корзине:",
  cartModel.hasItem(apiProducts.items[0].id),
);
cartModel.clear();
console.log("Пустая корзина:", cartModel.getItems());

buyerModel.setData({
  email: "yandex@mail.com",
  phone: "123",
  address: "address",
  payment: "online",
});
console.log("Данные покупателя:", buyerModel.getData());
console.log("Ошибки валидации:", buyerModel.validate());

appApi
  .getProducts()
  .then((data) => {
    console.log("Данные с сервера:", data);

    productsModel.setItems(data.items);

    console.log("Каталог после запроса:", productsModel.getItems());
  })
  .catch((err) => {
    console.error("Ошибка:", err);
  });

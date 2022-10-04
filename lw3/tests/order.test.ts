import { mock } from 'jest-mock-extended';
import Order from "../src/order";
import Pizza from "../src/pizza";

function createPizzaMock(name: string, price: number, deliveryPrice: number, totalPrice: number) {
  const pizzaMock = mock<Pizza>();
  pizzaMock.name = name;
  pizzaMock.price = price;
  pizzaMock.getDeliveryPrice.calledWith().mockReturnValue(deliveryPrice);
  pizzaMock.getTotalPrice.calledWith().mockReturnValue(totalPrice);
  return pizzaMock;
}

describe("Тест 'Order'", () => {

  test("успешная инициализация пустого заказа", () => {
    // arrange/act
    const order: Order = new Order();

    // asset
    expect(order.status).toBe(false);
    expect(order.getTotalPrice()).toBe(0);
    expect(order.getTotalDeliveryPrice()).toBe(0);
    expect(order.pizzas).toStrictEqual([]);
    expect(order.pizzas.length).toBe(0);
  });

  test("успешное добавление одной пиццы в заказ", () => {
    // arrange
    const order: Order = new Order();
    const pizzaMock = createPizzaMock("Сырная", 100, 20, 120);

    // act
    const addResult: boolean = order.add(pizzaMock);

    // asset
    expect(addResult).toBe(true);
    expect(order.status).toBe(false);
    expect(order.getTotalPrice()).toBe(120);
    expect(order.getTotalDeliveryPrice()).toBe(20);
    expect(order.pizzas).toStrictEqual([pizzaMock]);
    expect(order.pizzas.length).toBe(1);
  });

  test("успешное добавление нескольких пицц в заказ", () => {
    // arrange
    const order: Order = new Order();
    const pizzaMocks = [
      createPizzaMock("Сырная", 100, 20, 120),
      createPizzaMock("Пепперони", 150, 30, 180),
      createPizzaMock("Карбонара", 175, 35, 210)
    ];
    let addResult: boolean = true;

    // act
    pizzaMocks.forEach(item => {
      addResult &&= order.add(item);
    });

    // assert
    expect(addResult).toBe(true);
    expect(order.status).toBe(false);
    expect(order.getTotalPrice()).toBe(510);
    expect(order.getTotalDeliveryPrice()).toBe(85);
    expect(order.pizzas).toStrictEqual(pizzaMocks);
    expect(order.pizzas.length).toBe(3);
  });

  test("неудачный добавление экземпляра пиццы более одного раз в заказ", () => {
    // arrange
    const order: Order = new Order();
    const pizzaMock = createPizzaMock("Пепперони", 150, 30, 180);
    let addResult: boolean = true;

    // act
    for (let i = 0; i < 10; i++) {
      addResult &&= order.add(pizzaMock);
    }

    // assert
    expect(addResult).toBe(false);
    expect(order.status).toBe(false);
    expect(order.getTotalPrice()).toBe(180);
    expect(order.getTotalDeliveryPrice()).toBe(30);
    expect(order.pizzas).toStrictEqual([pizzaMock]);
    expect(order.pizzas.length).toBe(1);
  });

  test("успешное удаление пиццы из заказа", () => {
    // arrange
    const order: Order = new Order();
    const pizzaMocks = [
      createPizzaMock("Сырная", 100, 20, 120),
      createPizzaMock("Пепперони", 150, 30, 180),
      createPizzaMock("Карбонара", 175, 35, 210)
    ];
    pizzaMocks.forEach(item => {
      order.add(item);
    });

    // act
    const removeResult: boolean = order.remove(pizzaMocks[1]);

    // assert
    expect(removeResult).toBe(true);
    expect(order.status).toBe(false);
    expect(order.getTotalPrice()).toBe(330);
    expect(order.getTotalDeliveryPrice()).toBe(55);
    expect(order.pizzas).toStrictEqual([pizzaMocks[0], pizzaMocks[2]]);
    expect(order.pizzas.length).toBe(2);
  });

  test("успешное удаление нескольких пицц из заказа", () => {
    // arrange
    const order: Order = new Order();
    const pizzaMocks = [
      createPizzaMock("Сырная", 100, 20, 120),
      createPizzaMock("Пепперони", 150, 30, 180),
      createPizzaMock("Карбонара", 175, 35, 210)
    ];
    pizzaMocks.forEach(item => {
      order.add(item);
    });
    let removeResult: boolean = true;

    // act
    removeResult &&= order.remove(pizzaMocks[0]);
    removeResult &&= order.remove(pizzaMocks[2]);

    // assert
    expect(removeResult).toBe(true);
    expect(order.status).toBe(false);
    expect(order.getTotalPrice()).toBe(180);
    expect(order.getTotalDeliveryPrice()).toBe(30);
    expect(order.pizzas).toStrictEqual([pizzaMocks[1]]);
    expect(order.pizzas.length).toBe(1);
  });

  test("неудачное удаление пиццы не находящейся в заказе", () => {
    // arrange
    const order: Order = new Order();
    const pizzaMocks = [
      createPizzaMock("Сырная", 100, 20, 120),
      createPizzaMock("Пепперони", 150, 30, 180),
      createPizzaMock("Карбонара", 175, 35, 210)
    ];
    pizzaMocks.forEach(item => {
      order.add(item);
    });

    const pizzaMock = createPizzaMock("Маргарита", 200, 45, 245);

    // act
    const removeResult: boolean = order.remove(pizzaMock);

    // assert
    expect(removeResult).toBe(false);
    expect(order.status).toBe(false);
    expect(order.getTotalPrice()).toBe(510);
    expect(order.getTotalDeliveryPrice()).toBe(85);
    expect(order.pizzas).toStrictEqual(pizzaMocks);
    expect(order.pizzas.length).toBe(3);
  });

  test("успешная оплата ненулевого заказа", () => {
    // arrange
    const order: Order = new Order();
    const pizzaMock = createPizzaMock("Сырная", 100, 20, 120);
    order.add(pizzaMock);

    // act
    const payResult: boolean = order.toPay();

    // asset
    expect(payResult).toBe(true);
    expect(order.status).toBe(true);
    expect(order.getTotalPrice()).toBe(120);
    expect(order.getTotalDeliveryPrice()).toBe(20);
    expect(order.pizzas).toStrictEqual([pizzaMock]);
    expect(order.pizzas.length).toBe(1);
  });

  test("неудачная оплата нулевого заказа", () => {
    // arrange
    const order: Order = new Order();

    //act
    const payResult: boolean = order.toPay();

    // asset
    expect(payResult).toBe(false);
    expect(order.status).toBe(false);
    expect(order.getTotalPrice()).toBe(0);
    expect(order.getTotalDeliveryPrice()).toBe(0);
    expect(order.pizzas).toStrictEqual([]);
    expect(order.pizzas.length).toBe(0);
  });

  test("переполнение при подсчете итоговой стоимости", () => {
    // arrange
    const order: Order = new Order();
    const pizzaMocks = [
      createPizzaMock("Сырная", 1.7e+308, 20, 1.7e+308),
      createPizzaMock("Пепперони", 1.7e+308, 30, 1.7e+308),
      createPizzaMock("Карбонара", 1.7e+308, 35, 1.7e+308)
    ];
    let addResult: boolean = true;

    // act
    pizzaMocks.forEach(item => {
      addResult &&= order.add(item);
    });

    // assert
    expect(addResult).toBe(true);
    expect(order.status).toBe(false);
    expect(() => order.getTotalPrice()).toThrowError(new Error("Overflow number"));
    expect(order.getTotalDeliveryPrice()).toBe(85);
    expect(order.pizzas).toStrictEqual(pizzaMocks);
    expect(order.pizzas.length).toBe(3);
  });

  test("переполнение при подсчете стоимости доставки", () => {
    // arrange
    const order: Order = new Order();
    const pizzaMocks = [
      createPizzaMock("Сырная", 150, 1.7e+308, 1.7e+308),
      createPizzaMock("Пепперони", 175, 1.7e+308, 1.7e+308),
      createPizzaMock("Карбонара", 190, 1.7e+308, 1.7e+308)
    ];
    let addResult: boolean = true;

    // act
    pizzaMocks.forEach(item => {
      addResult &&= order.add(item);
    });

    // assert
    expect(addResult).toBe(true);
    expect(order.status).toBe(false);
    expect(() => order.getTotalPrice()).toThrowError(new Error("Overflow number"));
    expect(() => order.getTotalDeliveryPrice()).toThrowError(new Error("Overflow number"));
    expect(order.pizzas).toStrictEqual(pizzaMocks);
    expect(order.pizzas.length).toBe(3);
  });

});
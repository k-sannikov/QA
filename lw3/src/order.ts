import Pizza from "./pizza";

export default class Order {
  pizzas: Pizza[] = [];
  status: boolean = false;

  add(pizza: Pizza): boolean
  {
    const length: number = this.pizzas.length;
    if (this.pizzas.indexOf(pizza) == -1) {
      this.pizzas.push(pizza);
    }
    return (length + 1) == this.pizzas.length;
  }

  remove(pizza: Pizza): boolean
  {
    const length: number = this.pizzas.length;
    this.pizzas = this.pizzas.filter(item => item !== pizza);
    return (length - 1) == this.pizzas.length;
  }

  toPay(): boolean
  {
    return this.status = this.getTotalPrice() > 0;
  }

  getTotalPrice(): number
  {
    let price: number = 0;
    this.pizzas.forEach(item => {
      price += item.getTotalPrice();
      if (!isFinite(price)) {
        throw new Error("Overflow number");
      }
    });
    return price;
  }

  getTotalDeliveryPrice(): number
  {
    let price: number = 0;
    this.pizzas.forEach(item => {
      price += item.getDeliveryPrice();
      if (!isFinite(price)) {
        throw new Error("Overflow number");
      }
    });
    return price;
  }
}
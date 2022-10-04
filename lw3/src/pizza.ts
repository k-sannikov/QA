export default interface Pizza {
  name: string;
  price: number;

  getTotalPrice(): number;
  getDeliveryPrice(): number;
}


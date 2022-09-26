class Triangle {

  constructor(sideA: number, sideB: number, sideC: number) {
    const sides: number[] = [sideA, sideB, sideC];
    sides.sort((n1, n2) => n1 - n2);

    if (((sides[0] + sides[1]) <= sides[2]) || sides[0] <= 0) {
      throw 'не треугольник';
    }

    this.sideA = sideA;
    this.sideB = sideB;
    this.sideC = sideC;
  }

  sideA: number;
  sideB: number;
  sideC: number;

  getType() {
    if ((this.sideA == this.sideB) && (this.sideB == this.sideC)) {
      return 'равносторонний';
    } else if ((this.sideA != this.sideB) && (this.sideB != this.sideC) && (this.sideA != this.sideC)) {
      return 'обычный';
    } else if ((this.sideA == this.sideB) || (this.sideA == this.sideC) || (this.sideB == this.sideC)) {
      return 'равнобедренный';
    }
  }
}

export default Triangle;
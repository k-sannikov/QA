import { exit } from 'process';
import Triangle from './Triangle';

let sides: number[] = [];

if (process.argv.length <= 2) {
  console.log('неизвестная ошибка');
  exit(1);
}

for (let i = 2; i < process.argv.length; i++) {
  const tmpNum = Number(process.argv[i]);
  if (isNaN(tmpNum) || isNaN(parseFloat(process.argv[i])) || (tmpNum == Infinity)) {
    console.log('неизвестная ошибка');
    exit(1);
  }
  sides.push(tmpNum);
}

if (sides.length != 3) {
  console.log('не треугольник');
  exit(1);
}

try {
  const triangle = new Triangle(sides[0], sides[1], sides[2]);
  console.log(triangle.getType());
} catch (error) {
  console.log(error);
}

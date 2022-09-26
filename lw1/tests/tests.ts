import * as child from 'child_process';
import * as fs from 'fs';

async function startQueue(queue: Promise<string>[], index: number) {
  console.log(await queue[index]);
  if (index < queue.length - 1) {
    await startQueue(queue, index + 1);
  }
};

const text = fs.readFileSync('../tests.txt', 'utf-8').trim();
const lines: string[] = text.split('\n');
const queue: Promise<string>[] = [];

lines.forEach(async line => {
  if (line != '') {
    const testData: string[] = line.split(':');
    const param: string = testData[0].trim();
    const expected: string[] = testData[1].trim().split('//');

    const promise = new Promise<string>((resolve) => {
      const subprocess = child.spawn('../build/triangle.exe', param.split(' '));
      subprocess.stdout.on('data', (result: string) => {
        if (result == expected[0].trim() + '\n') {
          resolve('sucсess');
        } else {
          resolve('error: ' + String(result).trim());
        }
      });
    });

    queue.push(promise);
  }
});

startQueue(queue, 0);

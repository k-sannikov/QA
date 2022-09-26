import { default as axios } from 'axios';
import {JSDOM} from "jsdom";
import WriteFile from "./WriteFile";

const baseLink: string = 'http://links.qatl.ru';
const visited: Set<string> = new Set<string>();

const validFile: WriteFile = new WriteFile("./output/valid.txt");
const invalidFile: WriteFile = new WriteFile("./output/invalid.txt");

let validCount: number = 0;
let invalidCount: number = 0;

function checkLink(link: string) {
  axios.get(link)
    .then(
      response => {
        validFile.write(link + " " + response.status);
        validCount++;

        const dom: JSDOM = new JSDOM(response.data);
        const elems = dom.window.document.getElementsByTagName("a");

        [].forEach.call(elems, async (elem: HTMLAnchorElement) => {
          const path: string | null = elem.getAttribute('href');
          if (path) {
            try {
              const url: URL = new URL(path);
              if ((url.origin == baseLink) && (!visited.has(url.href) && path[0] != '#')) {
                checkLink(url.href);
                visited.add(url.href);
              }
            } catch (error) {
              let currentUrl = link.match(/^.*\//i);
              if (currentUrl) {
                const url: URL = new URL(currentUrl[0] + elem.getAttribute('href'));
                if (!visited.has(url.href) && path[0] != '#') {
                  checkLink(url.href);
                  visited.add(url.href);
                }
              }
            }
          }
        });
      },
      error => {
        if (error.response.status >= 400) {
          invalidFile.write(link + " " + error.response.status);
          invalidCount++;
        } else {
          validFile.write(link + " " + error.response.status);
          validCount++;
        }
      });
}

checkLink(baseLink + "/");

process.on('exit', () => {
  validFile.write("Quantity: " + validCount);
  invalidFile.write("Quantity: " + invalidCount);
  const date: Date = new Date();
  validFile.write(date.toDateString());
  invalidFile.write(date.toDateString());
})

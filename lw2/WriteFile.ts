import * as fs from 'fs';

class WriteFile {

  constructor(path: string) {
    this.path = path;
    fs.writeFileSync(path, "")
  }

  path: string;

  write(text: string): void {
    fs.appendFileSync(this.path, text + "\n");
  }
}

export default WriteFile;
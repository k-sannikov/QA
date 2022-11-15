import Ajv from 'ajv';
import { strict as assert } from 'assert';

export function validate(schema: any, body: any) {
  const ajv = new Ajv({
    strict: false,
    allErrors: true,
    verbose: true,
    formats: {
      id: "^[1-9][0-9]*$"
    }
  });
  const validate = ajv.compile(schema);
  const valid = validate(body);

  assert(valid, `Ошибка при проверке ответа: ${JSON.stringify({ validationErrors: validate.errors, }, null, 2)}`);
}
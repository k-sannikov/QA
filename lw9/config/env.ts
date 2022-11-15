import { cleanEnv, str, url } from 'envalid';

export const CONFIG = cleanEnv(process.env, {

  BASE_URL: url({
    desc: "Api url to be tested"
  }),
  
  API_PREFIX: str({
    desc: "Api prefix url to be tested"
  }),

  SCHEMAS_PATH: str({
    desc: "Schemas path"
  }),

});
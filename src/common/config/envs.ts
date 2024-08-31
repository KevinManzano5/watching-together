import 'dotenv/config';
import * as joi from 'joi';

interface IEnvs {
  API_VERSION: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  PORT: number;
}

const schema = joi
  .object({
    API_VERSION: joi.string().required(),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    PORT: joi.number().required(),
  })
  .unknown();

const { error, value } = schema.validate({
  ...process.env,
});

if (error) throw new Error(error.message);

const envs: IEnvs = value;

export { envs };

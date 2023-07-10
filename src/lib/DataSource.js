import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import entities from '../models/index.js';

dotenv.config();

const DS = new DataSource({
  type: process.env.DATABASE_TYPE,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  entities,
});

export default DS;

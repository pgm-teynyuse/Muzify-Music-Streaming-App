import * as path from 'path';

export const SOURCE_PATH = path.resolve('src');
export const PUBLIC_PATH = path.resolve('public');
export const VIEWS_PATH = path.join(SOURCE_PATH, 'views');
export const BASE_URL = `http://localhost:${process.env.PORT}`;

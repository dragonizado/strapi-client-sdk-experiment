import { strapi } from '@strapi/client';

const client = strapi({ baseURL: 'http://localhost:1337' });

export { client }
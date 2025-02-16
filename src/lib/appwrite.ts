import { Client, Account, Storage, Databases } from 'appwrite';

export const client = new Client();
export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const project = import.meta.env.VITE_APPWRITE_PROJECT_ID;
export const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;

client.setEndpoint(endpoint as string).setProject(project as string);

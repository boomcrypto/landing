import { Client, Account, Storage } from 'appwrite';

export const client = new Client();
export const account = new Account(client);
export const storage = new Storage(client);

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const project = import.meta.env.VITE_APPWRITE_PROJECT_ID;

client.setEndpoint(endpoint as string).setProject(project as string);

import { MenuServiceClient } from '../proto';

const client = new MenuServiceClient('http://localhost:8080', null, null);

export default client;

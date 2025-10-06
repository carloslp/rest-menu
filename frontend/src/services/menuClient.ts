import { MenuServiceClient } from '../proto/MenuServiceClientPb';

const client = new MenuServiceClient('http://localhost:8080', null, null);

export default client;

import { createPathBasedClient } from 'openapi-fetch';
import type { paths } from './generated/api';

export const client = createPathBasedClient<paths>({
  baseUrl: import.meta.env.PUBLIC_API_URL || 'http://localhost:8000',
});

// demo call :
// client['/api/users'].GET().then((res) => {
//   console.log(res);
// });

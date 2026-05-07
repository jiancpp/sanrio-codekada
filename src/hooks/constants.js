
// If you are hosting the frontend and backend together, '/' works.
// If they are hosted separately, you'll put your live backend URL here later!
export const BASE_URL = import.meta.env.PROD 
? '/api'
: 'http://localhost:5001/api';

export const MAX_LOGIN_ATTEMPTS = 3;


export const SOCKET_URL = import.meta.env.PROD 
? '/'
: 'http://localhost:5001';
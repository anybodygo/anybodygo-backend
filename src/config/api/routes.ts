require('dotenv').config();

const POST_REQUESTS: string = `${process.env.SERVER_URL}/api/requests`;
const GET_REQUESTS: string = `${process.env.SERVER_URL}/api/requests`;

export {POST_REQUESTS, GET_REQUESTS}
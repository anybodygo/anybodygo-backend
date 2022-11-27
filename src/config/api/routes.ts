require('dotenv').config();

export const POST_REQUESTS: string = `${process.env.SERVER_URL}/requests`;
export const GET_REQUESTS: string = `${process.env.SERVER_URL}/requests`;
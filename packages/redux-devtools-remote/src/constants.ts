export const defaultSocketOptions = {
  secure: false,
  hostname: 'localhost',
  port: 8000,
  autoReconnect: true,
  autoReconnectOptions: {
    randomness: 30000,
  },
};

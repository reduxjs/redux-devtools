const socketOptions = {
  hostname: 'remotedev.io',
  port: 443,
  protocol: 'https',
  autoReconnect: true,
  secure: true,
  autoReconnectOptions: {
    randomness: 30000
  }
};

export default socketOptions;

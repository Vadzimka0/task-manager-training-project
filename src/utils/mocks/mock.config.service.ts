const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_ACCESS_TOKEN_SECRET':
        return 'accesstoken';
      case 'JWT_ACCESS_TOKEN_EXPIRATION_TIME':
        return '172800';
    }
  },
};

export default mockedConfigService;

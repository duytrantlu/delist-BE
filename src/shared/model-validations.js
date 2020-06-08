// Model property validations

module.exports = {
  password: {
    minLength: {
      value: 8,
      message: 'Password must be a mininum of 8 characters'
    }
  },
  username: {
    regex: {
      value: /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/i,
      message: 'Usernmae is not valid.'
    }
  }
};

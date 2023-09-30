const api = {
  hostname: process.env.REACT_APP_HOST_NAME,
  protocol: process.env.REACT_APP_TRANSMIT_PROTOCOL,
  emailSignUP: function(email, password, passwordCheck) {
    return fetch(`${this.protocol}://${this.hostname}/api/v1/signup/email`, {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify({email, password, passwordCheck}),
    });
  },
  emailVerificationResend: function(email) {
    return fetch(`${this.protocol}://${this.hostname}/api/v1/signup/resendverificationemail?email=${email}`);
  },
};

export default api;

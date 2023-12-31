const api = {
  hostname: process.env.REACT_APP_HOST_NAME,
  protocol: process.env.REACT_APP_TRANSMIT_PROTOCOL,
  emailSignUp: function(email, password, passwordCheck) {
    return fetch(`${this.protocol}://${this.hostname}/api/v1/signup/email`, {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify({email, password, passwordCheck}),
    });
  },
  emailVerificationResend: function(email) {
    return fetch(`${this.protocol}://${this.hostname}/api/v1/signup/resendverificationemail?email=${email}`);
  },
  emailSignIn: function(email, password) {
    return fetch(`${this.protocol}://${this.hostname}/api/v1/signin/email`, {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify({email, password}),
    });
  },
  checkAutoAuthentication: function() {
    return fetch(`${this.protocol}://${this.hostname}/api/v1/signin/autoauthentication`);
  },
  userSignOut: function() {
    return fetch(`${this.protocol}://${this.hostname}/api/v1/signout`, {
      method: 'DELETE',
    });
  },
  getDashboardUserList: function() {
    return fetch(`${this.protocol}://${this.hostname}/api/v1/dashboard/userlist`);
  },
  getDashboardUserStatistics: function() {
    return fetch(`${this.protocol}://${this.hostname}/api/v1/dashboard/userstatistics`);
  },
  setNewName: function(newName) {
    return fetch(`${this.protocol}://${this.hostname}/api/v1/profile/changename`, {
      method: 'PUT',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify({newName}),
    });
  },
  setNewPassword: function(oldPassword, newPassword, newPasswordCheck) {
    return fetch(`${this.protocol}://${this.hostname}/api/v1/profile/changepassword`, {
      method: 'PUT',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify({oldPassword, newPassword, newPasswordCheck}),
    });
  },
};

export default api;

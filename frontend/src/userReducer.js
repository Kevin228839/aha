export const USER_INITIAL_STATE = {
  autoLogin: false,
  userInfo: null,
};

export const UserReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_AUTOLOGIN':
      return {...state, autoLogin: action.payload};
    case 'UPDATE_USERINFO':
      return {...state, userInfo: action.payload};
  }
};

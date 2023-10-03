interface EmailSignupPayload {
  email: string;
  password: string;
  passwordCheck: string;
}

interface UserStatistics {
  total_sign_up_user: number;
  today_active_user: number;
  average_active_user: number;
}

export {EmailSignupPayload, UserStatistics};

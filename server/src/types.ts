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

interface GoogleOAuthResponse {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export {EmailSignupPayload, UserStatistics, GoogleOAuthResponse};

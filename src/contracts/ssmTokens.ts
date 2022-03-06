export type CreateSSMTokenRequest = {
  configId: string;
  expiration?: Date;
}

export type SSMTokenResponse = {
  id: string;
  ssmId: string;
  expiration?: Date;
  created: Date;
  token: string;
}

export type SSMTokenDeleteResponse = '';
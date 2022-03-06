import {EditSSMRequest, GetSSMRequest} from "../contracts";
import axios from 'axios';

const url = 'https://dev-api.qayon.com/ssm/v1';

export interface ISSMClient<T=any> {
  get():Promise<T>,
  edit(update:{[x:string]:string}):Promise<T & typeof update>,
  remove(keys:string[]):Promise<Partial<T>>,
}

export class SSMClient<T=any> implements ISSMClient<T> {
  private readonly token: string;

  constructor(token:string) {
    this.token = token;
  }

  get:ISSMClient['get'] = () => {
    const getRequest: GetSSMRequest = {requestType: "getSSM", token: this.token};
    return axios.post(url, getRequest).then(r => r.data)
  }

  edit:ISSMClient['edit'] = (update) => {
    const editRequest: EditSSMRequest = {
      requestType: "editSSM",
      token: this.token,
      params: update
    }
    return axios.post(url, editRequest).then(r => r.data);
  }

  remove:ISSMClient['remove'] = (keys) => {
    const editRequest: EditSSMRequest = {
      requestType: "editSSM",
      token: this.token,
      remove: keys
    }
    return axios.post(url, editRequest).then(r => r.data);
  }
}
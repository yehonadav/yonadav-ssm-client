import {EditSSMRequest, GetSSMRequest} from "../contracts";
import axios from 'axios';
import {Partial} from "rollup-plugin-typescript2/dist/partial";

export type SSMClientConfig = {
  url: string;
}

export const ssmClientConfig:SSMClientConfig = {
  url: 'https://api.qayon.com/ssm/v1',
}

export interface ISSMClient<T=any> {
  get():Promise<T>,
  edit(update:{[x:string]:string}):Promise<T & typeof update>,
  remove(keys:string[]):Promise<Partial<T>>,
  editAndRemove(edit:{[x:string]:string}, remove:string[]):Promise<T>,
}

export class SSMClient<T=any> implements ISSMClient<T> {
  private readonly token: string;

  constructor(token:string) {
    this.token = token;
  }

  get:ISSMClient['get'] = () => {
    const getRequest: GetSSMRequest = {requestType: "getSSM", token: this.token};
    return axios.post(ssmClientConfig.url, getRequest).then(r => r.data)
  }

  edit:ISSMClient['edit'] = (update) => {
    const editRequest: EditSSMRequest = {
      requestType: "editSSM",
      token: this.token,
      params: update
    }
    return axios.post(ssmClientConfig.url, editRequest).then(r => r.data);
  }

  remove:ISSMClient['remove'] = (keys) => {
    const editRequest: EditSSMRequest = {
      requestType: "editSSM",
      token: this.token,
      remove: keys
    }
    return axios.post(ssmClientConfig.url, editRequest).then(r => r.data);
  }

  editAndRemove(edit: { [p: string]: string }, remove: string[]): Promise<T> {
    const editRequest: EditSSMRequest = {
      requestType: "editSSM",
      token: this.token,
      params: edit,
      remove,
    }
    return axios.post<T>(ssmClientConfig.url, editRequest).then(r => r.data);
  }
}
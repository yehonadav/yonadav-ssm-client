import {z} from "zod";
import {apiError} from "@yehonadav/apierror";
import {statusCode} from "@yehonadav/statuscodes";
import {validateZod} from "@yehonadav/validations";

const requestValidation = z.enum(["editSSM", "getSSM"]);
type Requests = z.infer<typeof requestValidation>;

const tokenValidation = z.string().length(344);
type Token = z.infer<typeof tokenValidation>;

type SSMRequest = {
  requestType: Requests,
  token: Token,
  [x:string]: any;
}

export const validateSsmRequest = (body:SSMRequest) => validateZod<{requestType: Requests, token:Token}>(body, z.object({
  requestType: requestValidation,
  token: tokenValidation,
}));

export const validateSsmEditRequest = (body:SSMRequest):EditSSMRequest => {
  if (body.params === undefined && body.remove === undefined)
    throw apiError({statusCode:statusCode.badRequest, message:'nothing to update'});

  const maxLength = 1000;

  if (body.params !== undefined) {
    validateZod(body, z.object({params: z.object({})}));
    let length = 0;
    for (const key in body.params) {
      validateZod(body, z.object({params: z.object({[key]:z.string().max(4096)})}));
      validateZod({params:{[key]:key}}, z.object({params: z.object({[key]:z.string().min(1).max(4096)})}));
      length++;
      if (length > maxLength)
        break;
    }
    validateZod({params:length}, z.object({params: z.number().min(1).max(maxLength)}));
  }

  if (body.remove !== undefined)
    validateZod(body, z.object({remove: z.array(z.string().min(1)).min(1).max(maxLength)}));

  return {
    requestType: body.requestType,
    token: body.token,
    params: body.params,
    remove: body.remove,
  }
}

export type GetSSMRequest = {
  requestType: Requests,
  token: string;
}

export type CreateSSMRequest = {
}

export type EditSSMRequest = {
  requestType: Requests,
  token: string;
  params?: {[x:string]: string};
  remove?: string[];
}

export type SSMItem = {
  params: {
    [x:string]: string|null|boolean|number;
  };
  active: boolean;
  created: Date;
  lastModified: Date;
}

export type SSMResponse = {
  [x:string]: string|null|boolean|number;
}

export type SSMDeleteResponse = '';
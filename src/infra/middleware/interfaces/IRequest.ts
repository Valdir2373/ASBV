// import { IJwtUser } from "../../../security/tokens/IJwtUser.js";
import { IFile } from "./IFile.js";

interface Cookies {
  refreshToken: string;
  tokenAcess: string;
  tokenRegister: string;
}

export interface IRequest {
  body: any;
  params: any;
  query: any;
  headers: any;
  method: string;
  path: string;
  cookies?: Cookies | any;
  file: (fieldName: string) => IFile | undefined;
}

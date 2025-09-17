import { IRequest } from "./IRequest.js";
import { IResponse } from "./IResponse.js";

export type IMiddlewareHandler = (
  req: IRequest,
  res: IResponse,
  next: () => void
) => Promise<void>;

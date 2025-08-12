import { Status } from "./Status";

export interface Response<T> {
    data: T;
    message: string;
    status: Status;
    createdAt: Date;
}
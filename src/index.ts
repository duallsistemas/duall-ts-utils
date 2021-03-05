export enum RequestStatus {
  None = 'none',
  Sending = 'sending',
  Success = 'success',
  Error = 'error',
}

export interface IStatus {
  code: RequestStatus;
  error?: string;
  isSending(): boolean;
  isSuccess(): boolean;
  isError(): boolean;
  setError(error?: string): IStatus;
  clear(): IStatus;
}

export class Status implements IStatus {
  constructor(public code: RequestStatus = RequestStatus.None, public error?: string) {
    if (error && code === RequestStatus.None) this.code = RequestStatus.Error;
  }

  isSending(): boolean {
    return this.code == RequestStatus.Sending;
  }

  isSuccess(): boolean {
    return this.code == RequestStatus.Success;
  }

  isError(): boolean {
    return this.code == RequestStatus.Error;
  }

  setError(error?: string): IStatus {
    this.code = RequestStatus.Error;
    this.error = error;
    return this;
  }

  clear(): IStatus {
    this.code = RequestStatus.None;
    this.error = undefined;
    return this;
  }
}

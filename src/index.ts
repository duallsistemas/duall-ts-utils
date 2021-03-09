import { formatCurrency } from '@brazilian-utils/brazilian-utils';

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

export function padZeros(value: number, count: number = 4): string {
  return value.toString().padStart(count, '0');
}

export function roundFloat(value: number, digits: number = 2): number {
  return Number(value.toFixed(digits));
}

export interface formatDateOptions {
  fullYear?: boolean;
}

export function formatDate(date: string | number | Date, options?: formatDateOptions) {
  return new Date(date).toLocaleString('pt-br', {
    year: options && options.fullYear ? 'numeric' : '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatDateTime(date: string | number | Date, options?: formatDateOptions) {
  return new Date(date).toLocaleString('pt-br', {
    year: options && options.fullYear ? 'numeric' : '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatPrice(value?: number, digits: number = 2): string {
  if (!value) value = 0.0;
  return formatCurrency(value, { precision: digits });
}

export function formatFloat(value?: number, digits: number = 1): string {
  if (!value) value = 0.0;
  return value.toFixed(digits).replace('.', ',');
}

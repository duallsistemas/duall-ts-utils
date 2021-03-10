import { onlyNumbers, formatCurrency } from '@brazilian-utils/brazilian-utils';

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

export function splitWords(words?: string, delimiter: string = ' '): string[] {
  if (!words) return [];
  return words.split(delimiter).filter(word => !!word);
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

export function formatFloat(value?: number, digits: number = 1): string {
  if (!value) value = 0.0;
  return value.toFixed(digits).replace('.', ',');
}

export function formatPrice(value?: number, digits: number = 2): string {
  if (!value) value = 0.0;
  return formatCurrency(value, { precision: digits });
}

export function formatPercent(value?: number): string {
  if (!value) value = 0.0;
  return formatPrice(value, 1);
}

/* TODO: remover este block assim que este issue for resolvido: https://github.com/brazilian-utils/brazilian-utils/issues/186 */

export const PHONE_MAX_LENGTH = 11;

function parsePhoneDigits(phone: string): { isValidDigits: boolean; digits: string } {
  return {
    isValidDigits: !!phone && typeof phone === 'string',
    digits: onlyNumbers(phone),
  };
}

export function formatPhone(phone: string): string {
  const { digits } = parsePhoneDigits(phone);
  const hasCountry = digits.length > PHONE_MAX_LENGTH;

  const getHyphenIndex = () => {
    if (hasCountry) return digits.length === 12 ? [7] : [8];
    return digits.length === PHONE_MAX_LENGTH ? [6] : [5];
  };

  const result = digits
    .slice(0, digits.length)
    .split('')
    .reduce((acc, digit, i) => {
      const result = `${acc}${digit}`;

      if (hasCountry) {
        if ([0].indexOf(i) >= 0) return `+${result}`;
        if ([1].indexOf(i) >= 0) return `${result} (`;
        if ([3].indexOf(i) >= 0) return `${result}) `;
      } else {
        if ([0].indexOf(i) >= 0) return `(${result}`;
        if ([1].indexOf(i) >= 0) return `${result}) `;
      }

      if (getHyphenIndex().indexOf(i) >= 0) return `${result}-`;

      return result;
    }, '');

  return result;
}

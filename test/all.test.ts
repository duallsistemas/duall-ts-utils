import {
  RequestStatus,
  IStatus,
  Status,
  padZeros,
  splitWords,
  roundFloat,
  formatDate,
  formatDateTime,
  formatFloat,
  formatPrice,
  formatPercent,
  formatPhone,
} from '../src';

describe('RequestStatus', () => {
  test('Check items', () => {
    expect(RequestStatus.None).toEqual('none');
    expect(RequestStatus.Sending).toEqual('sending');
    expect(RequestStatus.Success).toEqual('success');
    expect(RequestStatus.Error).toEqual('error');
  });
});

describe('IStatus and Status', () => {
  test('Check constructor', () => {
    {
      const status: IStatus = new Status();
      expect(status.code).toEqual(RequestStatus.None);
      expect(status.error).toBeUndefined();
    }
    {
      const status: IStatus = new Status(RequestStatus.Sending);
      expect(status.code).toEqual(RequestStatus.Sending);
      expect(status.error).toBeUndefined();
    }
    {
      const status: IStatus = new Status(RequestStatus.None, 'Some error');
      expect(status.code).toEqual(RequestStatus.Error);
      expect(status.error).toEqual('Some error');
    }
    {
      const status: IStatus = new Status(RequestStatus.Sending, 'Some error');
      expect(status.code).toEqual(RequestStatus.Sending);
      expect(status.error).toEqual('Some error');
    }
  });
  test('Check isSending()', () => {
    {
      const status: IStatus = new Status();
      expect(status.isSending()).toBeFalsy();
    }
    {
      const status: IStatus = new Status(RequestStatus.Sending);
      expect(status.isSending()).toBeTruthy();
    }
  });
  test('Check isSuccess()', () => {
    {
      const status: IStatus = new Status();
      expect(status.isSuccess()).toBeFalsy();
    }
    {
      const status: IStatus = new Status(RequestStatus.Success);
      expect(status.isSuccess()).toBeTruthy();
    }
  });
  test('Check isError()', () => {
    {
      const status: IStatus = new Status();
      expect(status.isError()).toBeFalsy();
    }
    {
      const status: IStatus = new Status(RequestStatus.Error);
      expect(status.isError()).toBeTruthy();
    }
  });
  test('Check setError()', () => {
    const status: IStatus = new Status();
    expect(status.code == RequestStatus.None).toBeTruthy();
    expect(status.error).toBeUndefined();
    const instance = status.setError();
    expect(instance).toEqual(status);
    expect(status.code == RequestStatus.Error).toBeTruthy();
    expect(status.error).toBeUndefined();
    status.setError('Some error');
    expect(status.error).toEqual('Some error');
  });
  test('Check clear()', () => {
    const status: IStatus = new Status(RequestStatus.Error, 'Some error');
    expect(status.code == RequestStatus.Error).toBeTruthy();
    expect(status.error).toEqual('Some error');
    const instance = status.clear();
    expect(instance).toEqual(status);
    expect(status.code == RequestStatus.None).toBeTruthy();
    expect(status.error).toBeUndefined();
  });
});

describe('General functions', () => {
  test('padZeros', () => {
    expect(padZeros(1)).toEqual('0001');
    expect(padZeros(1000)).toEqual('1000');
    expect(padZeros(1, 6)).toEqual('000001');
    expect(padZeros(1000, 6)).toEqual('001000');
  });
  test('splitWords', () => {
    expect(splitWords('')).toEqual([]);
    expect(splitWords('foo bar')).toEqual(['foo', 'bar']);
    expect(splitWords('foo, bar')).toEqual(['foo,', 'bar']);
    expect(splitWords('foo, bar', ', ')).toEqual(['foo', 'bar']);
    expect(splitWords('foo,bar', ',')).toEqual(['foo', 'bar']);
  });
});

describe('Rounding functions', () => {
  test('roundFloat', () => {
    expect(roundFloat(12.345)).toEqual(12.35);
    expect(roundFloat(12.345, 3)).toEqual(12.345);
  });
});

describe('Formatting functions', () => {
  test('formatDate', () => {
    expect(formatDate(new Date(2021, 2, 25))).toEqual('25/03/21');
    expect(formatDate(new Date(2021, 2, 25), { fullYear: true })).toEqual('25/03/2021');
  });
  test('formatDateTime', () => {
    expect(formatDateTime(new Date(2021, 2, 25, 1, 2, 45))).toEqual('25/03/21 01:02:45');
    expect(formatDateTime(new Date(2021, 2, 25, 1, 2, 45), { fullYear: true })).toEqual('25/03/2021 01:02:45');
  });
  test('formatFloat', () => {
    expect(formatFloat(0)).toEqual('0,0');
    expect(formatFloat(12.34)).toEqual('12,3');
    expect(formatFloat(1234.5)).toEqual('1234,5');
    expect(formatFloat(1.234, 3)).toEqual('1,234');
  });
  test('formatPrice', () => {
    expect(formatPrice(0)).toEqual('0,00');
    expect(formatPrice(12.34)).toEqual('12,34');
    expect(formatPrice(1234.56)).toEqual('1.234,56');
    expect(formatPrice(1.234, 3)).toEqual('1,234');
  });
  test('formatPercent', () => {
    expect(formatPercent(0)).toEqual('0,0');
    expect(formatPercent(12.34)).toEqual('12,3');
    expect(formatPercent(1234.56)).toEqual('1.234,6');
    expect(formatPercent(1.234)).toEqual('1,2');
  });
  test('formatPhone', () => {
    expect(formatPhone('')).toBe('');
    expect(formatPhone('1')).toBe('(1');
    expect(formatPhone('11')).toBe('(11) ');
    expect(formatPhone('119')).toBe('(11) 9');
    expect(formatPhone('1198')).toBe('(11) 98');
    expect(formatPhone('11988')).toBe('(11) 988');
    expect(formatPhone('119888')).toBe('(11) 9888-');
    expect(formatPhone('1198888')).toBe('(11) 9888-8');
    expect(formatPhone('11988887')).toBe('(11) 9888-87');
    expect(formatPhone('119888877')).toBe('(11) 9888-877');
    expect(formatPhone('1188887777')).toBe('(11) 8888-7777');
    expect(formatPhone('11988887777')).toBe('(11) 98888-7777');
    expect(formatPhone('51188887777')).toBe('(51) 18888-7777');
    expect(formatPhone('551188887777')).toBe('+55 (11) 8888-7777');
    expect(formatPhone('5511988887777')).toBe('+55 (11) 98888-7777');
    expect(formatPhone('55119888877776666')).toBe('+55 (11) 98888-77776666');
    expect(formatPhone('1188#887AB777')).toBe('(11) 8888-7777');
    expect(formatPhone('11988#887AB777')).toBe('(11) 98888-7777');
  });
});

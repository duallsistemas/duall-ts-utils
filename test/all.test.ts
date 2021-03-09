import {
  RequestStatus,
  IStatus,
  Status,
  padZeros,
  roundFloat,
  formatDate,
  formatDateTime,
  formatPrice,
  formatFloat,
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

  test('formatPrice', () => {
    expect(formatPrice(0)).toEqual('0,00');
    expect(formatPrice(12.34)).toEqual('12,34');
    expect(formatPrice(1234.56)).toEqual('1.234,56');
    expect(formatPrice(1.234, 3)).toEqual('1,234');
  });

  test('formatFloat', () => {
    expect(formatFloat(0)).toEqual('0,0');
    expect(formatFloat(12.34)).toEqual('12,3');
    expect(formatFloat(1234.5)).toEqual('1234,5');
    expect(formatFloat(1.234, 3)).toEqual('1,234');
  });
});

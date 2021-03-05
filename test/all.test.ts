import { RequestStatus, IStatus, Status } from '../src';

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

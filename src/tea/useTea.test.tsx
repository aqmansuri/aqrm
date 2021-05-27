import { renderHook, act } from '@testing-library/react-hooks';
import { useTea } from './useTea';
import { Tea } from '../shared/models';
import { expectedTeas, resultTeas } from './__mocks__/mockTeas';

jest.mock('../core/auth/useAuthInterceptor', () => ({
  useAuthInterceptor: () => ({
    instance: {
      get: mockInstanceVerb,
    },
  }),
}));

let mockInstanceVerb = jest.fn();

describe('useTea', () => {
  describe('get all teas', () => {
    beforeEach(
      () => (mockInstanceVerb = jest.fn(async () => ({ data: resultTeas() }))),
    );

    it('gets the teas', async () => {
      const { result } = renderHook(() => useTea());
      await act(async () => {
        await result.current.getTeas();
      });
      expect(mockInstanceVerb).toHaveBeenCalledTimes(1);
    });

    it('adds an image to each tea item', async () => {
      let teas: Tea[] = [];
      const { result } = renderHook(() => useTea());
      await act(async () => {
        teas = await result.current.getTeas();
      });
      expect(teas).toEqual(expectedTeas);
    });
  });

  describe('get a specific tea', () => {
    beforeEach(
      () =>
        (mockInstanceVerb = jest.fn(async () => ({ data: resultTeas()[0] }))),
    );

    it('gets the specific tea', async () => {
      const { result } = renderHook(() => useTea());
      await act(async () => {
        await result.current.getTeaById(4);
      });
      expect(mockInstanceVerb).toBeCalledTimes(1);
    });

    it('adds an image to the tea item', async () => {
      let tea: Tea | undefined = undefined;
      const { result } = renderHook(() => useTea());
      await act(async () => {
        tea = await result.current.getTeaById(4);
      });
      expect(tea).toEqual(expectedTeas[0]);
    });
  });

  afterEach(() => jest.restoreAllMocks());
});

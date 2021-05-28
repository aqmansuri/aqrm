import { renderHook, act } from '@testing-library/react-hooks';
import { TastingNote } from '../shared/models';
import { useTastingNotes } from './useTastingNotes';
import { mockNotes } from './__mocks__/mockNotes';

jest.mock('../core/auth/useAuthInterceptor', () => ({
  useAuthInterceptor: () => ({
    instance: {
      get: mockInstanceVerb,
      post: mockInstanceVerb,
      delete: mockInstanceVerb,
    },
  }),
}));

let mockInstanceVerb = jest.fn();

describe('useTastingNotes', () => {
  describe('get all notes', () => {
    beforeEach(() => {
      mockInstanceVerb = jest.fn(async () => ({ data: [mockNotes] }));
    });

    it('gets the notes', async () => {
      let notes: Array<TastingNote> = [];
      const { result } = renderHook(() => useTastingNotes());
      await act(async () => {
        notes = await result.current.getNotes();
      });
      expect(mockInstanceVerb).toHaveBeenCalledTimes(1);
      expect(notes).toEqual([mockNotes]);
    });
  });

  describe('get a singular note', () => {
    beforeEach(() => {
      mockInstanceVerb = jest.fn(async () => ({ data: mockNotes[0] }));
    });

    it('gets a single TastingNote', async () => {
      let note: TastingNote | undefined = undefined;
      const { result } = renderHook(() => useTastingNotes());
      await act(async () => {
        note = await result.current.getNoteById(4);
      });
      expect(mockInstanceVerb).toHaveBeenCalledTimes(1);
      expect(note).toEqual(mockNotes[0]);
    });
  });

  describe('delete a note', () => {
    beforeEach(() => {
      mockInstanceVerb = jest.fn(() => Promise.resolve());
    });

    it('deletes a single note', async () => {
      const { result } = renderHook(() => useTastingNotes());
      await act(async () => {
        await result.current.deleteNote(4);
      });
      expect(mockInstanceVerb).toHaveBeenCalledTimes(1);
    });
  });

  describe('save a note', () => {
    beforeEach(() => {
      mockInstanceVerb = jest.fn(() => Promise.resolve());
    });

    it('saves a single note', async () => {
      const { result } = renderHook(() => useTastingNotes());
      await act(async () => {
        await result.current.saveNote(mockNotes[0]);
      });
      expect(mockInstanceVerb).toHaveBeenCalledTimes(1);
    });
  });

  afterEach(() => jest.restoreAllMocks());
});

import { render, waitFor } from '@testing-library/react';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
import TastingNotesPage from './TastingNotesPage';
import { mockNotes } from './__mocks__/mockNotes';

let mockGetNotes = jest.fn(async () => mockNotes);
jest.mock('./useTastingNotes', () => ({
  useTastingNotes: () => ({
    getNotes: mockGetNotes,
  }),
}));

describe('<TastingNotesPage />', () => {
  beforeEach(() => (mockGetNotes = jest.fn(async () => mockNotes)));

  it('renders consistently', async () => {
    const { asFragment } = render(<TastingNotesPage />);
    await waitFor(() => expect(asFragment).toMatchSnapshot());
  });

  describe('initialization', () => {
    it('gets all of the notes', async () => {
      render(<TastingNotesPage />);
      await waitFor(() => expect(mockGetNotes).toHaveBeenCalledTimes(1));
    });

    it('displays the notes', async () => {
      const { container } = render(<TastingNotesPage />);
      await waitFor(() => {
        expect(container).toHaveTextContent(/Bently/);
        expect(container).toHaveTextContent(/Lipton/);
      });
    });
  });

  describe('add a new note', () => {
    it('displays the editor modal', async () => {
      const { getByText, getByTestId } = render(<TastingNotesPage />);
      const button = getByTestId(/fab-button/) as HTMLIonButtonElement;
      fireEvent.click(button);
      await waitFor(() =>
        expect(getByText('Add New Tasting Note')).toBeDefined(),
      );
    });
  });

  describe('update an existing note', () => {
    it('pre-populates the editor modal', async () => {
      const { getByText, getByTestId } = render(<TastingNotesPage />);
      const item = await waitFor(() => getByTestId(/note0/));
      fireEvent.click(item);
      await waitFor(() => {
        expect(getByText(/Update Tasting Note/)).toBeDefined();
      });
    });
  });

  afterEach(() => jest.resetAllMocks());
});

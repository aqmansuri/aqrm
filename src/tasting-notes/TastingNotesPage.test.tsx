import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Share } from '@capacitor/share';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
import TastingNotesPage from './TastingNotesPage';
import { mockNotes } from './__mocks__/mockNotes';

jest.mock('@capacitor/share');

let mockGetNotes = jest.fn(async () => mockNotes);
jest.mock('./useTastingNotes', () => ({
  useTastingNotes: () => ({
    getNotes: mockGetNotes,
  }),
}));

describe('<TastingNotesPage />', () => {
  beforeEach(() => {
    mockGetNotes = jest.fn(async () => mockNotes);
    Share.share = jest.fn();
  });

  it('renders consistently', async () => {
    const { asFragment, getByTestId } = render(<TastingNotesPage />);
    await waitFor(() => expect(getByTestId(/note0/)).toBeDefined());
    expect(asFragment).toMatchSnapshot();
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
      await waitFor(() => expect(getByText('Add New Tasting Note')).toBeDefined());
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

  describe('sharing a note', () => {
    it('calls the share plugin when called', async () => {
      const { getByTestId } = render(<TastingNotesPage />);
      const item = await waitFor(() => getByTestId(/share0/));
      fireEvent.click(item);
      await waitFor(() => expect(Share.share).toHaveBeenCalledTimes(1));
    });

    it('shares the brand, name, rating, and notes', async () => {
      const { getByTestId } = render(<TastingNotesPage />);
      const item = await waitFor(() => getByTestId(/share0/));
      fireEvent.click(item);
      await waitFor(() =>
        expect(Share.share).toHaveBeenCalledWith({
          title: 'Lipton: Yellow Label',
          text: `Overly acidic, highly tannic flavor Rated 1/5 stars`,
          dialogTitle: `Share Yellow Label's tasting note`,
          url: 'https://tea-taster-training.web.app',
        })
      );
    });
  });

  afterEach(() => jest.resetAllMocks());
});

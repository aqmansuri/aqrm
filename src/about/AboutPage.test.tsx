import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
import AboutPage from './AboutPage';

let mockLogout = jest.fn(() => Promise.resolve());
jest.mock('../core/auth', () => ({
  useAuthentication: () => ({
    logout: mockLogout,
  }),
}));
jest.mock('react-router', () => ({
  useHistory: () => ({
    replace: jest.fn(),
  }),
}));

describe('<AboutPage />', () => {
  beforeEach(() => (mockLogout = jest.fn(() => Promise.resolve())));

  it('displays the header', async () => {
    const { container } = render(<AboutPage />);
    await waitFor(() => expect(container).toHaveTextContent(/About Tea Taster/));
  });

  it('renders consistently', async () => {
    const { asFragment } = render(<AboutPage />);
    expect(asFragment()).toMatchSnapshot();
  });

  describe('sign out button', () => {
    it('signs the user out', async () => {
      const { getByTestId } = render(<AboutPage />);
      const logout = await waitFor(() => getByTestId(/logout-button/));
      fireEvent.click(logout);
      await waitFor(() => expect(mockLogout).toHaveBeenCalledTimes(1));
    });
  });

  afterEach(() => jest.restoreAllMocks());
});

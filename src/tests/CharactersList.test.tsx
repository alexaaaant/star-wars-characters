import { render, screen, fireEvent } from '@testing-library/react';
import { CharactersList } from '../components/CharactersList';
import { charactersStore } from '../stores/CharactersStore';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

jest.mock('../stores/CharactersStore', () => ({
  charactersStore: {
    characters: new Map([
      ['1', { name: 'Luke Skywalker' }],
      ['2', { name: 'Darth Vader' }],
    ]),
    startSearch: jest.fn(),
    loadNextPage: jest.fn(),
    isLoading: false,
    reqParams: { search: '' },
  },
}));

jest.mock('../common/hooks/useDebounce', () => ({
    useDebounce: (value: any) => value,
  }));

class IntersectionObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
});

describe('CharactersList', () => {
  it('renders characters list correctly', () => {
    render(<CharactersList />);

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('Darth Vader')).toBeInTheDocument();
  });

  it('triggers search on input change', () => {
    render(<CharactersList />);

    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Luke' } });

    expect(charactersStore.startSearch).toHaveBeenCalledWith('Luke');
  });

  it('displays loading spinner while loading', () => {
    charactersStore.isLoading = true;
    charactersStore.characters = new Map();

    render(<CharactersList />);

    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('displays "Empty" message when there are no characters', () => {
    charactersStore.isLoading = false;
    charactersStore.characters = new Map();

    render(<CharactersList />);

    expect(screen.getByText('Empty')).toBeInTheDocument();
  });
});

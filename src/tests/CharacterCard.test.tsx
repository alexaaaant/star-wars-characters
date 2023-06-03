import { render, screen } from '@testing-library/react';
import { CharacterCard } from '../components/CharacterCard';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

describe('CharacterCard', () => {
  const character = {
    name: 'Luke Skywalker',
    birth_year: '19BBY',
    gender: 'n/a',
    height: '300',
  };

  it('makes a snapshot', () => {
    const { container } = render(
      <CharacterCard character={character} observerRef={null} />
    );

    expect(container).toMatchSnapshot();
  });

  it('renders a link to character details', () => {
    render(<CharacterCard character={character} observerRef={null} />);

    const linkElement = screen.getByRole('link', { name: `${character.name} ${character.birth_year}` });

    expect(linkElement).toHaveAttribute('href', `/character/${character.name}`);
  });

  it('renders observer div when observerRef is provided', () => {
    const observerRefMock = jest.fn();
    render(
      <CharacterCard character={character} observerRef={observerRefMock} />
    );

    const observerDiv = screen.getByTestId('observer-div');

    expect(observerDiv).toBeInTheDocument();
    expect(observerRefMock).toHaveBeenCalledTimes(1);
  });

  it('does not render observer div when observerRef is null', () => {
    render(<CharacterCard character={character} observerRef={null} />);

    const observerDiv = screen.queryByTestId('observer-div');

    expect(observerDiv).not.toBeInTheDocument();
  });
});

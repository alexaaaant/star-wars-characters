import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterDetails } from '../components/CharacterDetails';
import { charactersStore } from '../stores/CharactersStore';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'Luke Skywalker' }),
}));

// jest.mock('../stores/CharactersStore', () => ({
//   charactersStore: {
//     characters: new Map([
//       ['Luke Skywalker', { name: 'Luke Skywalker', birth_year: '19BBY', gender: 'male', height: '172' }],
//       ['Leia Organa', { name: 'Leia Organa', birth_year: '19BBY', gender: 'female', height: '150' }],
//     ]),
//     updateCharacter: jest.fn(),
//   },
// }));

describe('CharacterDetails', () => {
  beforeEach(() => {
    charactersStore.characters = new Map([
      [
        'Luke Skywalker',
        {
          name: 'Luke Skywalker',
          birth_year: '19BBY',
          gender: 'male',
          height: '172',
        },
      ],
      [
        'Leia Organa',
        {
          name: 'Leia Organa',
          birth_year: '19BBY',
          gender: 'female',
          height: '150',
        },
      ],
    ]);
  });

  it('makes a snapshot', () => {
    const { container } = render(<CharacterDetails />);

    expect(container).toMatchSnapshot();
  });

  it('renders character details', () => {
    render(<CharacterDetails />);

    const nameElement = screen.getByText('Luke Skywalker');
    const birthYearInput = screen.getByLabelText('Birth Year');
    const genderInput = screen.getByLabelText('Gender');
    const heightInput = screen.getByLabelText('Height');

    expect(nameElement).toBeInTheDocument();
    expect(birthYearInput).toHaveValue('19BBY');
    expect(genderInput).toHaveValue('male');
    expect(heightInput).toHaveValue('172');
  });

  it('updates character birth year', () => {
    render(<CharacterDetails />);

    const birthYearInput = screen.getByLabelText('Birth Year');

    const newValue = '20BBY';
    fireEvent.change(birthYearInput, { target: { value: newValue } });

    expect(birthYearInput).toHaveValue(newValue);
  });

  it('updates character gender', () => {
    render(<CharacterDetails />);

    const genderInput = screen.getByLabelText('Gender');

    const newValue = 'female';
    fireEvent.change(genderInput, { target: { value: newValue } });

    expect(genderInput).toHaveValue(newValue);
  });

  it('updates character height', () => {
    render(<CharacterDetails />);

    const heightInput = screen.getByLabelText('Height');

    const newValue = 'female';
    fireEvent.change(heightInput, { target: { value: newValue } });

    expect(heightInput).toHaveValue(newValue);
  });
});

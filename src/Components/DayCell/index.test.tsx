import React from 'react';
import { render } from '@testing-library/react-native';
import DayCell from './index';

it('renders the letter M when day is M', () => {
  const { getByText } = render(<DayCell day="M" highlighted={false} />);
  expect(getByText('M')).toBeDefined();
});

it('renders with a non-white background when highlighted is true', () => {
  const { getByTestId } = render(<DayCell day="M" highlighted={true} />);
  const dayCell = getByTestId('day-cell');
  expect(dayCell.props.style.backgroundColor).not.toBe('#FFFFFF');
});

it('renders the letter T when day is t', () => {
  const { getByText } = render(<DayCell day="t" highlighted={false} />);
  expect(getByText('T')).toBeDefined();
});

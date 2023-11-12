import React from 'react';
import { render } from '@testing-library/react-native';
import TableHeader from './TableHeader';
import { styles } from '../DayCell/';

it('renders seven DayCells', () => {
  const { getAllByTestId } = render(<TableHeader />);
  expect(getAllByTestId('day-cell').length).toBe(7);
});

it('highlights the DayCell for Monday when the day is Monday', () => {
  jest.useFakeTimers().setSystemTime(new Date('2023-11-13'));
  const { getAllByTestId } = render(<TableHeader />);
  expect(getAllByTestId('day-cell')[0].props.style).toContainEqual(styles.highlighted);
});

it('highlights the DayCell for Sunday when the day is Sunday', () => {
  jest.useFakeTimers().setSystemTime(new Date('2023-11-19'));
  const { getAllByTestId } = render(<TableHeader />);
  expect(getAllByTestId('day-cell')[6].props.style).toContainEqual(styles.highlighted);
});
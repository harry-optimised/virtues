import React from 'react';
import { MD3Theme } from 'react-native-paper';
import { render } from '@testing-library/react-native';
import VirtueCell, { styles } from './index';


it('renders the text Order when virtue is order', () => {
  const { getByText } = render(
    <VirtueCell virtue="order" highlighted={false} selected={false}/>
  );
  expect(getByText('Order')).toBeDefined();
});

it('renders with a highlighted style when highlighted is true', () => {
  const { getByTestId } = render(<VirtueCell virtue="M" highlighted={true} selected={false}/>);
  const dayCell = getByTestId('virtue-cell'); 
  expect(dayCell.props.style).toContainEqual(styles.highlighted);
});

it('renders with no highlighted style when highlighted is false', () => {
  const { getByTestId } = render(<VirtueCell virtue="M" highlighted={false} selected={false}/>);
  const dayCell = getByTestId('virtue-cell');
  expect(dayCell.props.style).not.toContainEqual(styles.highlighted);
});

it('renders with selected style when selected is true', () => {
  const { getByTestId } = render(
    <VirtueCell virtue="patience" highlighted={false} selected={true} />
  );
  const virtueCell = getByTestId('virtue-cell');
  expect(virtueCell.props.style).toContainEqual(styles.selected);
});

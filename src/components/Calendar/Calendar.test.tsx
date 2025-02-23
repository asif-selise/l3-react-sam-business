import React from 'react';
import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import Calendar from './Calendar';
import dayjs, { type Dayjs } from 'dayjs';

import { renderRootProvider } from '../RootProviderTest/RootProviderTest';

describe('Calendar Component', () => {
  const minSelectableDate: Dayjs = dayjs().subtract(30, 'day');
  const maxSelectableDate: Dayjs = dayjs().add(30, 'day');
  const dateToday: Dayjs = dayjs();
  const selectedDate: Dayjs = dayjs();
  const onDateChange = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      minSelectableDate,
      maxSelectableDate,
      dateToday,
      selectedDate,
      onDateChange,
    };

    return renderRootProvider(<Calendar {...defaultProps} {...props} />);
  };

  test('renders Calendar component', () => {
    renderComponent();

    const buttonPrevious = screen.getByLabelText('previous');
    const buttonNext = screen.getByLabelText('next');
    const buttonToday = screen.getByRole('button', { name: 'Today' });
    const buttonSelectedDate = screen.getByRole('button', {
      name: selectedDate.format('dddd, D. MMMM YYYY'),
    });

    expect(buttonPrevious).toBeInTheDocument();
    expect(buttonNext).toBeInTheDocument();
    expect(buttonToday).toBeInTheDocument();
    expect(buttonSelectedDate).toBeInTheDocument();
  });

  test('opens the calendar popover when date button is clicked', async () => {
    renderComponent();

    const buttonSelectedDate = screen.getByRole('button', {
      name: selectedDate.format('dddd, D. MMMM YYYY'),
    });

    await user.click(buttonSelectedDate);

    const calendarPopover = await screen.findByLabelText('calendar-popover');
    expect(calendarPopover).toBeInTheDocument();
  });

  test('calls onDateChange when a new date is selected from calendar', async () => {
    renderComponent();

    const buttonSelectedDate = screen.getByText(selectedDate.format('dddd, D. MMMM YYYY'));

    await user.click(buttonSelectedDate);

    const calendarPopover = await screen.findByLabelText('calendar-popover');

    const dateButtons = calendarPopover.querySelectorAll('button');

    const randomIndex = 17;

    await user.click(dateButtons[randomIndex]);

    const selectedDateText = dateButtons[randomIndex].textContent;

    const newDate = selectedDateText
      ? selectedDate.date(parseInt(selectedDateText)).millisecond(0)
      : null;

    expect(onDateChange).toHaveBeenCalledWith(newDate);
  });

  test('calls onDateChange when previous button is clicked', async () => {
    renderComponent();

    const buttonPrevious = screen.getByLabelText('previous');

    await user.click(buttonPrevious);

    expect(onDateChange).toHaveBeenCalledWith(selectedDate.subtract(1, 'day'));
  });

  test('calls onDateChange when next button is clicked', async () => {
    renderComponent();

    const buttonNext = screen.getByLabelText('next');

    await user.click(buttonNext);

    expect(onDateChange).toHaveBeenCalledWith(selectedDate.add(1, 'day'));
  });

  test('calls onDateChange and resets to today\'s date when "Today" button is clicked', async () => {
    renderComponent();

    const buttonToday = screen.getByRole('button', { name: 'Today' });

    await user.click(buttonToday);

    expect(onDateChange).toHaveBeenCalledWith(dateToday);
  });

  // test('disables previous button when selected date is the same as minSelectableDate', () => {
  //   renderComponent({ selectedDate: minSelectableDate });

  //   expect(screen.getByLabelText('previous')).toBeDisabled();
  // });

  test('disables next button when selected date is the same as maxSelectableDate', () => {
    renderComponent({ selectedDate: maxSelectableDate });

    expect(screen.getByLabelText('next')).toBeDisabled();
  });
});

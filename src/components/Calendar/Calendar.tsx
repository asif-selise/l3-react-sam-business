import Iconify from '@/src/components/iconify/iconify';
import { Button, Popover, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { type Dayjs } from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CalendarProps {
  maxSelectableDate: Dayjs;
  dateToday: Dayjs;
  selectedDate: Dayjs;
  onDateChange: (date: Dayjs) => void;
}

const Calendar = ({ maxSelectableDate, dateToday, selectedDate, onDateChange }: CalendarProps) => {
  const { t } = useTranslation('index');

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [currentDate, setCurrentDate] = useState<Dayjs | null>(selectedDate);
  const [currentView, setCurrentView] = useState<'year' | 'month' | 'day'>('day');

  const handleViewChange = (newView: 'year' | 'month' | 'day') => {
    setCurrentView(newView);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateChange = (date: Dayjs) => {
    if (currentView === 'day' && date && date.isValid()) {
      setCurrentDate(date);
      onDateChange(date);
      handleClose();
    }
  };

  const renderCalendar = (
    <Popover
      aria-label="calendar-popover"
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      sx={{ mt: 2 }}
      slotProps={{
        paper: {
          sx: { borderRadius: 2 },
        },
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          onChange={handleDateChange}
          value={currentDate}
          maxDate={maxSelectableDate}
          views={['year', 'month', 'day']}
          onViewChange={handleViewChange}
        />
      </LocalizationProvider>
    </Popover>
  );

  return (
    <>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          mb: 2,
          gap: '5px',
        }}
      >
        <IconButton
          aria-label="previous"
          onClick={() => {
            handleDateChange(selectedDate?.subtract(1, 'day'));
          }}
        >
          <Iconify width={24} icon="ic:baseline-chevron-left" />
        </IconButton>

        <Button variant="text" onClick={handleClick} sx={{ minWidth: '115px' }}>
          <Typography variant="subtitle1" sx={{ fontSize: '15px' }}>
            {selectedDate?.format('dddd, D. MMMM YYYY')}
          </Typography>
        </Button>

        <IconButton
          aria-label="next"
          disabled={selectedDate?.isSame(maxSelectableDate, 'day')}
          onClick={() => {
            handleDateChange(selectedDate?.add(1, 'day'));
          }}
        >
          <Iconify width={24} icon="ic:baseline-chevron-right" />
        </IconButton>

        <Button
          aria-label="Today"
          variant="outlined"
          size="small"
          onClick={() => {
            handleDateChange(dateToday);
          }}
          sx={{
            color: 'primary.main',
          }}
        >
          {t('TODAY')}
        </Button>
      </Stack>

      {renderCalendar}
    </>
  );
};

export default Calendar;

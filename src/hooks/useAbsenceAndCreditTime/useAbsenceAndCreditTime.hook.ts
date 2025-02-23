import { type Dayjs } from 'dayjs';
import useTechnicianData from '../useTechnicianData/useTechnicianData.hook';
import useIndexedDbData from '../useIndexedDbData/useIndexedDbData.hook';
import { type AppointmentType } from '../useTourData/tourData.interface';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useCheckNumberOfDays from '../useCheckNumberOfDays/useCheckNumberOfDays.hook';
import { type CheckNumberOfDaysQueryFields } from '@/src/modules/DataMenu/components/ReportSection/components/AddAbsenceReport/interfaces';
import { type DayPart } from '@/src/modules/DataMenu/components/ReportSection/components/AddAbsenceReport/Types';

export const useAbsenceAndCreditTime = (
  kindId: number,
  fromDate: Dayjs | null,
  fromDateDayPart: DayPart | null,
  toDate: Dayjs | null,
  toDateDayPart: DayPart | null,
  countDays: number | null,
  remarks: string | null,
  accompaniedBy: number | null
) => {
  const { t } = useTranslation('index');
  const { data: technicianData } = useTechnicianData();

  const [technicianEmployeeNumber, setTechnicianEmployeeNumber] = useState<number | null>(null);

  const { dataItem: appointmentType, getDataItem: getAppointmentType } =
    useIndexedDbData<AppointmentType>('TourPlanData', 'AppointmentTypes');

  const query: CheckNumberOfDaysQueryFields = {
    TechnicianEmployeeNumber: technicianEmployeeNumber ?? 0,
    FromDate: fromDate?.format('YYYY-MM-DD') ?? null,
    FromDateDayPart: fromDateDayPart ?? null,
    ToDate: toDate?.format('YYYY-MM-DD') ?? null,
    ToDateDayPart: toDateDayPart ?? null,
    CountDays: countDays,
  };

  const { data: numberOfDaysData } = useCheckNumberOfDays(query);

  useEffect(() => {
    if (kindId) {
      getAppointmentType('Id', kindId);
    }
  }, [kindId]);

  useEffect(() => {
    if (technicianData?.technicianEmployeeNumber) {
      setTechnicianEmployeeNumber(technicianData.technicianEmployeeNumber);
    }
  }, [technicianData]);

  let viewNames;

  switch (appointmentType?.ViewMode) {
    case 'AbsentMessage':
      viewNames = {
        KindId: 'Grund der Abwesenheit',
        FromDate: 'von',
        FromDateDayPart: 'von-Tagesteil',
        ToDate: 'bis',
        ToDateDayPart: 'bis-Tagesteil',
        CountDays: 'Anzahl Tage',
        Remarks: 'Bemerkung',
      };
      break;

    default:
      viewNames = {
        FromDate: 'Datum',
        FromTime: 'Zeit von',
        ToTime: 'Zeit bis',
        Remarks: 'Grund für die Gutschrift',
      };
      break;
  }

  const getDayPartText = (key: DayPart | null): string => {
    switch (key) {
      case 'FullWorkingDay':
        return t('FULL_WORKDAY');
      case 'Morning':
        return t('MORNING');
      case 'Afternoon':
        return t('AFTERNOON');
      default:
        return '';
    }
  };

  const errorTexts: string[] = [];

  if (fromDate !== null && toDate !== null) {
    if (toDate < fromDate) {
      errorTexts.push(
        "'" + viewNames.ToTime + "' muss grösser als '" + viewNames.FromTime + "' sein"
      );
    }

    if (fromDateDayPart !== null && fromDateDayPart === 'Morning') {
      let text =
        '[' +
        viewNames.FromDateDayPart +
        "] darf bei mehreren Tage nicht als '" +
        getDayPartText(fromDateDayPart) +
        "' gesetzt sein";
      text =
        appointmentType === null || appointmentType.ViewMode !== 'CreditTimeTracking'
          ? text +
            ' - Feld [' +
            viewNames.FromDateDayPart +
            '] oder [' +
            viewNames.ToDate +
            '] muss leer sein.'
          : text + '.';

      errorTexts.push(text);
    }

    if (toDateDayPart !== null && toDateDayPart === 'Afternoon') {
      let text2 =
        '[' +
        viewNames.ToDateDayPart +
        "] darf bei mehreren Tage nicht als '" +
        getDayPartText(toDateDayPart) +
        "' gesetzt sein";
      text2 =
        appointmentType == null || appointmentType.ViewMode !== 'CreditTimeTracking'
          ? text2 +
            '  - Feld [' +
            viewNames.ToDateDayPart +
            '] oder [' +
            viewNames.FromDate +
            '] muss leer sein.'
          : text2 + '.';

      errorTexts.push(text2);
    }
  }

  if (
    toDate === null &&
    fromDate !== null &&
    fromDateDayPart !== null &&
    fromDateDayPart === 'Morning' &&
    toDateDayPart !== null &&
    toDateDayPart === 'Afternoon'
  ) {
    errorTexts.push(
      "'" +
        viewNames.FromDateDayPart +
        "' und  '" +
        viewNames.ToDateDayPart +
        "' müssen bei einer ganztägigen Absenz  auf '" +
        getDayPartText('FullWorkingDay') +
        "' gesetzt sein"
    );
  }

  if (toDate === null && (countDays ?? 0) > 1.0) {
    errorTexts.push(
      "'" + viewNames.ToDate + "' muss gesetzt sein wenn '" + viewNames.CountDays + "' > 1 Tag ist"
    );
  }

  if (appointmentType !== null) {
    switch (appointmentType.ViewMode) {
      case 'AbsentMessage': {
        if (countDays !== null) {
          if (countDays <= 0.0) {
            errorTexts.push("'" + viewNames.CountDays + "' muss grösser als 0 sein");
          }
        } else {
          errorTexts.push("'" + viewNames.CountDays + "' muss gesetzt sein");
        }

        // const query: CheckNumberOfDaysQueryFields = {
        //   TechnicianEmployeeNumber: technicianData?.technicianEmployeeNumber ?? 0,
        //   FromDate: fromDate?.format('YYYY-MM-DD') ?? null,
        //   FromDateDayPart: fromDateDayPart ?? null,
        //   ToDate: toDate?.format('YYYY-MM-DD') ?? null,
        //   ToDateDayPart: toDateDayPart ?? null,
        //   CountDays: countDays,
        // };
        // const { data } = useCheckNumberOfDays(query);

        if (numberOfDaysData?.Status === false) {
          errorTexts.push(numberOfDaysData.Error);
        }

        // OkResult okResult = DataWriter.CheckNumberOfDays(dalZes, this);
        // if (okResult.IsNotOk)
        // {
        //     list.Add(okResult.Message ?? "");
        // }
        break;
      }

      case 'CreditTimeTracking': {
        if (remarks === null || remarks === '') {
          errorTexts.push("'" + viewNames.Remarks + "' muss gesetzt sein");
        }

        break;
      }
    }
  }

  return errorTexts;
};

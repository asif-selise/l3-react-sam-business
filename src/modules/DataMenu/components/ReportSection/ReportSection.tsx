import React, { useEffect, useState } from 'react';
import blankIcon from '@/public/assets/icons/ic_blank.svg';
import timeRecordIcon from '@/public/assets/icons/ic_time_record.svg';
import overviewGridIcon from '@/public/assets/icons/ic_overview_grid.svg';
import CommonSection from '../CommonSection/CommonSection';
import { useTranslation } from 'react-i18next';
import { type ActionCardDetail } from '@/src/components/ActionCard/types';
import AddCreditTimeRecording from './components/AddCreditTimeRecording/AddCreditTimeRecording';
import {
  CREDIT_TIME_APPOINTMENT_TYPE_ID,
  type AbsenceReportFields,
  type CreditTimeRecordingFields,
} from './types';
import AddAbsenceReport from './components/AddAbsenceReport/AddAbsenceReport';
import AbsenceCreditOverview from './components/AbsenceCreditOverview/AbsenceCreditOverview';
import { type Appointment } from '@/src/hooks/useTourData/tourData.interface';
import { v4 as uuidv4 } from 'uuid';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import useSaveAbsenceAndCreditTimeCommand from '@/src/hooks/useSaveAbsenceAndCreditTimeCommand/useSaveAbsenceAndCreditTimeCommand';
import { getDateTimeWithoutUTC } from '@/src/helpers/formatDate';
import useAbsenceAndCreditTimeOverview from '@/src/hooks/useAbsenceAndCreditTimeOverview/useAbsenceAndCreditTimeOverview.hook';
import { useDispatch } from 'react-redux';
import { showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';

const ReportSection = () => {
  const { t } = useTranslation('index');
  const [openAddCreditTimeRecording, setOpenAddCreditTimeRecording] = useState(false);
  const [openAddAbsenceReport, setOpenAddAbsenceReport] = useState(false);
  const [openAbsenceCreditOverview, setOpenAbsenceCreditOverview] = useState(false);
  const [sortedAppointmentsData, setSortedAppointmentsData] = useState<Appointment[]>([]);
  const [technicianEmployeeNumber, setTechnicianEmployeeNumber] = useState<number | null>(null);

  const { data: technicianData } = useTechnicianData();
  const { submitAddAbsenceAndCreditTime, response } = useSaveAbsenceAndCreditTimeCommand();
  const dispatch = useDispatch();

  useEffect(() => {
    if (technicianData?.technicianEmployeeNumber) {
      setTechnicianEmployeeNumber(technicianData.technicianEmployeeNumber);
    }
  }, [technicianData]);

  const {
    data: appointmentsData,
    isLoading: appointmentsDataIsLoading,
    refetch,
  } = useAbsenceAndCreditTimeOverview(technicianEmployeeNumber ?? null);

  useEffect(() => {
    if (appointmentsData) {
      const sortedData = appointmentsData.sort((a, b) => {
        const dateA = a.StartDate ? new Date(a.StartDate) : new Date(0);
        const dateB = b.StartDate ? new Date(b.StartDate) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setSortedAppointmentsData(sortedData);
    }
  }, [appointmentsData]);

  useEffect(() => {
    if (response.isSuccess) {
      setOpenAddAbsenceReport(false);
      setOpenAddCreditTimeRecording(false);
      refetch();
      dispatch(showSuccessMessage(t('REPORT_SAVED_SUCCESSFULLY')));
    }
  }, [response.isSuccess]);

  const actionCards: ActionCardDetail[] = [
    {
      icon: blankIcon,
      title: t('ABSENCE_REPORTS'),
      onClick: () => {
        setOpenAddAbsenceReport(true);
      },
    },
    {
      icon: timeRecordIcon,
      title: t('CREDIT_TIME_RECORDING'),
      onClick: () => {
        setOpenAddCreditTimeRecording(true);
      },
    },
    {
      icon: overviewGridIcon,
      title: t('ABSENCE_REPORTS_AND_CREDIT_NOTES_OVERVIEW'),
      onClick: () => {
        setOpenAbsenceCreditOverview(true);
      },
    },
    // {
    //   icon: timeTrackIcon,
    //   title: t('TIME_TRACKING'),
    //   onClick: () => {},
    // },
  ];

  const handleSubmitAbsenceReport = (formData: AbsenceReportFields) => {
    submitAddAbsenceAndCreditTime({
      AppointmentUId: uuidv4(),
      StartDate: formData.StartDate?.toISOString() ?? null,
      StartDateTimeOfDay: formData?.StartDateTimeOfDay ?? null,
      EndDate: formData.EndDate?.toISOString() ?? null,
      EndDateTimeOfDay: formData.EndDateTimeOfDay ?? null,
      DaysCount: Number(formData.DaysCount),
      Remark: formData.Remark,
      AppointmentTypeId: formData.AppointmentTypeId,
      TechnicianEmployeeNumber: technicianEmployeeNumber ?? null,
      AccompaniedBy: null,
      ApprovalLevel: 1,
      SystemUserWithoutDomain: technicianData?.systemUser ?? null,
      IsCompleted: false,
      AppointmentHistoryUIds: [uuidv4(), uuidv4()],
      Statuses: ['Added', 'Approved'],
    });
  };

  const handleSubmitCreditTimeRecording = (formData: CreditTimeRecordingFields) => {
    submitAddAbsenceAndCreditTime({
      AppointmentUId: uuidv4(),
      StartDate: getDateTimeWithoutUTC(formData.StartDate, formData.StartTime),
      StartDateTimeOfDay: null,
      EndDate: getDateTimeWithoutUTC(formData.StartDate, formData.EndTime),
      EndDateTimeOfDay: null,
      DaysCount: 0,
      Remark: formData.CreditReason,
      AppointmentTypeId: CREDIT_TIME_APPOINTMENT_TYPE_ID,
      TechnicianEmployeeNumber: technicianEmployeeNumber ?? null,
      AccompaniedBy: null,
      ApprovalLevel: 1,
      SystemUserWithoutDomain: technicianData?.systemUser ?? null,
      IsCompleted: false,
      AppointmentHistoryUIds: [uuidv4(), uuidv4()],
      Statuses: ['Added', 'Approved'],
    });
  };

  return (
    <>
      <CommonSection
        header={{
          title: t('REPORTS_AND_TRACKING'),
        }}
        actionCards={actionCards}
      />

      {openAddAbsenceReport && (
        <AddAbsenceReport
          onClose={() => {
            setOpenAddAbsenceReport(false);
          }}
          onSave={handleSubmitAbsenceReport}
        />
      )}

      {openAddCreditTimeRecording && (
        <AddCreditTimeRecording
          onClose={() => {
            setOpenAddCreditTimeRecording(false);
          }}
          onSave={handleSubmitCreditTimeRecording}
        />
      )}

      {openAbsenceCreditOverview && (
        <AbsenceCreditOverview
          onClose={() => {
            setOpenAbsenceCreditOverview(false);
          }}
          data={sortedAppointmentsData}
          isLoading={appointmentsDataIsLoading}
        />
      )}
    </>
  );
};

export default ReportSection;

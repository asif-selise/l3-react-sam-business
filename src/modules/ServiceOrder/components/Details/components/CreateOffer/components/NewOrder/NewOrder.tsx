import { Box, MenuItem, TextField } from '@mui/material';
import React, {
  type Dispatch,
  forwardRef,
  type SetStateAction,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import MA_KSFronten from '@/public/assets/images/MA_KSFronten.png';
import MA_Nischenmasse from '@/public/assets/images/MA_Nischenmasse.png';
import MA_GKPlatte from '@/public/assets/images/MA_GKPlatte.png';
import MA_GKSchaltkasten from '@/public/assets/images/MA_GKSchaltkasten.png';
import MA_GSIntegration from '@/public/assets/images/MA_GSIntegration.png';
import MA_GSNische from '@/public/assets/images/MA_GSNische.png';
import MA_DAFront from '@/public/assets/images/MA_DAFront.png';
import MA_DASeite from '@/public/assets/images/MA_DASeite.png';
import MA_Sockel from '@/public/assets/images/MA_Sockel.png';

import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type SamOfferType } from '@/src/hooks/useMasterData/masterData.interface';
import { Controller, useForm } from 'react-hook-form';
import { type SamOffer } from '@/src/hooks/useTourData/tourData.interface';
import { type OfferDimensionField, type FieldCombination } from '../../types';
import { COMMON } from '@/src/hooks/useCustomTheme/colors/commonColorPalette';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { type operationType } from '../../CreateOffer';

interface Props {
  type: operationType;
  selectedSamOfferType: number | null;
  newOfferData: Partial<SamOffer> | null;
  saveStepData: (data: Partial<SamOffer>) => void;
  setSelectedSamOfferType: Dispatch<SetStateAction<number | null>>;
}

const NewOrder = forwardRef(
  (
    { type, saveStepData, selectedSamOfferType, setSelectedSamOfferType, newOfferData }: Props,
    ref
  ) => {
    const { t } = useTranslation('index');
    const [imageAndFieldData, setImageAndFieldData] = useState<FieldCombination | null>(null);

    const { filteredDataList: samOfferTypes, getFilteredDataList: getSamOfferTypes } =
      useIndexedDbData<SamOfferType>('MasterData', 'SamOfferTypes');

    const { control, handleSubmit, reset } = useForm<any>({
      mode: 'onTouched',
      defaultValues: {
        NicheHeight: newOfferData?.NicheHeight,
        NicheWidth: newOfferData?.NicheWidth,
        NicheDepth: newOfferData?.NicheDepth,
        ExternalWidth: newOfferData?.ExternalWidth,
        ExternalHeight: newOfferData?.ExternalHeight,
        BaseHeight: newOfferData?.BaseHeight,
        NicheBottomHeight: newOfferData?.NicheBottomHeight,
        CutoutWidth: newOfferData?.CutoutWidth,
        CutoutHeight: newOfferData?.CutoutHeight,
        LowerHeight: newOfferData?.LowerHeight,
        DetailWidth: newOfferData?.DetailWidth,
        DetailHeight: newOfferData?.DetailHeight,
      },
    });

    useEffect(() => {
      if (type === 'edit' && newOfferData) {
        reset({
          SamOfferType: selectedSamOfferType,
          NicheHeight: newOfferData.NicheHeight,
          NicheWidth: newOfferData.NicheWidth,
          NicheDepth: newOfferData.NicheDepth,
          ExternalWidth: newOfferData.ExternalWidth,
          ExternalHeight: newOfferData.ExternalHeight,
          BaseHeight: newOfferData.BaseHeight,
          NicheBottomHeight: newOfferData.NicheBottomHeight,
          CutoutWidth: newOfferData.CutoutWidth,
          CutoutHeight: newOfferData.CutoutHeight,
          LowerHeight: newOfferData.LowerHeight,
          DetailWidth: newOfferData.DetailWidth,
          DetailHeight: newOfferData?.DetailHeight,
        });
      }
    }, [type, newOfferData, reset]);

    const imageAndFieldCombinations: FieldCombination[] = [
      {
        id: 1,
        for: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        images: [
          {
            ucLinks: MA_Nischenmasse,
            title: '[mm]',
            fields: [
              { label: t('WIDTH'), name: 'NicheWidth', top: '237px', left: '120px' },
              { label: t('HEIGHT'), name: 'NicheHeight', top: '120px', left: '10px' },
              { label: t('DEPTH'), name: 'NicheDepth', top: '223px', left: '255px' },
            ],
          },
          {
            ucMitte: MA_GKPlatte,
            title: '[mm]',
            fields: [
              { label: 'Aussschnittmass: Breite', name: 'CutoutWidth', top: '161px', left: '92px' },
              { label: 'Aussschnittmass: Teife', name: 'CutoutHeight', top: '90px', left: '153px' },
              { label: 'Aussenmass: Breite', name: 'ExternalWidth', top: '243px', left: '100px' },
              { label: 'Aussenmass: Teife', name: 'ExternalHeight', top: '93px', left: '290px' },
            ],
          },
          {
            ucRechts: MA_GSNische,
            title: '[mm]',
            fields: [
              { label: 'Hohe Nische', name: 'NicheBottomHeight', top: '124px', left: '230px' },
              { label: 'Hohe Sockel', name: 'BaseHeight', top: '190px', left: '20px' },
            ],
          },
        ],
      },
      {
        id: 2,
        for: 11,
        images: [
          {
            ucLinks: MA_Nischenmasse,
            title: 'Nischenmasse [mm]',
            fields: [
              { label: t('WIDTH'), name: 'NicheWidth', top: '237px', left: '120px' },
              { label: t('HEIGHT'), name: 'NicheHeight', top: '120px', left: '10px' },
              { label: t('DEPTH'), name: 'NicheDepth', top: '223px', left: '255px' },
            ],
          },
          {
            ucMitte: MA_KSFronten,
            title: 'Abmessungen der Fronten [mm]',
            fields: [
              { label: t('WIDTH'), name: 'ExternalWidth', top: '152px', left: '123px' },
              { label: t('TOP_HEIGHT'), name: 'ExternalHeight', top: '86px', left: '177px' },
              { label: t('BOTTOM_HEIGHT'), name: 'LowerHeight', top: '222px', left: '130px' },
            ],
          },
        ],
      },
      {
        id: 3,
        for: 12,
        images: [
          {
            ucLinks: MA_Nischenmasse,
            title: 'Nischenmasse [mm]',
            fields: [
              { label: t('WIDTH'), name: 'NicheWidth', top: '237px', left: '120px' },
              { label: t('HEIGHT'), name: 'NicheHeight', top: '120px', left: '10px' },
              { label: t('DEPTH'), name: 'NicheDepth', top: '223px', left: '255px' },
            ],
          },
          {
            ucMitte: MA_GKPlatte,
            title: 'GK Aussen und Auschnittm. [mm]',
            fields: [
              { label: 'Aussschnittmass: Breite', name: 'CutoutWidth', top: '161px', left: '92px' },
              { label: 'Aussschnittmass: Teife', name: 'CutoutHeight', top: '90px', left: '153px' },
              { label: 'Aussenmass: Breite', name: 'ExternalWidth', top: '243px', left: '100px' },
              { label: 'Aussenmass: Teife', name: 'ExternalHeight', top: '93px', left: '290px' },
            ],
          },
          {
            ucRechts: MA_GKSchaltkasten,
            title: 'Rechaud / Schaltkasten [mm]',
            fields: [
              { label: t('WIDTH'), name: 'DetailWidth', top: '206px', left: '126px' },
              { label: t('HEIGHT'), name: 'DetailHeight', top: '122px', left: '268px' },
              {
                label: t('WIDTH_SWITCHING_RANGE'),
                name: 'NicheBottomHeight',
                top: '50px',
                left: '127px',
              },
              { label: t('HEIGHT_SWITCHING_RANGE'), name: 'BaseHeight', top: '86px', left: '0px' },
            ],
          },
        ],
      },
      {
        id: 4,
        for: 13,
        images: [
          {
            ucLinks: MA_Nischenmasse,
            title: 'Korpus Masse [mm]',
            fields: [
              { label: t('WIDTH'), name: 'NicheWidth', top: '237px', left: '120px' },
              { label: t('HEIGHT'), name: 'NicheHeight', top: '120px', left: '10px' },
              { label: t('DEPTH'), name: 'NicheDepth', top: '223px', left: '255px' },
            ],
          },
          {
            ucMitte: MA_GSIntegration,
            title: 'Abmessungen der Integration [mm]',
            fields: [
              { label: t('WIDTH_BOTTOM'), name: 'CutoutWidth', top: '254px', left: '108px' },
              { label: t('HEIGHT'), name: 'CutoutHeight', top: '108px', left: '226px' },
              { label: t('WIDTH_AT_TOP'), name: 'ExternalWidth', top: '125px', left: '94px' },
              { label: t('TOP_HEIGHT'), name: 'ExternalHeight', top: '70px', left: '131px' },
              { label: t('BOTTOM_HEIGHT'), name: 'LowerHeight', top: '185px', left: '94px' },
            ],
          },
          {
            ucRechts: MA_GSNische,
            title: '60er GS [mm]',
            fields: [
              { label: 'Hohe Nische', name: 'NicheBottomHeight', top: '124px', left: '230px' },
              { label: 'Hohe Sockel', name: 'BaseHeight', top: '190px', left: '20px' },
            ],
          },
        ],
      },
      {
        id: 5,
        for: 14,
        images: [
          {
            ucLinks: MA_DAFront,
            title: 'Frontansicht [mm]',
            fields: [
              { label: t('OFFSET'), name: 'BaseHeight', top: '124px', left: '4px' },
              { label: t('DA_WIDTH'), name: 'NicheWidth', top: '230px', left: '120px' },
              { label: t('DA_HEIGHT'), name: 'NicheHeight', top: '95px', left: '260px' },
              {
                label: t('HEIGHT_OF_FURNITURE_INSIDE'),
                name: 'ExternalHeight',
                top: '53px',
                left: '96px',
              },
              {
                label: t('HEIGHT_OF_ENGINE_STRUCTURE'),
                name: 'CutoutHeight',
                top: '100px',
                left: '126px',
              },
              { label: 'Distanz UK DA-GK', name: 'LowerHeight', top: '192px', left: '166px' },
            ],
          },
          {
            ucMitte: MA_DASeite,
            title: 'Seitenschnitt [mm]',
            fields: [
              { label: t('DEPTH_MOTOR'), name: 'DetailWidth', top: '36px', left: '117px' },
              { label: 'Depth GWK incl. Front', name: 'ExternalWidth', top: '35px', left: '240px' },
              { label: 'DA Depth', name: 'NicheDepth', top: '248px', left: '175px' },
            ],
          },
        ],
      },
      {
        id: 6,
        for: [15, 16],
        images: [
          {
            ucLinks: MA_Nischenmasse,
            title: 'Gerätemasse [mm]',
            fields: [
              { label: t('WIDTH'), name: 'NicheWidth', top: '237px', left: '120px' },
              { label: t('HEIGHT'), name: 'NicheHeight', top: '120px', left: '10px' },
              { label: t('DEPTH'), name: 'NicheDepth', top: '223px', left: '255px' },
            ],
          },
          {
            ucMitte: MA_Sockel,
            title: 'Sockelmasse [mm]',
            fields: [
              { label: t('WIDTH'), name: 'ExternalWidth', top: '192px', left: '114px' },
              { label: t('BASE_HEIGHT'), name: 'BaseHeight', top: '100px', left: '145px' },
              { label: t('DEPTH'), name: 'ExternalHeight', top: '100px', left: '290px' },
            ],
          },
        ],
      },
    ];

    const prepareFields = () => {
      if (selectedSamOfferType) {
        const selectedCombination = imageAndFieldCombinations.find((combination) =>
          Array.isArray(combination.for)
            ? combination.for.includes(selectedSamOfferType)
            : combination.for === selectedSamOfferType
        );

        setImageAndFieldData(selectedCombination ?? null);
      }
    };

    const handleTypeChange = (id: number) => {
      setSelectedSamOfferType(id);
    };

    const onSubmit = (data: Partial<SamOffer>) => {
      saveStepData(data);
    };

    useImperativeHandle(ref, () => ({
      handleSubmitForm: () => {
        handleSubmit(onSubmit)();
      },
    }));

    useEffect(() => {
      getSamOfferTypes('IsInactive', false);
    }, []);

    useEffect(() => {
      if (selectedSamOfferType) {
        prepareFields();
      }
    }, [selectedSamOfferType]);

    return (
      <Box p={'0 0px 24px 0px'} width={'100%'}>
        <Controller
          control={control}
          name="SamOfferType"
          rules={{ required: t('FIELD_IS_REQUIRED') }}
          render={({ field, fieldState: { error } }) => {
            return (
              <TextField
                {...field}
                select
                label={t('NO_TYPE')}
                variant="outlined"
                value={selectedSamOfferType}
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
                onChange={(event) => {
                  field.onChange(event);
                  handleTypeChange(Number(event.target.value));
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 400,
                        width: '250px',
                        overflowY: 'auto',
                      },
                    },
                  },
                }}
                InputLabelProps={{
                  shrink: selectedSamOfferType !== null,
                }}
              >
                {samOfferTypes.map((item) => (
                  <MenuItem key={item.SamOfferTypeId} value={item.SamOfferTypeId}>
                    {item.Type}
                  </MenuItem>
                ))}
              </TextField>
            );
          }}
        />

        <Box
          width={'100%'}
          mt={'24px'}
          display={'flex'}
          columnGap={5}
          rowGap={3}
          justifyContent={'center'}
          flexWrap={'wrap'}
        >
          {imageAndFieldData?.images.map((item: any, index: number) => (
            <Box
              key={index}
              display={'flex'}
              maxWidth={'380px'}
              alignItems={'center'}
              flexDirection={'column'}
            >
              <OverflowTooltip text={item.title} />
              <Box
                minWidth={'310px'}
                height={'300px'}
                mt={'16px'}
                display={'flex'}
                columnGap={2}
                position={'relative'}
                sx={{
                  border: `2px solid ${COMMON.grey[300]}`,
                  borderRadius: 2,
                }}
              >
                {item.fields.map(
                  ({ label, name, top, left }: OfferDimensionField, fieldIndex: number) => (
                    <Box
                      key={fieldIndex}
                      position="absolute"
                      top={top ?? '10%'}
                      left={left ?? '10%'}
                      // width={'110px'}
                      zIndex={1}
                      sx={{
                        backgroundColor: COMMON.white,
                        boxShadow: '0px 4px 8px 0px #919eab28',
                        borderRadius: 1,
                      }}
                    >
                      <Controller
                        key={fieldIndex}
                        name={name}
                        control={control}
                        rules={{
                          validate: {
                            greaterThanZero: (value) => {
                              if (value === null || value === undefined) return true;
                              return value > 0 || `${t('VALUE_MUST_BE_AT_LEAST')} 0`;
                            },
                            lessThan3000: (value) => {
                              if (value === null || value === undefined) return true;
                              return value < 3000 || `${t('VALUE_MUST_BE_AT_MOST')} 3000`;
                            },
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            type="number"
                            variant="outlined"
                            sx={{
                              width: '100%',
                              '& input': {
                                height: '2px',
                                border: '2px',
                                width: '50px',
                              },
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: COMMON.grey[700],
                                },
                                '&:hover fieldset': {
                                  borderColor: COMMON.grey[700],
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: COMMON.grey[700],
                                },
                              },
                            }}
                            {...field}
                            label={label}
                            inputProps={{
                              min: 0,
                              max: 3000,
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                            error={!!error}
                            helperText={''}
                          />
                        )}
                      />
                    </Box>
                  )
                )}
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 2,
                    opacity: 0.5,
                  }}
                >
                  <img
                    src={item.ucLinks || item.ucMitte || item.ucRechts}
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                      borderRadius: 2,
                    }}
                    alt={'Dimension image1'}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
);
NewOrder.displayName = 'NewOrder';
export default NewOrder;

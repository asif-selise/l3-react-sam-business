import { formatDetailedDateTime, getDate } from '@/src/helpers/formatDate';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import type { SamOfferType, TempTechnician } from '@/src/hooks/useMasterData/masterData.interface';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import {
  type SamOfferProductDetail,
  type SamOffer,
} from '@/src/hooks/useTourData/tourData.interface';
import { Box, Button, TextField } from '@mui/material';
import React, {
  type Dispatch,
  forwardRef,
  type SetStateAction,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import WoodOrderModal from '../../../WoodOrderModal/WoodOrderModal';
import OfferArticleList from '../OfferArticleList/OfferArticleList';
import { getAllArticleListService } from '../../Services/GetAllArticleListService';
import { useDispatch } from '@/src/redux/store';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { type operationType } from '../../CreateOffer';
import { type Article } from '../../Interfaces/Article';

interface ArticleData {
  articles: Article[];
  error: { message: string; productId: number } | null;
}
interface Props {
  type: operationType;
  offerType: number;
  newOfferData: Partial<SamOffer> | null;
  saveStepData: (data: Partial<SamOffer>) => void;
  samOfferUId: string;
  samOfferId: number;
  detailProducts: SamOfferProductDetail[];
  setActiveLoader: Dispatch<SetStateAction<boolean>>;
}

const OfferForm = forwardRef(
  (
    {
      offerType,
      newOfferData,
      saveStepData,
      type,
      samOfferUId,
      samOfferId,
      detailProducts,
      setActiveLoader,
    }: Props,
    ref
  ) => {
    const { t } = useTranslation('index');
    const dispatch = useDispatch();
    const technicianDataResponse = useTechnicianData();
    const serviceOrderId = useSelector((state: any) => state.serviceOrder.id);

    const [technicianName, setTechnicianName] = useState<string>('');
    const [openWoodOrderModal, setOpenWoodOrderModal] = useState(false);
    const [openArticleListModal, setOpenArticleListModal] = useState(false);
    const [articlesData, setArticlesData] = useState<ArticleData>();

    const { dataList: samOfferTypes, getDataList: getSamOfferTypes } =
      useIndexedDbData<SamOfferType>('MasterData', 'SamOfferTypes');

    const { dataList: technicianList, getDataList: getTechnicianList } =
      useIndexedDbData<TempTechnician>('MasterData', 'TempTechnicians');

    const {
      reset,
      register,
      getValues,
      handleSubmit,
      formState: { errors },
    } = useForm<Partial<SamOffer>>({
      mode: 'onTouched',
      defaultValues: {
        OrderId: serviceOrderId,
        UId: samOfferUId,
        SamOfferId: samOfferId,
        TechnicianId: technicianDataResponse.data?.technicianId,
        TakenOverAt: null,
        ApprovalDate: null,
        TakenOverUser: null,
        CreatedAt: formatDetailedDateTime(new Date()),
        UpdatedAt: formatDetailedDateTime(new Date()),
        ChangedByNo: technicianDataResponse.data?.systemUser,
        Remark: newOfferData?.Remark,
      },
    });

    useEffect(() => {
      if (type === 'edit' && newOfferData) {
        reset({
          OrderId: newOfferData.OrderId,
          UId: newOfferData.UId,
          SamOfferId: newOfferData.SamOfferId,
          TechnicianId: newOfferData.TechnicianId,
          TakenOverAt: newOfferData.TakenOverAt,
          ApprovalDate: newOfferData.ApprovalDate,
          TakenOverUser: newOfferData.TakenOverUser,
          CreatedAt: newOfferData.CreatedAt,
          UpdatedAt: formatDetailedDateTime(new Date()),
          ChangedByNo: newOfferData.ChangedByNo,
          Remark: newOfferData.Remark,
        });
      }
    }, [type, newOfferData, reset]);

    const getTechnicianFullName = (technicianId: number | undefined) => {
      const technician = technicianList.find((technician) => technician.Id === technicianId);
      return technician ? technician.FullName : null;
    };

    const prepareTechnicianName = () => {
      if (type === 'add' && technicianDataResponse.data) {
        setTechnicianName(technicianDataResponse.data.fullName);
      }
      if (type === 'edit' && technicianList.length && newOfferData) {
        setTechnicianName(getTechnicianFullName(newOfferData.TechnicianId) ?? '');
      }
    };

    const getOfferType = () => {
      const offerData = samOfferTypes.find((item) => item.SamOfferTypeId === offerType);
      return offerData?.Type;
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
      getSamOfferTypes().then();
    }, []);

    const getAllArticleList = async () => {
      setActiveLoader(true);
      const articleList = await getAllArticleListService(detailProducts);
      setArticlesData(articleList);
      setActiveLoader(false);
    };

    useEffect(() => {
      getAllArticleList();
    }, []);

    useEffect(() => {
      if (type === 'edit') getTechnicianList().then();
    }, [type]);

    useEffect(() => {
      prepareTechnicianName();
    }, [type, newOfferData, technicianList, technicianDataResponse]);

    const handleOpenArticleListModal = async () => {
      if (articlesData?.error) {
        dispatch(
          showErrorMessage(
            t(articlesData.error.message, { productId: articlesData.error.productId })
          )
        );
      } else {
        setOpenArticleListModal(true);
      }
    };

    return (
      <Box p={'24px'} display={'flex'} flexDirection={'column'} rowGap={3}>
        <Box display={'flex'} columnGap={3}>
          <TextField
            fullWidth
            disabled
            required
            value={sanitizeData(technicianName)}
            label={t('TECHNICIAN_NAME')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            disabled
            required
            label={t('ID')}
            InputLabelProps={{ shrink: true }}
            {...register('SamOfferId', { required: true })}
            {...(errors.SamOfferId && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
          />
          <TextField
            fullWidth
            disabled
            required
            label={t('SO_ID')}
            InputLabelProps={{ shrink: true }}
            {...register('OrderId', { required: true })}
            {...(errors.OrderId && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
          />
        </Box>
        <Box display={'flex'} columnGap={3}>
          <TextField
            fullWidth
            disabled
            required
            label={t('OFFER_TYPE')}
            InputLabelProps={{ shrink: true }}
            value={getOfferType()}
          />
          <TextField
            fullWidth
            disabled
            required
            label={t('CHANGED_BY')}
            InputLabelProps={{ shrink: true }}
            {...register('ChangedByNo', { required: true })}
            {...(errors.ChangedByNo && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
          />
          <TextField
            fullWidth
            disabled
            required
            label={t('CHANGED_ON')}
            InputLabelProps={{ shrink: true }}
            value={getDate(String(getValues('UpdatedAt')))}
            {...register('UpdatedAt', { required: true })}
            {...(errors.UpdatedAt && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
          />
        </Box>
        <Box display={'flex'} columnGap={3}>
          <TextField
            fullWidth
            disabled
            label={t('TAKEN_OVER_FROM')}
            InputLabelProps={{ shrink: true }}
            {...register('TakenOverUser')}
          />

          <TextField
            fullWidth
            disabled
            label={t('TAKEN_OVER_AT')}
            InputLabelProps={{ shrink: true }}
            value={getDate(getValues('TakenOverAt') ? String(getValues('TakenOverAt')) : null)}
            {...register('TakenOverAt')}
          />

          <TextField
            fullWidth
            disabled
            required
            label={t('CREATED_ON')}
            InputLabelProps={{ shrink: true }}
            value={getDate(String(getValues('CreatedAt')))}
            {...register('CreatedAt', { required: true })}
            {...(errors.CreatedAt && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
          />
        </Box>
        <Box display={'flex'} columnGap={3}>
          <TextField
            fullWidth
            disabled
            label={t('RELEASED_ON')}
            InputLabelProps={{ shrink: true }}
            {...register('ApprovalDate')}
          />
          <TextField
            fullWidth
            multiline
            label={t('REMARKS')}
            InputLabelProps={{ shrink: true }}
            {...register('Remark', {
              maxLength: {
                value: 600,
                message: t('MAX_CHARACTER_600_IS_ALLOWED'),
              },
            })}
            error={!!errors.Remark}
            helperText={errors.Remark?.message}
          />
          <Box
            width={'100%'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            columnGap={3}
          >
            <Button
              fullWidth
              sx={{ height: '5.5vh' }}
              variant="soft"
              color="primary"
              onClick={() => {
                setOpenWoodOrderModal(true);
              }}
            >
              {t('WOOD_ORDER')}
            </Button>
            <Button
              fullWidth
              sx={{ height: '5.5vh' }}
              variant="soft"
              color="primary"
              onClick={handleOpenArticleListModal}
            >
              {t('ARTICLE_LIST')}
            </Button>
          </Box>
        </Box>

        {openWoodOrderModal && (
          <WoodOrderModal
            onClose={() => {
              setOpenWoodOrderModal(false);
            }}
            samOfferUId={samOfferUId}
            samOfferId={samOfferId}
            hideBackdrop
            showSamOfferWoodOrders={true}
          />
        )}

        {openArticleListModal && articlesData?.articles && (
          <OfferArticleList
            onClose={() => {
              setOpenArticleListModal(false);
            }}
            hideBackdrop
            data={articlesData.articles}
          />
        )}
      </Box>
    );
  }
);

OfferForm.displayName = 'OfferForm';

export default OfferForm;

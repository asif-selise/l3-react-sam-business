import ShowPhotos from './components/ShowPhotos/ShowPhotos';
import { useState, forwardRef, useImperativeHandle } from 'react';

const Photo = forwardRef((_, ref) => {
  const [openNewPhoto, setOpenNewPhoto] = useState(false);

  useImperativeHandle(ref, () => ({
    handleOpenNewPhoto: () => {
      setOpenNewPhoto(true);
    },
  }));

  return <ShowPhotos openNewPhoto={openNewPhoto} setOpenNewPhoto={setOpenNewPhoto} />;
});

Photo.displayName = 'Photo';

export default Photo;

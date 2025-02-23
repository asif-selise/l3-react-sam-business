import { memo, forwardRef } from 'react';
import { StyledScrollbar, StyledRootScrollbar } from './styles';
import { type ScrollbarProps } from './types';

const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(({ children, sx, ...other }, ref) => {
  return (
    <StyledRootScrollbar>
      <StyledScrollbar
        scrollableNodeProps={{
          ref,
        }}
        clickOnTrack={false}
        sx={sx}
        {...other}
      >
        {children}
      </StyledScrollbar>
    </StyledRootScrollbar>
  );
});

Scrollbar.displayName = 'Scrollbar';
export default memo(Scrollbar);

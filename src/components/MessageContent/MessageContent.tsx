import { Box, Typography } from '@mui/material';

interface Props {
  messages: string[];
}

const MessageContent = ({ messages }: Props) => {
  return (
    <Box sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {messages.map((message, index) => (
        <Typography variant="body1" key={index}>
          {message}
        </Typography>
      ))}
    </Box>
  );
};

export default MessageContent;

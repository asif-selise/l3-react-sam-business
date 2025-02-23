import { Alert, Box, Typography } from '@mui/material';

const MandantError = () => {
  return (
    <Box maxWidth={'900px'}>
      <Box display={'flex'} flexDirection={'column'} mt={4}>
        <Alert severity="warning" variant="filled">
          {`Achtung! Der Mandant dieser QR-Codeetikette stimmt nicht mit dem Firmenlogo der Etikette
          überein!`}
        </Alert>
      </Box>
      <Box pl={3} mt={2}>
        <Typography variant="body1" mt={2} mb={2} color={'black'}>
          {`Um dies zu korrigieren führen Sie folgende Schritte aus:`}
        </Typography>

        <Typography variant="body2">{`1. SAM synchronisieren!`}</Typography>
        <Typography variant="body2">
          {`2. Bei Bedarf tausschen Sie die QR-Codeetikette aus: (Menü 'Alte QR-Code-Etikette
          ersetzen') Das Firmenlogo der Etikette muss mit dem Mandanten übereinstimmen!`}
        </Typography>
        <Typography variant="body2">{`3. Lesen Sie die QR-Codeetikette auf einem Auftrag mit der korrekten Verwaltung und der korrekten Serviceadresse mit Button [2. Gerät...] -> Menü 'QR-Code' -> 'Geräteangaben ändern (SN/PN...)' ein.`}</Typography>
        <Typography variant="body2">
          {`4. SAM synchronisieren und mit Menü 'QR-Code Infos' nochmals überprüfen.`}
        </Typography>
        <Typography variant="body1" mt={2} color={'black'}>
          {`Danke!`}
        </Typography>
      </Box>
    </Box>
  );
};

export default MandantError;

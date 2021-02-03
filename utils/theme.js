import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

export const theme = responsiveFontSizes(
    createMuiTheme({
      palette: {
        primary: { main: '#2D2D2D' },
        secondary: { main: '#FF7492' },
        info: { main: '#343434' },
        success: { main: '#4CAF50'},
        error: {main: '#FF0000'}
      },
    }),
    {
      factor: 4,
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    }
  );
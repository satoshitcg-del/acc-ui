import { createTheme } from '@mui/material/styles';

const themeSwitch = createTheme({
    components: {
      MuiSwitch: {
        styleOverrides: {
            solid: {
                '&.Mui-checked': {
                  // Define your 'solid' styles for the checked state here
                },
                '&.Mui-disabled': {
                  // Define your 'solid' styles for the disabled state here
                },
                // Other style variations as needed
              },
        },
      },
    },
  });

  export default themeSwitch;
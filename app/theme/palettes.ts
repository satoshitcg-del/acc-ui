


import { type PaletteOptions } from "@mui/material/styles";

export const paletteColor = {

  DodgerBlue: '#2196F3',
  SeaGreen: '#2E7D32',
  Clementine: '#EF6C00',
  PersianRed: '#D32F2F',
  Seance: '#9C27B0',
  Zumthor: '#E0E7FF',
  Malibu: '#90CAF9',
  Fern: '#66BB6A',
  Sunshade: '#FFA726',
  Pomegranate: '#F44336',
  Amethyst: '#BA68C8',
  DoveGray: '#666666',
  SilverChalice: '#9E9E9E',
  WildSand: '#F5F5F5',
  Solitude: '#EDF7FE',
  Alto: '#E0E0E0',
  Black: '#000000',
  White: '#FFFFFF',

}

export const base = {

  font: {
    family: {
      default: 'Roboto',
    },
    size: {
      sm: '',
      md: '1rem',
      lg: ''
    }
  },

  border: {
    radius: {
      sm: '0.25rem',
      md: '0.5rem'
    }
  },

}



export const light: PaletteOptions = {
  mode: "light",

  ...base,

  primary: {
    main: "rgb(24,119,242)",
  },

  status: {
    success: paletteColor.SeaGreen,
    invalid: paletteColor.PersianRed,
    pending: paletteColor.DodgerBlue,
    not_ready: paletteColor.Clementine
  },

  background: {
    default: "#ffffff",
  },

  button: {
    bg: {
      primary: paletteColor.DodgerBlue,
      secondary: paletteColor.PersianRed,
      tertiary: paletteColor.Seance,
      disabled: paletteColor.SilverChalice,
      success: paletteColor.SeaGreen,
    }
  },

  modal: {
    title_color: paletteColor.DodgerBlue,
  },

  content: {
    background: paletteColor.SilverChalice,
    border: {
      color: paletteColor.SilverChalice
    },
    text: {
      color: paletteColor.DoveGray,
      disabled: paletteColor.SilverChalice,
    },
    input: {
      text: paletteColor.DoveGray,
      hover: '',
    }
  },

  example: {
    primary: "#49b4ff",
    secondary: "#ef3054",
    inherit: "rgba(224, 224, 224, 0.52)",
    tableHeader: 'rgb(60, 144, 255)'
  },

  dataGrid: {
    text: {
      color: paletteColor.Black
    },
    background: 'rgb(24,119,242)'
  }
};

export const dark: PaletteOptions = {
  mode: "dark",

  ...base,

  status: {
    success: paletteColor.SeaGreen,
    invalid: paletteColor.PersianRed,
    pending: paletteColor.DodgerBlue,
    not_ready: paletteColor.Clementine
  },

  primary: {
    main: "rgb(45,136,255)",
  },

  background: {
    default: "rgb(24,25,26)",
  },

  button: {
    bg: {
      primary: paletteColor.DodgerBlue,
      secondary: paletteColor.PersianRed,
      tertiary: paletteColor.Seance,
      disabled: paletteColor.SilverChalice,
      success: paletteColor.SeaGreen,
    }
  },

  modal: {
    title_color: paletteColor.DodgerBlue,
  },

  content: {
    background: paletteColor.SilverChalice,
    border: {
      color: paletteColor.SilverChalice
    },
    text: {
      color: paletteColor.DoveGray,
      disabled: paletteColor.SilverChalice,
    },
    input: {
      text: paletteColor.DoveGray,
      hover: '',
    }
  },

  example: {
    primary: "#49b4ff",
    secondary: "#ef3054",
    inherit: "rgba(224, 224, 224, 0.52)",
    tableHeader: paletteColor.DoveGray
  },

  dataGrid: {
    text: {
      color: paletteColor.White
    },
    background: 'rgb(45,136,255)'
  }

};

export default { light, dark };

/**
 * Append custom variables to the palette object.
 * https://mui.com/material-ui/customization/theming/#custom-variables
 */
declare module "@mui/material/styles" {
  interface Palette extends CustomPaletteOptions {
    example: {
      primary: string;
      secondary: string;
      inherit: string;
      tableHeader: string;
    };
  }

  interface PaletteOptions extends CustomPaletteOptions {
    example: {
      primary: string;
      secondary: string;
      inherit: string;
      tableHeader: string;
    };
  }
}

interface CustomPaletteOptions {



  status?: {
    success: string;
    pending: string;
    invalid: string;
    not_ready: string;
  }

  modal: {
    title_color: string;
  }

  border?: {
    radius: {
      sm: string,
      md: string
    }
  },

  font?: {
    family: {
      default: string,
      secondary?: string,
    },
    size: {
      sm: string,
      md: string,
      lg: string,
    }
  }

  button?: {
    text?: {
      primary: string;
      secondary: string;
      disabled: string;
      correct: string,
      wrong: string,
      hover: {
        primary: string;
        secondary: string;
        disabled: string;
      }
    },
    bg?: {
      primary?: string;
      secondary?: string;
      tertiary?: string;
      disabled?: string;
      correct?: string,
      wrong?: string,
      success?: string,
      hover?: {
        primary?: string;
        secondary?: string;
        disabled?: string;
      }
    }
  }

  dataGrid: {
    text: {
      color: string
    }
    background: string
  }

  login?: {
    backgroundInputForm: string,
    icon: string,
    input: string,
    placeholder: string,
  };


  content?: {
    background: string;
    border?: {
      color?: string
    }
    text: {
      color: string;
      disabled: string;
    }
    input: {
      text: string;
      hover: string;
    }
  };
}
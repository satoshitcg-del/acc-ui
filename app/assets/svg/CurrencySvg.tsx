import React from 'react';
import { SvgIcon, SvgIconProps } from "@mui/material";
import { MonetizationOn, } from "@mui/icons-material";
interface IconSvgProps extends SvgIconProps {
  icon?: string;
  className?: string;
  active?: boolean;
}

const CurrencySvg: React.FC<IconSvgProps> = (props) => {
  const { icon, ...other } = props;

  switch (icon) {
    case 'USDT':
      return (
          <SvgIcon role="img" xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" {...other} fill="none">
            <rect y="-0.00976562" width="60" height="60" rx="30" fill="#1BA27A" />
            <mask id="mask0_2931_116744"  maskUnits="userSpaceOnUse" x="0" y="-1" width="60" height="61">
              <rect y="-0.00976562" width="60" height="60" rx="30" fill="white" />
            </mask>
            <g mask="url(#mask0_2931_116744)">
              <path d="M45 14.9902H15V21.9902H26V47.9902H34V21.9902H45V14.9902Z" fill="white" />
              <path fillRule="evenodd" clipRule="evenodd" d="M30 32.3311C44.4713 32.3311 48 29.6471 48 27.9902C48 26.3334 39.9411 24.9902 30 24.9902C20.0589 24.9902 12 26.3334 12 27.9902C12 29.6471 15.5287 32.3311 30 32.3311ZM30 30.2402C38.8366 30.2402 46 29.2329 46 27.9902C46 26.7476 38.8366 25.7402 30 25.7402C21.1634 25.7402 14 26.7476 14 27.9902C14 29.2329 21.1634 30.2402 30 30.2402Z" fill="white" />
              <path fillRule="evenodd" clipRule="evenodd" d="M26 29.4707C26 29.4707 28.6631 29.7593 30 29.7593C31.3369 29.7593 34 29.4707 34 29.4707V30.0885C34 30.0885 32.8042 30.2971 30 30.2971C27.1958 30.2971 26 30.0885 26 30.0885V29.4707Z" fill="#1BA27A" />
            </g>
          </SvgIcon>
      );

    default:
      return(
        <MonetizationOn {...other}/>
      );
      break;
  }
};

export default CurrencySvg;
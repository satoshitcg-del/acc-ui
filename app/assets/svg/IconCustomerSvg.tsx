import React from 'react';
import { SvgIcon,SvgIconProps } from "@mui/material";
interface IconSvgProps extends SvgIconProps {
  icon?: string ;
  className?: string ;
  active?: boolean ;
}

const IconCustomerSvg: React.FC<IconSvgProps> = (props) => {
    const { icon , ...other } = props;

    switch (icon) {
      case 'edit':
        return (
          <SvgIcon width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_477_251)">
            <path d="M22 24H2V20H22V24ZM13.06 5.19L16.81 8.94L7.75 18H4V14.25L13.06 5.19ZM17.88 7.87L14.13 4.12L15.96 2.29C16.35 1.9 16.98 1.9 17.37 2.29L19.71 4.63C20.1 5.02 20.1 5.65 19.71 6.04L17.88 7.87Z" fill="#EF6C00"/>
            </g>
            <defs>
            <clipPath id="clip0_477_251">
            <rect width="24" height="24" fill="white"/>
            </clipPath>
            </defs>
          </SvgIcon>
        );
      case 'delete':
        return (
          <SvgIcon width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_477_597)">
            <path d="M6 21H18V7H6V21ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#D32F2F"/>
            </g>
            <defs>
            <clipPath id="clip0_477_597">
            <rect width="24" height="24" fill="white"/>
            </clipPath>
            </defs>
          </SvgIcon>

        );
      case 'empty':
        return (
          <SvgIcon className='w-[7rem] h-auto' xmlns="http://www.w3.org/2000/svg" width="101" height="66" viewBox="0 0 101 66" fill="none">
            <path d="M89.1113 5.84631C87.1669 2.20846 83.278 0 78.8334 0H22.1672C17.862 0 13.8335 2.20857 11.8893 5.97692L0.778046 28.0636C0.639509 28.4533 0.5 28.843 0.5 29.2327V47.8112C0.5 57.8156 9.25016 66 19.9438 66H81.0543C91.7489 66 100.498 57.8146 100.498 47.8112L100.5 29.103C100.5 28.7133 100.361 28.3236 100.222 27.9339L89.1113 5.84631ZM16.8897 8.18539C17.8624 6.36651 19.9453 5.19739 22.1677 5.19739H78.9727C81.1952 5.19739 83.278 6.36649 84.2507 8.18539L93.5562 26.5048L70.7786 26.5039C69.3894 26.5039 68.2791 27.4138 68.0011 28.5828C67.8626 29.1021 64.9456 42.225 50.5015 42.225C36.1961 42.225 33.1406 29.103 33.0019 28.5828C32.7239 27.4137 31.6127 26.5039 30.2244 26.5039H7.72292L16.8897 8.18539ZM94.9446 47.682C94.9446 54.828 88.6949 60.6743 81.0558 60.6743H19.9453C12.3062 60.6743 6.05652 54.828 6.05652 47.682V31.7017H28.1394C30.3618 38.0675 36.8896 47.4219 50.5003 47.4219C64.111 47.4219 70.6387 38.0675 72.8612 31.7017H94.9441L94.9446 47.682Z" fill="current"/>
          </SvgIcon>

        );
      default:
        break;    
    }
};

export default IconCustomerSvg;
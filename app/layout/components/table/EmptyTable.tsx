import React from 'react';
import { Box, Typography } from "@mui/material";
import IconTableSvg from "@/assets/svg/TableSvg.js"
import { useTranslation } from 'react-i18next';

/**
 *  Example
 *  
 *  <EmptyTable/>
 *  
 */

const EmptyTable: React.FC = (props) => {
    const { t } = useTranslation();
    const { ...other } = props;
    return (
        <Box className=" flex flex-col justify-center items-center mt-[10rem]" sx={{color: 'content.text.disabled'}}>
              <IconTableSvg className='w-[7rem] h-auto' icon='empty'/>
              <Typography  className="mt-5  text-center" variant="h6">
                {t("table.empty-table")}
                <br/><span>{t("table.please-search")}</span>
              </Typography>
        </Box>
      )
}


export default EmptyTable
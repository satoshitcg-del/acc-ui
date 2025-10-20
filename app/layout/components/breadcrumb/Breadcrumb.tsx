import React from 'react';
import { Breadcrumbs, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom"
import { Padding } from '@mui/icons-material';
import { ProductMasterType } from '@/core/enum';
/*
 Example 

 <Breadcrumbs/>

*/

const Breadcrumb: React.FC = () => {
  const location = useLocation()

  let currentLink: string = ""

  const crumbs: React.ReactNode[] = location.pathname.split('/')
    .filter(crumb => crumb !== '')
    .map((crumb, index) => {
      currentLink += `/${crumb}`
      const isLast = index === 2
      return (
        <Typography key={`${index} crumb`}>{decodeURIComponent(crumb)}{isLast ? `${location.state.prefix ? `(${location.state.prefix})` : ''} ${location.state.product_type === ProductMasterType.AUTO ? `(${location.state.fccy_name})` : ""}` : ''}</Typography>
      )
    })
  return (
    <Breadcrumbs sx={{ marginBottom: "0.5rem" }} separator="›" aria-label="breadcrumb">
      {crumbs}
    </Breadcrumbs>
  )
}

export default Breadcrumb
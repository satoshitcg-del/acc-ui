import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  TableContainer,
} from '@mui/material'

import ModalCustom from '../modal/Modal.js'
import { ExpandableTableRow } from './components/ExpandableTableRow.js';

interface discountProduct {
  discount_name: string | undefined,
  active: boolean,
}



const createDataSubProducts = (prefix: string, discount_product: discountProduct[],) => {
  return { prefix, discount_product };
}


export const ModalConfirmDeleteSubProduct = (props: any) => {
  const { title } = props

  const rowsSubProducts = [
    createDataSubProducts(
      '89vr955',
      [
        { discount_name: ' Discount A ', active: true },
        { discount_name: ' Discount B ', active: false },
        { discount_name: ' Discount C ', active: false },
      ]
    ),
    createDataSubProducts(
      '89vr999',
      [
        { discount_name: ' Discount A ', active: true },
        { discount_name: ' Discount B ', active: false },
        { discount_name: ' Discount C ', active: false },
      ]
    ),
    createDataSubProducts(
      '89vr975',
      [
        { discount_name: ' Discount A ', active: false },
        { discount_name: ' Discount B ', active: false },
        { discount_name: ' Discount C ', active: false },
      ]
    ),
  ];

  return (
    <ModalCustom
      open={true}
    >
      <Box>
        <Typography sx={{ mb: 2 }} variant="h5" align="left">
          {title}
        </Typography>
        <Alert severity="warning">Are you sure you want to delete this ?</Alert>
        <TableContainer sx={{ mt: "1rem", height: "20rem", width: "40vw" }}>
          <Table stickyHeader className={``} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>Prefix</TableCell>
                <TableCell align="left">Discount product</TableCell>
              </TableRow>
            </TableHead>

            <TableBody >
              {rowsSubProducts.map(row => {
                let titleFirstRow: string | undefined = row?.discount_product[0]?.discount_name
                let activeFirstRow: boolean | undefined = row?.discount_product[0]?.active
                let rowDiscountProduct: any = row?.discount_product
                return (
                  <ExpandableTableRow key={row.prefix}
                    expandComponent={
                      rowDiscountProduct.map((row: any, index: number) => {
                        if (index >= 1) {
                          return (
                            <TableRow key={`${titleFirstRow} ${index}`} sx={{ borderBottom: "none" }} >
                              <TableCell>{""}</TableCell>
                              <TableCell>{""}</TableCell>
                              <TableCell align="left" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                {row.discount_name}
                                {row.active ? <Chip label="Active" color="success" /> : <Chip label="Inactive" color="error" />}
                              </TableCell>

                            </TableRow>
                          )
                        }
                      })
                    }
                  >
                    <TableCell component="th" scope="row">
                      {row.prefix}
                    </TableCell>
                    <TableCell sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {titleFirstRow}
                      {activeFirstRow ? <Chip label="Active" color="success" /> : <Chip label="Inactive" color="error" />}
                    </TableCell>
                  </ExpandableTableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "1.5rem" }}>
          <Button
            data-testid="globalcomponent-confirmproductdelete-cancel-button"
            variant="text"
            children="CANCEL"
          />
          <Button
            data-testid="globalcomponent-confirmproductdelete-agree-button"
            variant="text"
            children="AGREE"
            onClick={() => {
            }}
          />
        </Box>
      </Box>
    </ModalCustom>
  )
}


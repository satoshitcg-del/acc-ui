import React from 'react'

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
import { ExpandableTableRow, TableRowNotLine } from './components/ExpandableTableRow.js';

interface subProduct {
  subproduct_name: string | undefined,
  active: boolean,
}

interface discountProduct {
  discount_name: string | undefined,
  active: boolean,
}


const createDataProducts = (sub_product: subProduct[], prefix: string[], discount_product: discountProduct[],) => {
  return { sub_product, prefix, discount_product };
}

export const ModalConfirmDeleteProductCustomer = (props: any) => {
  const { title } = props

  const rowsSubProductsCustomer = [
    createDataProducts(
      [
        { subproduct_name: 'sub product A', active: true },
        { subproduct_name: 'sub product C', active: true }
      ],
      [
        '89vr955',
        '89vr955',
        '89vr955',
      ],
      [
        { discount_name: ' Discount A ', active: true },
        { discount_name: ' Discount B ', active: false },
        { discount_name: ' Discount C ', active: false },
      ]
    ),
    createDataProducts(
      [{ subproduct_name: 'sub product B', active: false }],
      [
        '89vr955',
        '89vr955',
        '89vr955',
        '89vr955',
        '89vr955',
      ],
      [
        { discount_name: ' Discount A ', active: true },
        { discount_name: ' Discount B ', active: false },
        { discount_name: ' Discount C ', active: false },
      ]
    ),
    createDataProducts(
      [{ subproduct_name: 'sub product C', active: false }],
      [
        '89vr955',
        '89vr955',
        '89vr955',
        '89vr955',
        '89vr955',
      ],
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
        <TableContainer sx={{ mt: "1rem", height: "20rem", width: "50vw" }}>
          <Table stickyHeader className={``} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>Sub product name</TableCell>
                <TableCell>Prefix</TableCell>
                <TableCell align="left">Discount product</TableCell>
              </TableRow>
            </TableHead>

            <TableBody >
              {rowsSubProductsCustomer.map((row, index) => {
                const { subproduct_name, active } = row.sub_product
                let titleFirstRow: string | undefined = row?.discount_product[0]?.discount_name
                let rowPrefix: any = row?.prefix
                let rowDiscountProduct: any = row?.discount_product
                return (
                  <ExpandableTableRow key={`${index}`}
                    expandComponent={
                      <TableRowNotLine key={`${titleFirstRow} ${index}`}  >
                        <TableCell>{""}</TableCell>
                        <TableCell>{""}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "2rem" }}>
                            {rowPrefix.map((row_prefix: any, index: number) => {
                              return (
                                <Box key={`${row_prefix} ${index}`} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                  <Chip label={row_prefix} color="default" />
                                </Box>
                              )
                            })}
                          </Box>
                        </TableCell>
                        <TableCell align="left" sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", flexWrap: "nowrap", gap: "2rem" }}>
                          {rowDiscountProduct.map((row_discount: any, index: number) => {
                            return (
                              <Box key={`${row_discount} ${index}`} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                {row_discount?.discount_name}
                                {row_discount?.active ? <Chip label="Active" color="success" /> : <Chip label="Inactive" color="error" />}
                              </Box>
                            )
                          })}
                        </TableCell>
                      </TableRowNotLine>
                    }
                  >
                    <TableCell component="th" scope="row" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {subproduct_name} {active ? <Chip label="Active" color="success" /> : <Chip label="Inactive" color="error" />}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.prefix.length} Prefix
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {row.discount_product.length} Discount
                    </TableCell>
                  </ExpandableTableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "1.5rem" }}>
          <Button
            data-testid="globalcomponent-confirmproductcustomerdelete-cancel-button"
            variant="text"
            children="CANCEL"
          />
          <Button
            data-testid="globalcomponent-confirmproductcustomerdelete-agree-button"
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


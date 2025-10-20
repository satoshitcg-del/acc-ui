import React from 'react';
import Item from './Item';
import { Droppable } from '@hello-pangea/dnd';
import { IProduct } from '..';
import { t } from 'i18next';
import { Box, Button, TextField, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface ColumnProps {
  col: {
    id: string;
    list: IProduct[];
    company_name?: string; // เพิ่ม company_name
  };
  removeColumn: (id: string) => void;
  onCompanyNameChange: (id: string, name: string) => void; // เพิ่ม function สำหรับ update
}

const Column: React.FC<ColumnProps> = ({ col, removeColumn, onCompanyNameChange }) => {
  const [companyName, setCompanyName] = React.useState<string>(col.company_name || '');
  const [isEditCompanyName, setIsEditCompanyName] = React.useState(false);
  // เพิ่ม useEffect เพื่อ update state เมื่อ prop เปลี่ยน
  React.useEffect(() => {
    const mapPrefix = col?.list?.map(p => p.prefix_name).join(', ') || '';
    if (col.list.length > 0) {
      setIsEditCompanyName(false)
    }
    if (isEditCompanyName) {
      setCompanyName(col.company_name || '');
    } else {
      setCompanyName(col.company_name || mapPrefix);
    }
  }, [col, col.list]);

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '') {
      setIsEditCompanyName(true)
    } else {
      setIsEditCompanyName(false)
    }
    setCompanyName(newValue);
    onCompanyNameChange(col.id, newValue);
  };

  return (
    <Droppable droppableId={col.id.toString()}>
      {provided => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: "40vh",
            position: 'relative',
            margin: '0 16px',
            h2: {
              margin: '12px 0',
              padding: '8px 8px',
              fontSize: '1.2rem',
              color: (theme) =>
                theme.palette.mode !== 'dark' ? '#2c3e50' : '#ffffff',
              borderBottom: '2px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
            }
          }}
        >
          {col.id != '0' &&
            <Button
              sx={{
                position: 'absolute',
                top: '20px',
                right: '0px',
                backgroundColor: '#ff4757',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                height: '30px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                '&:hover': {
                  backgroundColor: '#ff6b81',
                  transform: 'scale(1.1)',
                },
              }}
              startIcon={<DeleteOutlineIcon />}
              onClick={() => removeColumn(col.id)}
            >
              {t("button.delete")}
            </Button>
          }
          <h2>{'📋'} {t('title.invoice-group')} {col.id + 1}</h2>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : '#ffffff',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              marginTop: '8px',
              minWidth: "300px",
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              border: '1px solid #e9ecef',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }
            }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {col?.list?.map((text, index) => (
              <Item
                key={text.customer_product_id}
                id={text.customer_product_id}
                text={text.prefix_name ? `${text.product_name}/${text.prefix_name} ${text.currency ? `(${text.currency})` : ''}` : `${text.product_name} ${text.currency ? `(${text.currency})` : ''}`}
                index={index}
              />
            ))}
            {provided.placeholder}
          </Box>
          <Tooltip title={companyName}>
            <TextField
              data-testid="billingnote-index-invoicenumber-text"
              id="search-invoice"
              label={t('placeholder.company-name')}
              size="small"
              value={companyName}
              onChange={handleCompanyNameChange}
              sx={{
                width: "100%",
                marginTop: "18px",
              }}
              inputProps={{ maxLength: 80 }}
              InputProps={{
                sx: {
                  input: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }
                }
              }}
            />
          </Tooltip>
        </Box>
      )}
    </Droppable>
  );
};

export default Column;
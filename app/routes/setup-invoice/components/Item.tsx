import { Draggable } from '@hello-pangea/dnd'
import { Box } from '@mui/material'
import React from 'react'

interface ItemProps {
  text: string
  index: number
  id: string | undefined
}

const Item: React.FC<ItemProps> = ({ text, index, id }) => {
  return (
    <Draggable draggableId={id ?? `draggable-${index}`} index={index}>
      {provided => (
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? theme.palette.background.paper : '#f8f9fa',
            borderRadius: '8px', // เพิ่มความโค้งมน
            padding: '12px 16px', // เพิ่มพื้นที่ด้านใน
            marginTop: 1,
            color: (theme) =>
              theme.palette.mode === 'dark' ? '#ffffff' : '#212529', // สีตัวอักษรที่เข้มขึ้น
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)', // เพิ่ม shadow effect
            border: '1px solid #dee2e6', // เพิ่มเส้นขอบบางๆ

            ':hover': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#212529' : '#fff',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transform: 'translateY(-1px)', // เพิ่ม hover effect แบบยกตัวขึ้นเล็กน้อย
              transition: 'all 0.2s ease-in-out'
            },

            // เพิ่ม active state เมื่อกดลาก
            ':active': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#212529' :'#fff',
              transform: 'translateY(0)',
              transition: 'all 0.1s ease-in-out'
            }
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {text}
        </Box>
      )}
    </Draggable>
  )
}

export default Item

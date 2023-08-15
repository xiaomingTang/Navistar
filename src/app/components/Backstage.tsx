'use client'

import { TagItem } from './TagItem'

import { formatWallet } from '@/web3/utils/formatWallet'
import { getAllUserData } from '@/web3/utils/getWalletStatus'
import { SvgLoading } from '@/svg'
import { cat } from '@/errors/catchAndToast'

import * as React from 'react'
import { alpha } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, Button, Stack } from '@mui/material'
import useSWR from 'swr'

interface EnhancedTableProps {
  numSelected: number
  onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void
  rowCount: number
}

const activeBgColor = 'rgb(244, 242, 255)'

function EnhancedTableHead({
  onSelectAllClick,
  numSelected,
  rowCount,
}: EnhancedTableProps) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox' sx={{ background: activeBgColor }}>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        <TableCell sx={{ background: activeBgColor }}>WALLET</TableCell>
        <TableCell sx={{ background: activeBgColor }}>TAG</TableCell>
        <TableCell sx={{ background: activeBgColor }} align='right'>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

interface EnhancedTableToolbarProps {
  numSelected: number
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant='h6'
          id='tableTitle'
          component='div'
        >
          Backstage
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

function LoadingRow({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
          }}
        >
          <SvgLoading className='animate-spin text-[18px]' />
        </Box>
      </TableCell>
    </TableRow>
  )
}

export function Backstage() {
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const { data: rows = [], isValidating } = useSWR(
    'getAllUserData',
    cat(getAllUserData)
  )

  const visibleRows = React.useMemo(
    () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, rows]
  )

  const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = visibleRows.map((n) => n.wallet)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (e: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <EnhancedTableToolbar numSelected={selected.length} />
      <TableContainer sx={{ height: '600px' }}>
        <Table stickyHeader sx={{ width: '100%' }} size={'medium'}>
          <EnhancedTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={visibleRows.length}
          />
          <TableBody>
            {isValidating && <LoadingRow colSpan={5} />}
            {visibleRows.map((row, index) => {
              const isItemSelected = isSelected(row.wallet)
              const labelId = `enhanced-table-checkbox-${index}`

              return (
                <TableRow
                  hover
                  onClick={(e) => handleClick(e, row.wallet)}
                  role='checkbox'
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.wallet}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding='checkbox'>
                    <Checkbox color='primary' checked={isItemSelected} />
                  </TableCell>
                  <TableCell component='th' id={labelId} scope='row'>
                    <Typography>{formatWallet(row.wallet)}</Typography>
                    <Typography sx={{ opacity: 0.6 }}>
                      example@email.com
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={1} direction='row'>
                      {row.tags.map((tag) => (
                        <TagItem key={tag.content} {...tag} />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell align='right'>
                    <Button variant='text' onClick={(e) => e.stopPropagation()}>
                      view more
                    </Button>
                    <IconButton onClick={(e) => e.stopPropagation()}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows,
                }}
              >
                <TableCell colSpan={3} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => {
          setSelected([])
          setPage(newPage)
        }}
        onRowsPerPageChange={(e) => {
          setSelected([])
          setRowsPerPage(parseInt(e.target.value, 10))
          setPage(0)
        }}
        sx={{ background: activeBgColor }}
      />
    </Paper>
  )
}

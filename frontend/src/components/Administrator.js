import { Container, Table, Box, Button, TableBody, TablePagination, TableContainer, TableHead,
   TableRow, Paper, TableFooter, IconButton, useTheme, Alert, TextField, MenuItem} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import Notfound from './Notfound';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#42a5f5',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



// design table
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};







function Administrator() {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState(false);
  const [datas, setDatas] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  // remember this on how to change the data dynamically in array with .map()
  const handleChangeRole = (e, id) => {
    var result = [...datas];
    result = result.map(x => {
      if (x._id === id) {
        x.role = e.target.value;
      }
      return x;
    })
    setDatas(result);
  }

  const handleChangeEdit = async (i, id) => {
    try {
      const resp = await axios.put(`/users/administrator/${id}`, {
        role: datas[i].role
      })
      setAlert(true);
    } catch (err) { 
      setAlert(false);  
      console.log(err.response);
    }
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await axios.get(`/users/administrator`);
        setDatas(resp.data);
        setAlert(false);
        setError(false);
      } catch (err) {
        setError(true);
        console.log(err.response.data)
      }
    };

    getData();
  }, [])
    
  return (
    <Container>
      {alert && <Alert onClose={() => {setAlert(false)}} severity="success">Successfully changed!</Alert>}
      {error && <Notfound/>}
      {!error && 
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">email</StyledTableCell>
              <StyledTableCell align="right">Created at</StyledTableCell>
              <StyledTableCell align="right">role</StyledTableCell>
              <StyledTableCell align="right">Save</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(
              rowsPerPage > 0
              ? datas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : datas
            ).map((data, i) => (
              <StyledTableRow key={data._id}>
                <StyledTableCell component="th" scope="row" align="right">
                  {data.email}
                </StyledTableCell>
                <StyledTableCell align="right"> <TimeAgo date={data.createdAt}/> </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                  value={data.role}
                  select
                  onChange={(e) => handleChangeRole(e, data._id)}
                  >
                    <MenuItem value={"admin"}>Admin</MenuItem>
                    <MenuItem value={"developer"}>Developer</MenuItem> 
                  </TextField>
                </StyledTableCell>
                <StyledTableCell
                align="right"
                >
                  <Button
                  onClick={() => handleChangeEdit(i, data._id)}
                  size='large'
                  variant='outlined'
                  >
                    Save
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={datas.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
              </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      }
    </Container>
  )
}

export default Administrator
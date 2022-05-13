import React, { useState, useEffect }from 'react'
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, Alert} from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import TableFooter from '@mui/material/TableFooter';
import { Box } from '@mui/system';
import { useTheme } from '@mui/material/styles';


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




function AllTickets() {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(false); // check for alert message error 
    const [err, setErr] = useState(""); // error message
    const params = useParams();
    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const resp = await axios.get(`http://localhost:3000/tickets/${params.id}`);
                setTickets(resp.data);
                console.log(tickets);
                setError(false);
            } catch (err) {
                setError(true);
                setErr("Something went wrong");
                console.log(err.response.data)
            }
        }   

        getData();
    }, [])

    const handleDelete = async (idTicket) => {
        try {

          const resp1 = await axios.get(`http://localhost:3000/tickets/get/${params.id}/${idTicket}`);
          console.log(params);
          console.log(idTicket);
          const resp = await axios.delete(`http://localhost:3000/tickets/delete/${params.id}/${idTicket}`)
          const tk = tickets.filter((ticket) => {
            return ticket._id !== idTicket;
          })
          setError(false);
          setTickets(tk);
        } catch (err) {
          setError(true);
          setErr(err.response.data.message);
          console.log(err.response.data);
        }
    }

    const checkEdit = async (id, idTicket) => {
      try {
        const resp = await axios.get(`http://localhost:3000/tickets/get/${params.id}/${idTicket}`);
        navigate(`/edit/ticket/${id}/${idTicket}`)
        console.log(resp.data);
        setError(false);
      } catch (err) {
        setError(true);
        setErr(err.response.data.message);
      }
    }

    return (
      <div>
        {error && <Alert onClose={() => {setError(false)}} severity="error">{err}</Alert>}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="right">Title</StyledTableCell>
                <StyledTableCell align="right">Description</StyledTableCell>
                <StyledTableCell align="right">Type</StyledTableCell>
                <StyledTableCell align="right">Priority</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
                <StyledTableCell align="right">Author</StyledTableCell>
                <StyledTableCell align="right">Edit </StyledTableCell>
                <StyledTableCell align="right">Delete </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(
                rowsPerPage > 0
                ? tickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : tickets
              ).map((ticket, i) => (
                <StyledTableRow key={ticket._id}>
                  <StyledTableCell component="th" scope="row" align="right">
                    {ticket.title}
                  </StyledTableCell>
                  <StyledTableCell align="right">{ticket.description}</StyledTableCell>
                  <StyledTableCell align="right">{ticket.type}</StyledTableCell>
                  <StyledTableCell align="right">{ticket.priority}</StyledTableCell>
                  <StyledTableCell align="right">{ticket.status}</StyledTableCell>
                  <StyledTableCell align="right">{ticket.author}</StyledTableCell>
                  <StyledTableCell
                   align="right"
                   >
                     <Button
                     size='small'
                     variant='outlined'
                     onClick={() =>checkEdit(params.id, ticket._id)}
                     >
                     Edit
                     </Button>
                  </StyledTableCell>
                  <StyledTableCell
                   align="right"
                   >
                     <Button
                     size='small'
                     onClick={() => handleDelete(ticket._id)}
                     color='error'
                     variant='outlined'
                     >
                     Delete
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
                count={tickets.length}
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
        <Box textAlign='center'>
            <Button     
              variant='outlined' 
              sx={{ mt: 3, mb: 2 }}
              onClick={() => navigate(`/create/ticket/${params.id}`)}
            >
              Add ticket
            </Button>
        </Box> 
      </div>
      );
}

export default AllTickets
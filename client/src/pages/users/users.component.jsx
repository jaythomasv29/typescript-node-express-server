import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useFetch } from '../../hooks/useFetch';
import moment from 'moment';

import EditIcon from '@mui/icons-material/Edit';
import './users.styles.scss'
import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import BasicModal from '../../components/modal/modal.component';

export default function Users() {
  let { data, reFetch } = useFetch("/users")
  const [users, setUsers] = useState([])

  useEffect(() => {
    setUsers(data)
  }, [data, users])

  const handleDelete = async (userId) => {
    setUsers(users.filter(user => user._id !== userId))
    try {
      await axios.delete(`/users/${userId}`)
      toast.success("Delete Successful")
    } catch (err) {
      if (err) {
        toast.error("Error deleting user...Try again")
      }
    }

  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 600 }} aria-label="simple table" >
        <TableHead>
          <TableRow>
            <TableCell align='center'>Name</TableCell>
            <TableCell align='center'>Username</TableCell>
            <TableCell align='center'>Email</TableCell>
            <TableCell align='center'>Phone</TableCell>
            <TableCell align='center'>Type</TableCell>
            <TableCell align='center'>Joined</TableCell>
            <TableCell align='center'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell >{user.name}
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
              <TableCell>{moment(user.joined).format("MMM Do YY")}</TableCell>
              <TableCell >

                <div style={{ display: "flex" }}>
                  <BasicModal Icon={<EditIcon />} user={user} setUsers={setUsers} reFetch={reFetch}/>

                  <IconButton onClick={() => handleDelete(user._id)} color="error" aria-label="delete" size="large">
                    <Delete />
                  </IconButton>
                </div>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FormControl, IconButton, Input, InputLabel, OutlinedInput } from '@mui/material';
import './modal.styles.scss'
import axios from 'axios';
import toast from 'react-hot-toast';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export default function BasicModal({ Icon, user, reFetch}) {
  const defaultFormFields = {
    ...user,
    name: '',
    username: '',
    email: '',
    phone: ''
  }
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const [formDetails, setFormDetails] = useState()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormDetails({
      ...formDetails,
      [name]: value
    })
  }

  const submitForm = async () => {
    try {
      await axios.put(`/users/${user._id}`, formDetails)
      await reFetch()
      toast.success("Update Successful")
    } catch (err) {
      if (err) {
        toast.error("Update Successful")
        console.log(err)
      }
    }
    setFormDetails(defaultFormFields)
    
    handleClose()
  }
  return (
    <div>
      <IconButton onClick={handleOpen} color="primary" aria-label="delete" size="large">
        {Icon}
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" sx={style}>
          <Typography id="modal-modal-title" className="modal__title" variant="h6" component="h2">
            Edit User
          </Typography>
          <div className="edit__form">


            <FormControl>
              <InputLabel htmlFor="name">Name</InputLabel>
              <OutlinedInput
                onChange={handleChange}
                id="name"
                placeholder={user.name}
                name="name"
                label="Name"
                value={formDetails?.name}
                required
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="name">Username</InputLabel>
              <OutlinedInput
                onChange={handleChange}
                id="name"
                placeholder={user.username}
                name="username"
                label="Name"
                value={formDetails?.username}
                required
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="name">Email</InputLabel>
              <OutlinedInput
                onChange={handleChange}
                id="name"
                placeholder={user.email}
                name="email"
                label="Name"
                value={formDetails?.email}
                required
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="name">Phone</InputLabel>
              <OutlinedInput
                onChange={handleChange}
                id="name"
                placeholder={user.phone}
                name="phone"
                label="Name"
                value={formDetails?.phone}
                required
              />
            </FormControl>

            {/* <Input placeholder={user.name} required />
          <Input placeholder={user.username} required />
          <Input placeholder={user.email} required />
          <Input placeholder={user.phone} required /> */}

            <Button onClick={submitForm}>Save</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
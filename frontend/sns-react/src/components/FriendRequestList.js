import React, { useState, useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import { Button, Typography, TextField, makeStyles } from '@material-ui/core';
import Modal from 'react-modal';
import { RiMailAddLine } from 'react-icons/ri';
import { IoIosSend, IoMdClose } from 'react-icons/io';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  text: {
    margin: theme.spacing(3),
  },
}));

const FriendRequestList = ({ ask, prof }) => {
  const classes = useStyles();
  Modal.setAppElement('#root');
  const { approveFriendRequest, sendDM } = useContext(ApiContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const customStyle = {
    content: {
      top: '50%',
      left: '42%',
      right: 'auto',
      bottom: 'auto',
    },
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setMessage(value);
  };

  const send = () => {
    const uploadDM = new FormData();
    uploadDM.append('receiver', ask.ask_from);
    uploadDM.append('message', message);
    sendDM(uploadDM);
    setModalIsOpen(false);
  };

  const handleOnApproveClick = () => {
    const requestBody = new FormData();
    requestBody.append('ask_to', ask.ask_to);
    requestBody.append('is_approved', true);
    approveFriendRequest(requestBody, ask);
  };

  return (
    <li className='list-item'>
      <h4>{prof[0].nick_name}</h4>
      {!ask.is_approved ? (
        <Button
          size='small'
          className={classes.button}
          variant='contained'
          color='primary'
          onClick={() => handleOnApproveClick()}
        >
          Approve
        </Button>
      ) : (
        <button className='mail' onClick={() => setModalIsOpen(true)}>
          <RiMailAddLine />
        </button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
        }}
        style={customStyle}
      >
        <Typography>Message</Typography>
        <TextField
          className={classes.text}
          type='text'
          onChange={handleInputChange}
        />
        <br />
        <button className='btn-modal' onClick={() => send()}>
          <IoIosSend />
        </button>
        <button className='btn-modal' onClick={() => setModalIsOpen(false)}>
          <IoMdClose />
        </button>
      </Modal>
    </li>
  );
};

export default FriendRequestList;

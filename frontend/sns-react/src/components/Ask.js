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

const Ask = ({ ask, prof }) => {
  const classes = useStyles();
  Modal.setAppElement('#root');
  const { changeApprovalRequest, sendDM } = useContext(ApiContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [text, setText] = useState('');

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
    setText(value);
  };

  const send = () => {
    const uploadDM = new FormData();
    uploadDM.append('receiver', ask.ask_from);
    uploadDM.append('message', text);
    sendDM(uploadDM);
    setModalIsOpen(false);
  };

  const changeApproval = () => {
    const uploadDataAsk = new FormData();
    uploadDataAsk.append('ask_to', ask.ask_to);
    uploadDataAsk.append('approved', true);
    changeApprovalRequest(uploadDataAsk, ask);
  };

  return (
    <li className='list-item'>
      <h4>{prof[0].nick_name}</h4>
      {!ask.approved ? (
        <Button
          size='small'
          className={classes.button}
          variant='contained'
          color='primary'
          onClick={() => changeApproval()}
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
        onRequestClose={() => setModalIsOpen(false)}
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

export default Ask;

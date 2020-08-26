import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import { makeStyles } from '@material-ui/core/styles';
import { LocationOn } from '@material-ui/icons/LocationOn';
import { BsPersonCheckFill, BsTrash, BsPersonPlus } from 'react-icons/bs';
import { MdAddAPhoto } from 'react-icons/md';
import { FaUserEdit } from 'react-icons/fa';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  profile: {
    '&.image-wrapper': {
      textAlign: 'center',
      position: 'relative',
      '& button': {
        position: 'absolute',
        top: '80%',
        left: '70%',
      },
      margin: 6,
    },
    '& .profile-image': {
      width: 150,
      height: 150,
      objectFit: 'cover',
      maxwidth: '100%',
      borderRadius: '50%',
      backgroundColor: 'white',
    },
    '& .profile-details': {
      testAlign: 'center',
      '& span, svg': {
        verticalAlign: 'middle',
        color: 'lightgrey',
        fontFamily: '"Comic Neue", cursive',
      },
    },
    '& hr': {
      border: 'none',
      margin: '0 0 7px 0',
    },
  },
}));

const ProfileManager = () => {
  return <div></div>;
};

export default ProfileManager;

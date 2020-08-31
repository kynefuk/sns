import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const Profile = ({ profileData, askData }) => {
  const classes = useStyles();
  const { newRequestFriend, profile } = useContext(ApiContext);
  console.log(askData);

  const newRequest = () => {
    const askUploadData = new FormData();
    askUploadData.append('ask_to', profileData.users);
    newRequestFriend(askUploadData);
  };

  return (
    <Card style={{ position: 'relative', display: 'flex', marginBottom: 10 }}>
      {profileData.img ? (
        <CardMedia style={{ minWidth: 100 }} image={profileData.img} />
      ) : (
        <CardMedia
          style={{ minWidth: 100 }}
          image='http://localhost:8000/media/image/null.png'
        />
      )}
      <CardContent style={{ padding: 5 }}>
        <Typography variant='h6'>{profileData.nick_name}</Typography>
        <Typography variant='h6'>{profileData.created_on}</Typography>

        {!askData[0] && profile.id ? (
          <Button
            size='small'
            className={classes.button}
            variant='contained'
            color='primary'
            onClick={() => newRequest()}
          >
            Ask as friend
          </Button>
        ) : (
          <Button
            size='small'
            className={classes.button}
            variant='contained'
            color='primary'
            disabled
          >
            Ask as friend
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Profile;

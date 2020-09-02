import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export const UserList = ({ profileData, askData }) => {
  const classes = useStyles();
  const { postNewFriendRequest, profile } = useContext(ApiContext);

  const handleOnFriendRequestClick = () => {
    const friendRequestData = new FormData();
    friendRequestData.append('ask_to', profileData.user);
    postNewFriendRequest(friendRequestData);
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
      <CardContent style={{ padding: 3 }}>
        <Typography variant='h6' style={{ marginLeft: 20 }}>
          {profileData.nick_name}
        </Typography>
        <Typography variant='h6' style={{ marginLeft: 20 }}>
          {profileData.created_on}
        </Typography>

        {profile.id && !askData[0] ? (
          <Button
            size='small'
            className={classes.button}
            variant='contained'
            color='primary'
            onClick={() => handleOnFriendRequestClick()}
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

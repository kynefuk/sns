import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import { Grid } from '@material-ui/core';
import { GoMail } from 'react-icons/go';
import { BsFillPeopleFill } from 'react-icons/bs';
import Profile from './Profile';

const Main = () => {
  const { profiles, profile, askList, askListFull, inbox } = useContext(
    ApiContext
  );
  // 自分以外のプロフィールを抽出
  const filterProfiles = profiles.filter((prof) => {
    return prof.id !== profile.id;
  });

  // 自分以外のプロフィールを表示
  const listProfiles =
    filterProfiles &&
    filterProfiles.map((filtered) => (
      <Profile
        key={filtered.id}
        profileData={filtered}
        askData={askListFull.filter((ask) => {
          return (
            (filtered.userPro === ask.askFrom) |
            (filtered.userPro === ask.askTo)
          );
        })}
      />
    ));

  return (
    <Grid container>
      <Grid item xs={4}>
        <div className='app-profiles'>{listProfiles}</div>
      </Grid>
      <Grid item xs={4}>
        <div className='app-details'></div>
        <h3 className='title-ask'>
          <BsFillPeopleFill className='badge' />
          Approval request list
        </h3>
        <div className='app-details'></div>
      </Grid>
      <Grid item xs={4}>
        <h3>
          <GoMail className='badge' />
          DM Inbox
        </h3>
        <div className='app-dms'></div>
      </Grid>
    </Grid>
  );
};

export default Main;

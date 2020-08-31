import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import { Grid } from '@material-ui/core';
import { GoMail } from 'react-icons/go';
import { BsFillPeopleFill } from 'react-icons/bs';
import Profile from './Profile';
import ProfileManager from './ProfileManager';
import Ask from './Ask';
import InboxDM from './InboxDm';

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
            (filtered.user === ask.ask_from) | (filtered.user === ask.ask_to)
          );
        })}
      />
    ));

  return (
    <Grid container>
      <Grid item xs={4}>
        <div className='app-profiles'>
          <div className='task-list'>{listProfiles}</div>
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className='app-details'>
          <ProfileManager />
        </div>
        <h3 className='title-ask'>
          <BsFillPeopleFill className='badge' />
          Approval request list
        </h3>
        <div className='app-details'>
          <ul>
            {profile.id &&
              askList.map((ask) => (
                <Ask
                  key={ask.id}
                  ask={ask}
                  prof={profiles.filter((item) => item.user === ask.ask_from)}
                />
              ))}
          </ul>
        </div>
      </Grid>
      <Grid item xs={4}>
        <h3>
          <GoMail className='badge' />
          DM Inbox
        </h3>
        <div className='task-list'>
          <div className='app-dms'>
            <ul>
              {profile.id &&
                inbox.map((dm) => (
                  <InboxDM
                    key={dm.id}
                    dm={dm}
                    prof={profiles.filter((item) => item.user === dm.sender)}
                  />
                ))}
            </ul>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default Main;

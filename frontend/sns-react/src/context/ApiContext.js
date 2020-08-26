import React, { useState, useEffect } from 'react';
import { withCookies } from 'react-cookie';
import axios from 'axios';

export const ApiContext = React.createContext();

const ApiContextProvider = (props) => {
  const token = props.cookies.get('current-token');
  const [profile, setProfile] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [editedProfile, setEditedProfile] = useState({ id: '', nickName: '' });
  const [askList, setAskList] = useState([]);
  const [askListFull, setAskListFull] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [cover, setCover] = useState([]);

  useEffect(() => {
    const getMyProfile = async () => {
      try {
        const myprofile = await axios.get('http://localhost:8000/myprofile/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const res = await axios.get(
          'http://localhost:8000/api/user/approval/',
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        myprofile.data[0] && setProfile(myprofile.data[0]);
        myprofile.data[0] &&
          setEditedProfile({
            id: myprofile.data[0].id,
            nickName: myprofile.data[0].nickName,
          });
        myprofile.data[0] &&
          setAskList(
            res.data.filter((ask) => {
              return myprofile.data[0].userPro === ask.askTo;
            })
          );
        setAskListFull(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    const getProfiles = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/user/profile', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setProfiles(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    const getInbox = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/dm/inbox/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setInbox(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    getMyProfile();
    getProfiles();
    getInbox();
  }, [token, profile.id]);

  return <></>;
};

export default withCookies(ApiContext);

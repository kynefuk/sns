import React, { useState, useEffect } from 'react';
import { withCookies } from 'react-cookie';
import axios from 'axios';

export const ApiContext = React.createContext();

const ApiContextProvider = (props) => {
  const token = props.cookies.get('current-token');
  const [profile, setProfile] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [editedProfile, setEditedProfile] = useState({ id: '', nick_name: '' });
  // 自分宛てのFriendRequest
  const [askList, setAskList] = useState([]);
  // 全てのFriendRequest?
  const [askListAll, setAskListAll] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [img, setImg] = useState([]);

  useEffect(() => {
    const getMyProfile = async () => {
      try {
        const myProfile = await axios.get(
          'http://localhost:8000/api/users/myprofile/',
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        myProfile.data[0] && setProfile(myProfile.data[0]);
        myProfile.data[0] &&
          setEditedProfile({
            id: myProfile.data[0].id,
            nick_name: myProfile.data[0].nick_name,
          });

        // FriendRequest
        const friendRequests = await axios.get(
          'http://localhost:8000/api/users/friend-requests/',
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        // 自分宛てのFriendRequestを抽出する
        myProfile.data[0] &&
          setAskList(
            friendRequests.data.filter((request) => {
              return myProfile.data[0].user === request.ask_to;
            })
          );
        setAskListAll(friendRequests.data);
      } catch (error) {
        console.error(error);
      }
    };

    const getProfiles = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8000/api/users/profiles/',
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setProfiles(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    const getInbox = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/dm/inboxes/', {
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

  const createProfile = async () => {
    const createData = new FormData();
    createData.append('nick_name', editedProfile.nick_name);
    img.name && createData.append('img', img, img.name);

    try {
      const res = await axios.post(
        'http://localhost:8000/api/users/profiles/',
        createData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );
      setProfile(res.data);
      setEditedProfile({ id: res.data.id, nick_name: res.data.nick_name });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProfile = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/users/profiles/${profile.id}/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );
      setProfiles(profiles.filter((p) => p.id !== profile.id));
      setProfile([]);
      setEditedProfile({ id: '', nick_name: '' });
      setImg([]);
      setAskList([]);
    } catch (error) {
      console.log(error);
    }
  };

  const editProfile = async () => {
    const editData = new FormData();
    editData.append('nick_name', editedProfile.nick_name);
    img.name && editData.append('img', img, img.name);

    try {
      const res = await axios.put(
        `http://localhost:8000/api/users/profiles/${profile.id}/`,
        editData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );
      setProfile(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const postNewFriendRequest = async (askData) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/users/friend-requests/',
        askData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );
      setAskListAll([...setAskListAll, res.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const sendDM = async (uploadDM) => {
    try {
      await axios.post('http://localhost:8000/api/dm/messages/', uploadDM, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const approveFriendRequest = async (requestBody, ask) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/users/friend-requests/${ask.id}/`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );
      setAskList(askList.map((item) => (item.id === ask.id ? res.data : item)));

      // ユーザA → ユーザBのフレンドリクエストを承認済みにした後に
      // ユーザB → ユーザAのフレンドリクエストを作成し、承認済みにする
      const requestData = new FormData();
      requestData.append('ask_to', ask.ask_from);
      requestData.append('approved', true);

      const newDataAskPut = new FormData();
      newDataAskPut.append('ask_to', ask.ask_from);
      newDataAskPut.append('ask_from', ask.ask_to);
      newDataAskPut.append('approved', true);

      const resp = askListAll.filter((item) => {
        return item.ask_from === profile.user && item.ask_to === ask.ask_from;
      });
      !resp[0]
        ? await axios.post(
            `http://localhost:8000/api/users/friend-requests/`,
            requestData,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
              },
            }
          )
        : await axios.put(
            `http://localhost:8000/api/users/friend-requests/${resp[0].id}/`,
            newDataAskPut,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
              },
            }
          );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ApiContext.Provider
      value={{
        profile,
        profiles,
        img,
        setImg,
        askList,
        askListAll,
        inbox,
        postNewFriendRequest,
        createProfile,
        editProfile,
        deleteProfile,
        approveFriendRequest,
        sendDM,
        editedProfile,
        setEditedProfile,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default withCookies(ApiContextProvider);

import styles from "../styles/ChatRoom.module.scss";
import React, { FormEventHandler, useEffect, useState } from "react";
import {
  MdOutlineEditNote,
  MdOutlineSaveAlt,
  MdOutlineShuffle,
  MdWest,
} from "react-icons/md";

import { useGetUser, signOut, saveUserProfile } from "../utils/database";

import SignOut from "../components/SignOut";

import Avatar from "../components/Avatar";
import { getRandomOptions, AvatarType } from "../utils/avatar";
import { User } from "firebase/auth";
import ReactTooltip from "react-tooltip";

interface ProfileWindowProps {
  hide: boolean;
  user: User;
  toggleProfile: Function;
}
const ProfileWindow: React.FC<ProfileWindowProps> = ({
  toggleProfile,
  hide,
  user,
}) => {
  const [userProfile, loading, error, snapshot] = useGetUser(user.uid);
  const [editMode, setEditMode] = useState(false);
  const [userName, setUserName] = useState(userProfile?.userName);
  const [userAvatar, setUserAvatar] = useState<AvatarType>(
    userProfile?.userAvatar
  );

  let content = <></>;
  if (loading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = <p>Error: {error.message}</p>;
  } else {
    content = <></>;
  }

  useEffect(() => {
    setUserName(userProfile?.userName);
    setUserAvatar(userProfile?.userAvatar);
  }, [userProfile]);

  const submitUpdateUser: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    saveUserProfile({
      userName: userName,
      userAvatar: userAvatar,
      isAnonymous: user.isAnonymous,
    });
    setEditMode(false);
  };

  const updateAvatar = () => {
    setUserAvatar(getRandomOptions());
  };

  return (
    <>
      <div
        className={
          hide
            ? `${styles.profile_window} ${styles.profile_window_hidden}`
            : styles.profile_window
        }
      >
        <div>
          {content}
          {userProfile && (
            <form
              className={styles.profile_content}
              onSubmit={submitUpdateUser}
            >
              <div className={styles.profile_pic}>
                <Avatar {...userAvatar} />
                <button
                  type="button"
                  className={styles.profile_pic_shuffle}
                  onClick={() => {
                    updateAvatar();
                  }}
                  data-tip
                  data-for="avatarTip"
                >
                  <MdOutlineShuffle />
                </button>
                <ReactTooltip
                  id="avatarTip"
                  place="right"
                  type="light"
                  effect="solid"
                  delayShow={300}
                  className="tool_tip"
                >
                  Shuffle your Avatar
                </ReactTooltip>
              </div>
              {editMode ? (
                <div className={`${styles.name} ${styles.profile_name}`}>
                  <input
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                  ></input>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                    }}
                  >
                    <MdOutlineSaveAlt />
                  </button>
                </div>
              ) : (
                <div className={`${styles.name} ${styles.profile_name}`}>
                  <div>{userName}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(true);
                    }}
                  >
                    <MdOutlineEditNote />
                  </button>
                </div>
              )}

              <button
                type="submit"
                className={styles.update}
                data-tip
                data-for="updateTip"
              >
                Update
              </button>
              <ReactTooltip
                id="updateTip"
                place="bottom"
                type="light"
                effect="solid"
                delayShow={300}
                className="tool_tip"
              >
                Comfirm and update your profile
              </ReactTooltip>
            </form>
          )}

          <button
            className={styles.back}
            data-tip
            data-for="backTip"
            onClick={() => {
              toggleProfile();
            }}
          >
            <MdWest />
          </button>
          <ReactTooltip
            id="backTip"
            place="bottom"
            type="light"
            effect="solid"
            delayShow={300}
            className="tool_tip"
          >
            Back to chat room
          </ReactTooltip>
          <SignOut />
        </div>
      </div>
    </>
  );
};

export default ProfileWindow;

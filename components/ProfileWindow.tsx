import styles from "../styles/ChatRoom.module.scss";
import stylesHome from "../styles/Home.module.scss";
import React, { FormEventHandler, useEffect, useState } from "react";
import {
  MdOutlineEditNote,
  MdDone,
  MdOutlineShuffle,
  MdWest,
  MdSave,
} from "react-icons/md";

import { User, useGetUser, saveUserProfile, updateUsername } from "../utils/database";
import ReactTooltip from "react-tooltip";

import { getRandomOptions, AvatarType } from "../utils/avatar";
import SignOut from "../components/SignOut";
import Avatar from "../components/Avatar";

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

  useEffect(() => {
    setUserName(userProfile?.userName);
    setUserAvatar(userProfile?.userAvatar);
  }, [userProfile]);


  let content = <></>;

  // Loading && Error
  if (loading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = <p>Error: {error.message}</p>;
  } else {
    content = <></>;
  }

  const submitUpdateUser: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    saveUserProfile({
      userName: userName,
      userAvatar: userAvatar,
      isAnonymous: user.isAnonymous,
    });
    if (!user.isAnonymous) {
      updateUsername(userName);
    }
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
                    <MdDone />
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
                <div className={stylesHome.icon}><MdSave /></div> Save
              </button>
              <ReactTooltip
                id="updateTip"
                place="bottom"
                type="light"
                effect="solid"
                delayShow={300}
                className="tool_tip"
              >
                {userProfile?.isAnonymous ? "Save Anonymous User" : "Update your profile"}
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

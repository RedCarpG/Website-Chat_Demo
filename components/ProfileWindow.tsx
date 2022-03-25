import styles from "../styles/Home.module.scss";
import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import {
  MdOutlineEditNote,
  MdOutlineSaveAlt,
  MdOutlineShuffle,
} from "react-icons/md";

import { useGetUser, signOut, saveUserProfile } from "../utils/database";

import Avatar from "../components/Avatar";
import { getRandomOptions, AvatarType } from "../utils/avatar";

const SignOut: React.FC = () => {
  return (
    <button
      className={styles.sign_out}
      onClick={() => {
        signOut();
      }}
    >
      Sign Out
    </button>
  );
};

interface ProfileWindowProps {
  uid: string;
}
const ProfileWindow: React.FC<ProfileWindowProps> = ({ uid }) => {
  const [user, loading, error, snapshot] = useGetUser(uid);
  const [editMode, setEditMode] = useState(false);
  const [userName, setUserName] = useState(user?.userName);
  const [userAvatar, setUserAvatar] = useState<AvatarType>(user?.userAvatar);

  let content = <></>;
  if (loading) {
    content = <p>Loading</p>;
  } else if (error) {
    content = <p>Error: {error.message}</p>;
  } else {
    content = <></>;
  }

  useEffect(() => {
    setUserName(user?.userName);
    setUserAvatar(user?.userAvatar);
  }, [user]);

  const submitUpdateUser: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    saveUserProfile({
      userName: userName,
      userAvatar: userAvatar,
    });
  };

  const updateAvatar = () => {
    setUserAvatar(getRandomOptions());
  };

  return (
    <>
      <div className={styles.profile_window}>
        <div>
          {content}
          {user && (
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
                >
                  <MdOutlineShuffle />
                </button>
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

              <button type="submit" className={styles.update}>
                Update
              </button>
            </form>
          )}

          <SignOut />
        </div>
      </div>
    </>
  );
};

export default ProfileWindow;

import React from "react";
import { BigHead, AvatarProps } from "@bigheads/core";
import { AvatarType } from "../utils/avatar";
import styles from "../styles/Home.module.scss";

const Avatar: React.FC<AvatarType> = (props) => {
  return (
    <div className={styles.avatar}>
      <BigHead {...props} />
    </div>
  );
};
export default Avatar;

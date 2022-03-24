import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import styles from "../styles/Home.module.scss";

const Footer: React.FC = () => {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.links}>
          <a
            href="https://github.com/RedCarpG"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/peng-gao-fr/"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin />
          </a>
        </div>
        <div>Author@RedCarpG</div>
      </div>
    </>
  );
};

export default Footer;

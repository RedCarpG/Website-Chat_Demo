import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import styles from "../styles/Home.module.scss";
import ReactTooltip from "react-tooltip";

const Footer: React.FC = () => {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.links}>
          <a
            href="https://github.com/RedCarpG"
            target="_blank"
            rel="noreferrer"
            data-tip
            data-for="myGithubTip"
            title="gitHubLink"
          >
            <FaGithub />
          </a>
          <ReactTooltip
            id="myGithubTip"
            place="top"
            type="light"
            effect="solid"
            delayShow={300}
            className="tool_tip"
          >
            Visit my Github page
          </ReactTooltip>
          <a
            href="https://www.linkedin.com/in/peng-gao-fr/"
            target="_blank"
            rel="noreferrer"
            data-tip
            data-for="myLinkedInTip"
            title="linkedInLink"
          >
            <FaLinkedin />
          </a>
          <ReactTooltip
            id="myLinkedInTip"
            place="top"
            type="light"
            effect="solid"
            delayShow={300}
            className="tool_tip"
          >
            Visit my LinkedIn page
          </ReactTooltip>
        </div>
        <div>Author@RedCarpG</div>
      </div>
    </>
  );
};

export default Footer;

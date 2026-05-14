import React from 'react';
import styles from './Loading.module.css';

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full py-40">
      <div className={styles.loader}>
        <div className={`${styles.box} ${styles.box1}`}>
          <div className={styles.sideLeft} />
          <div className={styles.sideRight} />
          <div className={styles.sideTop} />
        </div>
        <div className={`${styles.box} ${styles.box2}`}>
          <div className={styles.sideLeft} />
          <div className={styles.sideRight} />
          <div className={styles.sideTop} />
        </div>
        <div className={`${styles.box} ${styles.box3}`}>
          <div className={styles.sideLeft} />
          <div className={styles.sideRight} />
          <div className={styles.sideTop} />
        </div>
        <div className={`${styles.box} ${styles.box4}`}>
          <div className={styles.sideLeft} />
          <div className={styles.sideRight} />
          <div className={styles.sideTop} />
        </div>
      </div>
    </div>
  );
}

export default Loading;

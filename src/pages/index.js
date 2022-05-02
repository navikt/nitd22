import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const conferenceStart = 1653980400000;
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className={clsx("hero__title", styles.heroText)}>{siteConfig.tagline} 2022</h1>
        <p className={clsx("hero__subtitle", styles.heroText)}><OpeningCountdown startTimeMs={conferenceStart} /></p>
        <p className={clsx("hero__subtitle", styles.heroText)}>Har du forslag til innhold, eller kan du tenke deg å prate selv?</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="https://forms.office.com/Pages/ResponsePage.aspx?id=NGU2YsMeYkmIaZtVNSedCyKMKHMBvzVPtRUZDMBRSnxUQzVXMTE2NFlFN0ZDMDlER0NRNzNNSDZKWi4u">
              Send inn forslag til foredrag 🎉
          </Link>
        </div>
      </div>
    </header>
  );
}

function OpeningCountdown({ startTimeMs }) {
  const [currentTimeMs, setCurrentTimeMs] = useState(new Date().getTime());

  useEffect(() => {
    setInterval(() => {
      setCurrentTimeMs(new Date().getTime());
    }, 1000)
  }, []);

  const msLeft = startTimeMs - currentTimeMs;

  const SECOND_MS = 1000;
  const MINUTE_MS = SECOND_MS * 60;
  const HOUR_MS = MINUTE_MS * 60;
  const DAY_MS = HOUR_MS * 24;

  const days = ~~(msLeft / (DAY_MS));
  const hours = ~~((msLeft % DAY_MS) / HOUR_MS);
  const minutes = ~~(((msLeft % DAY_MS) % HOUR_MS) / MINUTE_MS);
  const seconds = ~~((((msLeft % DAY_MS) % HOUR_MS) % MINUTE_MS) / SECOND_MS);

  const parts = [
    { val: days, txt: days === 1 ? 'dag' : 'dager' },
    { val: hours, txt: hours === 1 ?  'time' : 'timer' },
    { val: minutes, txt: minutes === 1 ? 'minutt' : 'minutter' },
    { val: seconds, txt: seconds === 1 ? 'sekund' : 'sekunder' }
  ]

  const str = parts.filter((p) => p.val > 0).map((p) => `${p.val} ${p.txt}`).join(', ');
  
  return (
    <span>Dørene åpner om {str}!</span>
  )
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.tagline}
      description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

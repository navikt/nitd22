import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className={clsx("hero__title", styles.heroText)}>{siteConfig.tagline} 2022</h1>
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

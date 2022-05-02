import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Hva?',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Fagdag for<br />Utvikling og Data
      </>
    ),
  },
  {
    title: 'Hvor?',
    imageSrc: '/img/felixmap.png',
    description: (
      <>
        Felix Konferansesenter<br />
        <a href="https://www.google.com/maps/place/Felix+Conference+Centre/@59.9103604,10.7232209,17z/data=!3m1!5s0x46416e81a5baf3c1:0x54a57cc273c541cb!4m5!3m4!1s0x46416e81bb05208b:0x2c25291aa1955293!8m2!3d59.9101662!4d10.7250783">Bryggetorget 3, Oslo</a>
      </>
    ),
  },
  {
    title: 'Når?',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Fra morgen til kveld,<br />
        31. mai 2022
      </>
    ),
  },
];

function Feature({Svg, imageSrc, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {Svg ? <Svg className={styles.featureSvg} role="img" /> : <img className={styles.featureImage} src={imageSrc} />}
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

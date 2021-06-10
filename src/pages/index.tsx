import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head'

import { CompletedChallenges } from '../components/CompletedChallenges';
import { Countdown } from '../components/Countdown';
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from '../components/Profile';
import { ChallengeBox } from '../components/ChallengeBox';
import { CountdownProvider } from '../contexts/CountdownContext';
import { ChallengesProvider } from '../contexts/ChallengesContext';

import styles from '../styles/pages/Home.module.css'

interface HomePageProps {
  level: number;
  xp: number;
  challengesCompleted: number;
}

export default function Home(props: HomePageProps) {

  return (
    <ChallengesProvider
      level={props.level}
      xp={props.xp}
      challengesCompleted={props.challengesCompleted}
    >
      <div className={styles.container}>
        <Head>
          <title>Início | Move.it</title>
        </Head>

        <ExperienceBar />

        <CountdownProvider>
          <section>
            <div>
              <Profile />
              <CompletedChallenges />
              <Countdown />
            </div>
            <div>
              <ChallengeBox />
            </div>
          </section>
        </CountdownProvider>
      </div>
    </ChallengesProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { level, xp, challengesCompleted } = ctx.req.cookies

  return {
    props: {
      level: Number(level),
      xp: Number(xp),
      challengesCompleted: Number(challengesCompleted),
    }
  }
}

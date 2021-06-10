import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/ExperienceBar.module.css'

export function ExperienceBar() {
    const { xp, experienceToNextLevel } = useContext(ChallengesContext);

    const currentPercentage = Math.round(xp * 100) / experienceToNextLevel;
    
    return (
        <header className={styles.experienceBar}>
            <span>0 xp</span>
            <div>
                <div style={{ width: `${currentPercentage}%` }}>
                <span className={styles.currentExperience} style={{ left: `${currentPercentage}%` }}>
                    {xp} xp
                </span>
                </div>
            </div>
            <span>{experienceToNextLevel} xp</span>
        </header>
    );
}
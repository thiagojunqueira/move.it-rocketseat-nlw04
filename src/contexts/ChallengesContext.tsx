import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengeContextData {
    level: number;
    xp: number;
    experienceToNextLevel: number;
    challengesCompleted: number;
    activeChallenge: Challenge; 
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
}

interface ChallengesProviderProps {
    children: ReactNode;
    level: number;
    xp: number;
    challengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengeContextData);

export function ChallengesProvider({ children, ...rest}: ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1);
    const [xp, setXp] = useState(rest.xp ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const experienceToNextLevel = Math.pow((level+1) * 4, 2);

    useEffect(() => {
        Notification.requestPermission();
    }, [])
    
    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('challengesCompleted', String(challengesCompleted));
        Cookies.set('xp', String(xp));
    }, [level, challengesCompleted, xp])

    function levelUp() {
        setLevel(level + 1);
        setIsModalOpen(true)
    }

    function closeLevelUpModal() {
        setIsModalOpen(false);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if (Notification.permission === 'granted') {
            new Notification('Novo Desafio!', {
                body: `Valendo ${challenge.amount} xp!`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null)
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return;
        }

        const { amount } = activeChallenge;

        let finalXp = xp + amount;

        if (finalXp >= experienceToNextLevel) {
            finalXp = finalXp - experienceToNextLevel;
            levelUp();
        }

        setXp(finalXp);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContext.Provider
            value={{
                level,
                xp,
                experienceToNextLevel,
                challengesCompleted,
                activeChallenge,
                levelUp,
                startNewChallenge,
                resetChallenge,
                completeChallenge,
                closeLevelUpModal
            }}
        >
            {children}
            { isModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    )
}
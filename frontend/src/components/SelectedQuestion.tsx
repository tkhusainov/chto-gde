import React, { useCallback, useEffect, useState } from "react";
import Sound from 'react-sound';
import { Question } from "../types";
import { Answer } from "./Answer";
import { QuestionView } from "./QuestionView";

type Props = {
    index: number;
    question: Question;
    onAnswer: (index: number, success: boolean) => void;
}

const MAX_TIMER = 60;

export const SelectedQuestion: React.FC<Props> = ({index, question, onAnswer}) => {
    const [currentTimer, setCurrentTimer] = useState(MAX_TIMER);
    const [authorOpen, setAuthorOpen] = useState(true);
    const [myInterval, setMyInterval] = useState<NodeJS.Timer>();
    const [answerVisible, setAnswerVisible] = useState<boolean>(false);
    const [isRunning, setIsRunning] = useState(false);
    const [sigStatus, setSigStatus] = useState<"STOPPED" | "PLAYING" | "PAUSED">("STOPPED");
    const [gongStatus, setGongStatus] = useState<"STOPPED" | "PLAYING" | "PAUSED">("STOPPED");

    const stopTimer = useCallback(() => {
        clearInterval(myInterval);
        setIsRunning(false);
    }, [myInterval]);

    const startTimer = useCallback(() => {
        if (isRunning) return;
        stopTimer();
        const _interval = setInterval(() => {
            setCurrentTimer((prev) => --prev);
        }, 1000);
        setMyInterval(_interval);
        setIsRunning(true);
        setSigStatus("PLAYING");
    }, [isRunning, stopTimer]);

    const handleShowQuestion = useCallback(() => {
        setAuthorOpen(false);
        setGongStatus("PLAYING");
    }, [])

    useEffect(() => {
        if (currentTimer <= 0) {
            clearInterval(myInterval);
            setIsRunning(false);
            setSigStatus("PLAYING");
        }
    }, [myInterval, currentTimer]);

    useEffect(() => {
        setAuthorOpen(true);
    }, [question])

    useEffect(() => {
        return () => {
            clearInterval(myInterval);
        }
    }, [myInterval]);

    return (
        <div className="banner author-banner" style={{
            overflow: 'auto'
        }}>
            <h3>{`#${index + 1}`}</h3>
            <div className={`flex-center timer-display ${isRunning ? (currentTimer <= 10 ? 'timer-urgent' : 'timer-running') : currentTimer <= 0 ? 'timer-expired' : 'timer-stopped'}`}>
                {`${currentTimer} сек`}
            </div>

            {authorOpen && question.author &&
                <div className="banner author-banner flex-center">
                    <img className="question-image" src={question.author.photo} alt="Author_photo" />
                    <div className="question-author-name">
                        <div>{question.author.name}</div>
                        <button className="answer-btn" onClick={handleShowQuestion}>{'Продолжить'}</button>
                    </div>
                </div>}

            <Sound
                url="/chgk2_sig1.mp3"
                onFinishedPlaying={() => setSigStatus('STOPPED')}
                playStatus={sigStatus}
            />

            <Sound
                url="/chgk2_gong.mp3"
                onFinishedPlaying={() => setGongStatus('STOPPED')}
                playStatus={gongStatus}
            />

            <QuestionView question={question} onAnswer={(success) => onAnswer(index, success)} />

            {answerVisible && question.answer &&
                <Answer answer={question.answer} onClose={() => setAnswerVisible(false)} />
            }

            <button className="answer-btn" onClick={startTimer} disabled={isRunning}>{'Запустить таймер'}</button>
            <button className="answer-btn" onClick={stopTimer} disabled={!isRunning}>{'Остановить таймер'}</button>
            <button className="answer-btn" onClick={() => setAnswerVisible(true)}>{'Показать ответ'}</button>
            <div>
                <button className="answer-btn correct" onClick={() => onAnswer(index, true)}>{'Ответили правильно'}</button>
                <button className="answer-btn failed" onClick={() => onAnswer(index, false)}>{'Ошибка'}</button>
            </div>
        </div>
    )

}
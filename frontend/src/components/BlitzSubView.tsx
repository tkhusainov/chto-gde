import { useCallback, useEffect, useState } from "react";
import { SubQuestion } from "../types";
import Sound from 'react-sound';
import { Answer } from "./Answer";

type Props = {
    question: SubQuestion;
    index: number;
    maxIndex: number;
    onAnswer?: (success: boolean) => void;
}
const MAX_TIMER = 60;

export const BlitzSubView: React.FC<Props> = ({question, index, maxIndex, onAnswer}) => {
    const [answerVisible, setAnswerVisible] = useState(false);
    const [currentTimer, setCurrentTimer] = useState(MAX_TIMER);
    const [myInterval, setMyInterval] = useState<NodeJS.Timer>();
    const [isRunning, setIsRunning] = useState(false);
    const [sigStatus, setSigStatus] = useState<"STOPPED" | "PLAYING" | "PAUSED">("STOPPED");

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

    useEffect(() => {
        if (currentTimer <= 0) {
            clearInterval(myInterval);
            setIsRunning(false);
            setSigStatus("PLAYING");
        }
    }, [myInterval, currentTimer]);
    

    return (
        <div className="banner author-banner">
            <div>
                <h1>{index + 1}/{maxIndex}</h1>
                <h1>{question.header}</h1>
                <p>{question.description}</p>

                <div className={`flex-center timer-display ${isRunning ? (currentTimer <= 10 ? 'timer-urgent' : 'timer-running') : currentTimer <= 0 ? 'timer-expired' : 'timer-stopped'}`}>
                    {`${currentTimer} сек`}
                </div>
            </div>

            <Sound
                url="/chgk2_sig1.mp3"
                onFinishedPlaying={() => setSigStatus('STOPPED')}
                playStatus={sigStatus}
            />

            <div>
                <button className="answer-btn" onClick={startTimer} disabled={isRunning}>{'Запустить таймер'}</button>
                <button className="answer-btn" onClick={stopTimer} disabled={!isRunning}>{'Остановить таймер'}</button>
                <button className="answer-btn" onClick={() => setAnswerVisible(true)}>{'Показать ответ'}</button>
            </div>

            <div>
                <button className="answer-btn correct" onClick={() => onAnswer?.(true)}>{'Ответили правильно'}</button>
                <button className="answer-btn failed" onClick={() => onAnswer?.(false)}>{'Ошибка'}</button>
            </div>

            {answerVisible && question.answer &&
                <Answer answer={question.answer} onClose={() => setAnswerVisible(false)} />
            }
        </div>
    )
}
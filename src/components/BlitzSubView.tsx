import { useCallback, useEffect, useState } from "react";
import { Question } from "../types/Question";
import Sound from 'react-sound';
import { Answer } from "./Answer";

type Props = {
    question: Question;
    index: number;
    maxIndex: number;
    onAnswer?: (success: boolean) => void;
}
const MAX_TIMER = 60;

export const BlitzSubView: React.FC<Props> = ({question, index, maxIndex, onAnswer}) => {
    const [answerVisible, setAnswerVisible] = useState(false);
    const [currentTimer, setCurrentTimer] = useState(MAX_TIMER);
    const [myInterval, setMyInterval] = useState<NodeJS.Timer>();
    const [sigStatus, setSigStatus] = useState<"STOPPED" | "PLAYING" | "PAUSED">("STOPPED");

    const stopTimer = useCallback(() => {
        clearInterval(myInterval);
    }, [myInterval]);

    const startTimer = useCallback(() => {
        stopTimer();

        const _interval = setInterval(() => {
            setCurrentTimer((prev) => --prev);
        }, 1000);
        setMyInterval(_interval);
        setSigStatus("PLAYING");
    }, [stopTimer]);

    useEffect(() => {
        if (currentTimer <= 0) {
            clearInterval(myInterval);
            setSigStatus("PLAYING");
        }
    }, [myInterval, currentTimer]);
    

    return (
        <div className="banner author-banner">
            <div>
                <h1>{index + 1}/{maxIndex}</h1>
                <h1>{question.header}</h1>
                <p>{question.description}</p>

                <div className="flex-center">
                    {`${currentTimer} секунд`}
                </div>
            </div>

            <Sound
                url="/chgk2_sig1.mp3"
                onFinishedPlaying={() => setSigStatus('STOPPED')}
                playStatus={sigStatus}
            />

            <div>
                <button className="answer-btn" onClick={startTimer}>{'Запустить таймер'}</button>
                <button className="answer-btn" onClick={stopTimer}>{'Остановить таймер'}</button>
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
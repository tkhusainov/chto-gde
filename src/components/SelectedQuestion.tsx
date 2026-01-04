import React, { useCallback, useEffect, useState } from "react";
import Sound from 'react-sound';
import { Question, QuestionType } from "../types/Question";
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
    const [sigStatus, setSigStatus] = useState<"STOPPED" | "PLAYING" | "PAUSED">("STOPPED");
    const [gongStatus, setGongStatus] = useState<"STOPPED" | "PLAYING" | "PAUSED">("STOPPED");

    const startTimer = useCallback(() => {
        const _interval = setInterval(() => {
            setCurrentTimer((prev) => --prev);
        }, 1000);
        setMyInterval(_interval);
        setSigStatus("PLAYING");
    }, []);

    const stopTimer = useCallback(() => {
        clearInterval(myInterval);
    }, [myInterval]);

    const handleShowQuestion = useCallback(() => {
        setAuthorOpen(false);
        setGongStatus("PLAYING");
    }, [])

    useEffect(() => {
        if (currentTimer <= 0) {
            clearInterval(myInterval);
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
            <div className="flex-center">
                {`${currentTimer} секунд`}
            </div>

            {authorOpen && question.author &&
                <div className="banner author-banner flex-center">
                    <img className="question-image" src={question.author.photo} alt="Author_photo" />
                    <div>
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

            <button className="answer-btn" onClick={startTimer}>{'Запустить таймер'}</button>
            <button className="answer-btn" onClick={stopTimer}>{'Остановить таймер'}</button>
            <button className="answer-btn" onClick={() => setAnswerVisible(true)}>{'Показать ответ'}</button>
            <div>
                <button className="answer-btn correct" onClick={() => onAnswer(index, true)}>{'Ответили правильно'}</button>
                <button className="answer-btn failed" onClick={() => onAnswer(index, false)}>{'Ошибка'}</button>
            </div>
        </div>
    )

}
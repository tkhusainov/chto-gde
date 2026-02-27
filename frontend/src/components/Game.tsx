import { useCallback, useEffect, useMemo, useState } from "react";
import { Question } from "../types";
import { Wheel } from "./Wheel";
import { SelectedQuestion } from "./SelectedQuestion";
import { without, xor } from "lodash";

const SPIN_DURATION = 25;// 25000;

type Props = {
    questions: Question[];
    onWin: () => void;
    onLose: () => void;
    onPause: () => void;
};

export const Game: React.FC<Props> = ({questions, onWin, onLose, onPause}) => {

    const pointsToResult = useMemo(() => {
        return Math.ceil(questions.length / 2)
    }, [questions]);

    const [answeredIndexes, setAnsweredIndexes] = useState<number[]>([]);
    const [failedIndexes, setFailedIndexes] = useState<number[]>([]);

    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(-1);
    const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
    const [activeQuestion, setActiveQuestion] = useState<Question>();

    const openQuestion = useCallback(() => {
        setActiveQuestion(questions[selectedQuestionIndex]);
    }, [questions, selectedQuestionIndex]);

    const handleKeyUp = useCallback(({code}: {code: string}) => {
        if (code === 'ArrowUp') {
            setSelectedQuestionIndex((prev) => prev + 1);
        } else if (code === 'ArrowDown') {
            setSelectedQuestionIndex((prev) => prev - 1);
        }
    }, []);

    const handleAnswer = useCallback((index: number, success: boolean) => {
        if (success) {
            setAnsweredIndexes((prev) => xor(prev, [index]));
            setFailedIndexes((prev) => without(prev, index));
        } else {
            setFailedIndexes((prev) => xor(prev, [index]));
            setAnsweredIndexes((prev) => without(prev, index));
        }
        setActiveQuestion(undefined);
        setSelectedQuestionIndex(-1);
    }, []);

    useEffect(() => {
        if (selectedQuestionIndex >= 0) {
            setCompletedQuestions((prev) => [...prev, selectedQuestionIndex])
        }
    }, [selectedQuestionIndex]);

    useEffect(() => {
        if (answeredIndexes.length >= pointsToResult) {
            onWin();
        } 
        if (failedIndexes.length >= pointsToResult) {
            onLose();
        }
    }, [answeredIndexes, failedIndexes, pointsToResult, onLose, onWin]);

    useEffect(() => {
        window.addEventListener('keyup', handleKeyUp);
        return () => window.removeEventListener('keyup', handleKeyUp);
    }, [handleKeyUp]);

    
    return (
        <div>
            <div className="scoreboard">
                <div>{'ЗНАТОКИ'}</div>
                <div>{'ТЕЛЕЗРИТЕЛИ'}</div>
                <div className="score-board-item expert">{answeredIndexes.length}</div>
                <div className="score-board-item viewer">{failedIndexes.length}</div>
            </div>

            <div className="wheel-wrapper">
                {selectedQuestionIndex >= 0 &&
                <div className="flex-center">
                    {`Вопрос #${selectedQuestionIndex}`}
                    <button className="answer-btn" onClick={openQuestion}>Открыть конверт</button>
                </div>}
                <Wheel 
                    answeredQuestions={completedQuestions} 
                    questionLength={questions.length} 
                    spinDuration={SPIN_DURATION} 
                    onSpinEnded={setSelectedQuestionIndex} 
                />
            </div>

            {activeQuestion &&
                <SelectedQuestion question={activeQuestion} index={selectedQuestionIndex} onAnswer={handleAnswer} />
            }

            <div className="buttons-in-game">
                {/* <button className="answer-btn" onClick={runGenerator}>{'Вращайте барабан'}</button> */}
                <button className="answer-btn" onClick={onPause}>{'Пауза'}</button>
                {/* <button className="answer-btn" onClick={() => setSelectedIndex(-1)}>{'Отменить'}</button> */}
            </div>
        </div>
    )
} 
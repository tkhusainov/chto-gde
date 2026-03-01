import { useCallback, useMemo, useState } from "react";
import React from "react";
import { Question, SubQuestion } from "../types";
import { BlitzSubView } from "./BlitzSubView";

type Props = {
    question: Question;
    onAnswer?: (success: boolean) => void;
}

export const BlitzView: React.FC<Props> = ({question, onAnswer}) => {
    const [selectedSubQuestionIndex, setSelectedSubQuestionIndex] = useState(-1);

    const selectedSubQuestion = useMemo<SubQuestion | undefined>(() => {
        return question.subQuestions?.[selectedSubQuestionIndex];
    }, [selectedSubQuestionIndex, question.subQuestions]);

    const handleAnswer = useCallback((success: boolean) => {
        if (success) {
            if (selectedSubQuestionIndex + 1 === question.subQuestions?.length) {
                onAnswer?.(true);
            } else {
                setSelectedSubQuestionIndex((prev) => prev + 1);
            }
        } else {
            onAnswer?.(false);
        }
    }, [onAnswer, selectedSubQuestionIndex, question.subQuestions]);

    console.log({question});

    return (
        <div>
            <h1>{question.header}</h1>
            <p>{question.description}</p>

            <button className="answer-btn" onClick={() => setSelectedSubQuestionIndex(0)}>{'Начать'}</button>

            {selectedSubQuestion &&
                <BlitzSubView 
                    question={selectedSubQuestion} 
                    index={selectedSubQuestionIndex} 
                    maxIndex={question.subQuestions?.length || 0} 
                    onAnswer={handleAnswer}
                />
            }
        </div>
    )
}
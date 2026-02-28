import React from "react";
import { AnswerType } from "../enums";
import { QuestionAnswer } from "../types";

type Props = {
    answer: QuestionAnswer;
    onClose: () => void;
}

export const Answer: React.FC<Props> = ({answer, onClose}) => {
    return (
        <div className="banner banner-answer flex-center">
            <audio autoPlay={true}>
                <source src="/chgk2_gong.mp3" type="audio/mp3"></source>
            </audio>
            <div>
                <div className="text-padding text-bg text-break" >{answer.description}</div>
                {answer.type === AnswerType.Video && answer.image &&
                    <video controls className="question-image" >
                        <source src={answer.image} type="video/mp4" />
                    </video>
                }
                {answer.type === AnswerType.Image && answer.image &&
                    <img src={answer.image} className="question-image" alt="question_image" />
                }
                <button className="answer-btn" onClick={onClose}>{'Закрыть'}</button>
            </div>
        </div>
    );
}
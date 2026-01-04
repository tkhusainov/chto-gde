import React from "react";
import { QuestionAnswer, QuestionType } from "../types/Question";

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
                {answer.type === QuestionType.Video && answer.srcPath &&
                    <video controls className="question-image" >
                        <source src={answer.srcPath} type="video/mp4" />
                    </video>
                }
                {answer.type === QuestionType.Image && answer.srcPath &&
                    <img src={answer.srcPath} className="question-image" alt="question_image" />
                }
                <button className="answer-btn" onClick={onClose}>{'Закрыть'}</button>
            </div>
        </div>
    );
}
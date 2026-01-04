import { Question, QuestionType } from "../types/Question";
import { BlitzView } from "./BlitzView";

type Props = {
    question: Question;
    onAnswer?: (success: boolean) => void;
}

export const QuestionView: React.FC<Props> = ({question, onAnswer}) => {

    if (question.type === QuestionType.Image) {
        return (
            <div className="flex-center flex-column my-2">
                <div className="text-padding text-break my-2">{question.description}</div>
                <img src={question.srcPath} style={{maxWidth: '50%'}} alt="question_image" />
            </div>
        )
    }

    if (question.type === QuestionType.Video) {
        return (
            <div className="flex-center flex-column my-2">
                <div className="text-padding text-break my-2">{question.description}</div>
                <video controls>
                    <source src={question.srcPath} type="video/mp4" />
                </video>
            </div>
        )
    }

    if (question.type === QuestionType.BlackBox) {
        return (
            <div>
                <p className="text-padding text-break">{question.description}</p>
                <audio controls>
                    <source src="/yashik.mp3" type="audio/mp3"></source>
                </audio>
            </div>
        )
    }

    if (question.type === QuestionType.Blitz) {
        return (
            <BlitzView question={question} onAnswer={onAnswer} />
        )
    }

    if (question.type === QuestionType.Text) {
        return (
            <div className="flex-center flex-column my-2">
                <h1>{question.header}</h1>
                <div className="text-padding text-break my-2">{question.description}</div>
            </div>
        )
    }

    return (
        <div>
            <h1>{'Неопознанный тип вопроса'}</h1>
        </div>
    )
}
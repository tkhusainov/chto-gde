import { useCallback, useEffect, useMemo, useState } from "react";
import { Roulette, RouletteItem, useRoulette } from "react-hook-roulette";


type Props = {
    questionLength: number;
    spinDuration: number;
    answeredQuestions?: number[];
    onSpinEnded: (index: number) => void;
};

const UNUSED_COLOR = '#323131';
const USED_COLOR = '#5A5A5A';

export const Wheel: React.FC<Props> = ({questionLength, spinDuration, answeredQuestions = [], onSpinEnded}) => {
    const items: RouletteItem[] = useMemo(() => {
        const result = [];
        for (let i = 0; i < questionLength; i ++) {
            const bg = answeredQuestions.includes(i) ? USED_COLOR : UNUSED_COLOR;
            const item: RouletteItem = {
                name: i.toString(),
                bg,
                color: '#fad9b8'
            };
            result.push(item);
        }
        return result;
    }, [questionLength, answeredQuestions]);

    const [spinActive, setSpinActive] = useState(false);

    const onSpinEnd = useCallback((value: string) => {
        let actualIndex = +value;

        while (answeredQuestions.includes(actualIndex)) {
            actualIndex = (actualIndex + 1) % questionLength;
        }

        onSpinEnded(actualIndex);
    }, [answeredQuestions, questionLength, onSpinEnded]);

    const { roulette, onStart, onStop } = useRoulette({ items, onSpinEnd, options: {
        maxSpeed: 10,
        rotationDirection: 'counterclockwise',
        style: {
            canvas: {
                bg: "#282c34",
            },
            label: {
                font: "32px Arial",
            },
            arrow: {
                bg: "white",
                size: 20,
            },
            pie: {
                border: true,
                borderColor: '#fad9b8',
                borderWidth: 2,
            }
        }
    } });


    
    const onClick = useCallback(() => {
        setSpinActive((prev) => !prev);
    }, []);

    useEffect(() => {
        if (answeredQuestions.length === questionLength) {
            return;
        }

        if (spinActive) {
            const spinRandom = Math.round(Math.random() * 10) - 5; // add randomization: -5 to +5 seconds
            onStart();

            setTimeout(() => {
                setSpinActive(false);
            }, spinDuration + spinRandom * 1000);
        }
    }, [spinDuration, spinActive, onStart, answeredQuestions, questionLength]);

    useEffect(() => {
        if (!spinActive) {
            onStop();
        }
    }, [spinActive, onStop]);

    return (
        <div>
            <Roulette roulette={roulette} />
            <div>
                {spinActive &&
                    <audio autoPlay={true}>
                        <source src="/volchok.mp3" type="audio/mp3"></source>
                    </audio>
                }
                <button className="answer-btn" onClick={onClick}>Вращать</button>
            </div>
        </div>
    )
}
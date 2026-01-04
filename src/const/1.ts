import { Question, QuestionType } from "../types/Question";

const path = 'questions/1'

export const questions: Question[] = [
{
    id: '1',
    type: QuestionType.Text,
    header: 'Россия и шахматы',
    description: 'Что с Россией - черный шахматный конь, а без России - черная пешка?',
    answer: {
        type: QuestionType.Text,
        description: 'Черный конь в начале шахматной партии стоит на клетках B8 или G8. \nЧерная пешка в начале партии может стоять на одной из клеток седьмого ряда.\nЧерная пешка - это G7, черный конь - это G8'
    },
    author: {
        photo: `${path}/authors/kurtukova.png`,
        name: 'Татьяна Куртукова - исполнительница песни "Матушка-земля"'
    }
},
{
    id: '2',
    type: QuestionType.BlackBox,
    header: 'Татар кара әрҗәсе',
    description: 'В черном ящике находится отгадка на татарскую загадку: Слоистая, слоистая капуста, полная внутри муравьев',
    answer: {
        type: QuestionType.Text,
        description: 'Книга'
    },
    author: {
        name: 'Алевтина Хайруллина, бухгалтер, Казань',
        photo: `${path}/authors/uchilka.png`,
    }
},
{
    id: '3',
    type: QuestionType.Text,
    header: 'Олимпиада первоклассников',
    description: 'На олимпиаде в первом классе была интересная задачка. Продолжите последовательность чисел:\n\n 4, 3, 3, 6, 4, 5, ?, ?, ?',
    author: {
        name: 'Славка Сычев, школьник, Усть-Зажопинск',
        photo: `${path}/authors/sych.png`,
    },
    answer: {
        type: QuestionType.Text,
        description: 'Правильный ответ 4, 6, 6. \nНужно посчитать количество букв в цифре.\nОдин (4), два (3), три (3), четыре (6)...'
    }
},
{
    id: '4',
    type: QuestionType.BlackBox,
    header: '5 + 5 = 4',
    description: 'Содержимое этих черных ящиков может наглядно продемонстрировать странное равенство: \n\n5 + 5 = 4. \nТо есть содержимое двух одинаковых ящиков равно содержимому большого. Что в черных ящиках, А?',
    answer: {
        type: QuestionType.Text,
        description: 'Листы А4 и А5. То есть два листа А5 равны листу А4'
    },
    author: {
        name: 'Тоби Флэндерсон - кадровик, Скрентон',
        photo: `${path}/authors/hr.png`
    }
},
{
    id: '5',
    type: QuestionType.Text,
    header: 'Медведь и ворона',
    description: 'Загадка. \nМедведь позвал ворону в дом. Угощал грибами и шоколадом, поил вином. Всю ночь читал стихи, но на танец пригласить ее не мог. \nПочему?',
    answer: {
        type: QuestionType.Text,
        description: 'Потому что танец белый, дамы приглашают кавалеров. Медведь белый, ворона белая и тд.'
    },
    author: {
        name: 'Дмитрий Медвед - политический деятель, Москва',
        photo: `${path}/authors/medved.png`
    }
},
{
    id: '6',
    type: QuestionType.Text,
    header: 'Последовательность букв',
    description: 'Закончите последовательность букв:\n\n Т О П П Т В\n Ц Ц\nО Л В И Л Х П С\n? ? ? ? ? ? ? ?',
    answer: {
        type: QuestionType.Image,
        srcPath: `${path}/tsar.png`,
        description: 'О П Н М В Т Н Р. \nЭто слова песни "Царица"'
    },
    author: {
        name: 'Анжела Королевская - модель, Москва',
        photo: `${path}/authors/trans.png`
    }
}, {
    id: '7',
    type: QuestionType.Image,
    srcPath: `${path}/krug.png`,
    header: 'Giga-chat AI',
    description: 'Как называется древний символ, представляющий собой круг с точкой посередине, который часто ассоциируется с солнцем и вечностью?',
    answer: {
        type: QuestionType.Text,
        description: 'Круг с точкой. Что с лицом, знатоки?'
    },
    author: {
        name: 'Гигачад - искусственный интеллект, Санкт-Петербург',
        photo: `${path}/authors/chad.png`
    }
},
{
    id: '8',
    type: QuestionType.Text,
    header: 'Загадка про мост',
    description: 'Загадка\n Вот кочерга лежит возле моста, на берегу другом сорвало с дома крышу. \nДля вас загадка, думаю, проста, что под мостом? Через минуту я услышу?\n\nЧто под мостом?',
    answer: {
        type: QuestionType.Image,
        srcPath: `${path}/koren.png`,
        description: 'Корень слова. Кочерга - приставка, крыша - суффикс'
    },
    author: {
        name: 'Олег Карлсон - архитектор, Чебоксары',
        photo: `${path}/authors/karl.png`
    }
},
{
    id: '9',
    type: QuestionType.Text,
    header: 'Бытие мое',
    description: 'Бытие. Глава 2 стих 21.\n\n И навел господь на человека крепкий сон \nи когда он уснул \nвзял одно из ребер его \nи закрыл то место плотью.\n\nЭти строки из библии в 1847 году Джеймс Янг Симпсон использовал как аргумент в защиту. \nВ защиту чего выступал этот шотландец?',
    answer: {
        type: QuestionType.Text,
        description: 'Джеймс Янг Симпсон использовал это в своей статье против религиозных возражений против использования анестезии в хирургии'
    },
    author: {
        name: 'Дмитрий Псинов - Протоерей, Пермь',
        photo: `${path}/authors/psina.png`,
    }
},
{
    id: '10',
    type: QuestionType.Text,
    header: 'Большой прямоугольник',
    description: 'Власть, религия, торговля, история находятся по четырем сторонам этого прмоугольника площадью 23 000 квадратных метров.\nНазовите его',
    answer: {
        type: QuestionType.Image,
        srcPath: `${path}/ploschad.png`,
        description: 'Красная площадь. \nКремль, Собор Василия Блаженного, ГУМ, Историчекий музей'
    },
    author: {
        name: 'Геннадий Ромб - любитель прямоугольников, Саратов',
        photo: `${path}/authors/kvadrat.png`,
    }
}, 
{
    id: '11',
    type: QuestionType.Text,
    header: 'Памятники стоить мы не бросим...',
    description: 'Какому событию посвящен памятник высотой 141,8 метра?',
    answer: {
        type: QuestionType.Image,
        srcPath: `${path}/monument-pobedy.jpg`,
        description: 'Великая отечественная война. \nДлительность 1418 дней. Монумент Победы по Поклонной горе'
    },
    author: {
        name: 'Оскана Собакина - ветеринар, Благовещенск',
        photo: `${path}/authors/veter.png`,
    }
}, 
{
    id: '12',
    type: QuestionType.Text,
    header: 'Старинная притча',
    description: 'Однажды халифа Умара навестил его друг Абдурахман. Навестил его в тот момент, когда верховный правитель занимался государственными делами. Увидев своего друга, халиф Умар погасил одну свечу и зажег другую. Поведение халифа удивило Абдурахмана. Он воскликнул: "О, глава мусульман, почему ты погасил одну свечу и зажег другую?"\n Каким был ответ халифа Умара?',
    answer: {
        type: QuestionType.Text,
        description: 'Халиф Умар ответил другу: "Когда ты пришел, я занимался государственными делами и жег казенную свечу. А с тобой буду обсуждать личные вопросы. И не стоит государству платить за нашу беседу. Поэтому я зажег личную свечу"'
    },
    author: {
        name: 'Юваев Салалат - поэт-сказитель, Уфа',
        photo: `${path}/authors/salavat.png`,
    }
},
{
    id: '13',
    type: QuestionType.Video,
    header: 'Январские праздники',
    srcPath: `${path}/nail_q.MOV`,
    author: {
        name: "Наиль Волк, бизнесмен, Москва-сити",
        photo: `${path}/authors/nail_author.jpg`
    },
    answer: {
        type: QuestionType.Video,
        srcPath: `${path}/nail_a.MOV`,
    }
}
// Add video question
]

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TheoryTopic {
  id: string;
  title: string;
  content: string;
  example: string;
  flowchart?: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  type: 'choice' | 'boolean';
}

export interface Task {
  id: string;
  level: 'easy' | 'medium' | 'hard';
  topic: 'algorithm' | 'python';
  goal: string;
  problem: string;
  requirements: string[];
  criteria: string;
}

export interface Stats {
  testScores: number[];
  gamePoints: number;
  completedTasks: number;
}

export const THEORY_TOPICS: TheoryTopic[] = [
  {
    id: 'algo-intro',
    title: 'Алгоритм дегеніміз не?',
    content: 'Алгоритм — қойылған мақсатқа жету үшін орындалатын іс-әрекеттердің нақты тізбегі. Күнделікті өмірде біз көптеген алгоритмдерді орындаймыз: шай демдеу, мектепке бару немесе есеп шығару.',
    example: 'Шай демдеу алгоритмі:\n1. Шәйнекке су құю.\n2. Суды қайнату.\n3. Шайды салу.\n4. Қайнаған суды құю.',
    flowchart: '[Басы] -> [Су құю] -> [Қайнату] -> [Шай салу] -> [Су құю] -> [Соңы]'
  },
  {
    id: 'linear-algo',
    title: 'Сызықтық алгоритм',
    content: 'Сызықтық алгоритм — барлық әрекеттердің бірінен соң бірі қатаң түрде орындалатын алгоритм түрі. Ешқандай таңдау немесе қайталану болмайды.',
    example: 'Екі санның қосындысын табу:\n1. А санын енгіз.\n2. В санын енгіз.\n3. С = А + В есепте.\n4. С-ны экранға шығар.',
    flowchart: '[Басы] -> [А, В енгізу] -> [С = А + В] -> [С шығару] -> [Соңы]'
  },
  {
    id: 'branching-algo',
    title: 'Тармақталу (if-else)',
    content: 'Тармақталған алгоритмде белгілі бір шартқа байланысты әрекеттердің екі немесе одан да көп жолы болады. Python-да бұл `if` және `else` операторлары арқылы жүзеге асады.',
    example: 'Егер жаңбыр жауып тұрса (Шарт):\n  - Қолшатыр ал!\nӘйтпесе:\n  - Қолшатыр қажет емес.',
    flowchart: '[Басы] -> <Жаңбыр ма?> --Иә--> [Қолшатыр ал] / --Жоқ--> [Қажет емес] -> [Соңы]'
  },
  {
    id: 'cyclic-algo',
    title: 'Циклдер (for, while)',
    content: 'Цикл — белгілі бір әрекеттің бірнеше рет қайталануы. Мысалы, таңғы жаттығу жасағанда 10 рет секіру — бұл цикл. Python-да `for` белгілі бір сан рет қайталау үшін, ал `while` шарт орындалып тұрғанша қайталау үшін қолданылады.',
    example: '1-ден 5-ке дейінгі сандарды шығару:\nfor i in range(1, 6):\n    print(i)',
    flowchart: '[Басы] -> <i < 6?> --Иә--> [i шығару, i+1] -> (қайта қайту) / --Жоқ--> [Соңы]'
  },
  {
    id: 'python-vars',
    title: 'Python айнымалылары',
    content: 'Айнымалы — бұл деректерді сақтауға арналған "қорапша". Python-да сандар (int, float), мәтін (str) және логикалық (bool) типтер бар.',
    example: 'name = "Nurbol" # str\nage = 12 # int\nheight = 1.55 # float\nis_student = True # bool',
  },
  {
    id: 'python-io',
    title: 'Енгізу және шығару',
    content: '`input()` — мәлімет енгізу, `print()` — экранға шығару. `input()` әрқашан str қайтарады, сондықтан сандар үшін `int()` арқылы түрлендіру керек.',
    example: 'age = int(input("Жасың нешеде? "))\nprint("Сен келесі жылы", age + 1, "жасқа толасың!")',
  },
  {
    id: 'python-logic',
    title: 'Логикалық операторлар',
    content: 'Күрделі шарттарды құру үшін `and` (және), `or` (немесе), `not` (емес) операторларын қолданамыз.',
    example: 'if temperature > 20 and is_sunny == True:\n    print("Далаға шығуға болады")',
  }
];

export const TEST_QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'Алгоритмнің дұрыс анықтамасын тап:',
    options: ['Компьютер құрылымы', 'Іс-әрекеттердің нақты тізбегі', 'Ойындар жинағы', 'Экрандағы сурет'],
    correctAnswer: 1,
    explanation: 'Алгоритм - мақсатқа жетуге бағытталған іс-әрекеттердің реттелген тізбегі.',
    type: 'choice'
  },
  {
    id: 2,
    text: 'Төмендегілердің қайсысы сызықтық алгоритм?',
    options: ['Сабақ кестесі', 'Санның үлкенін табу', 'Шай демдеу', 'Бағдаршам'],
    correctAnswer: 2,
    explanation: 'Шай демдеуде әрекеттер бірінен соң бірі ретімен орындалады.',
    type: 'choice'
  },
  {
    id: 3,
    text: 'Python-да экранға шығару командасы:',
    options: ['input()', 'output()', 'print()', 'show()'],
    correctAnswer: 2,
    explanation: 'print() экранға мәлімет шығару үшін қолданылады.',
    type: 'choice'
  },
  {
    id: 4,
    text: 'x = "10" айнымалысының типі қандай?',
    options: ['int', 'float', 'str', 'bool'],
    correctAnswer: 2,
    explanation: 'Тырнақшадағы мәндер str (жол) болып табылады.',
    type: 'choice'
  },
  {
    id: 5,
    text: 'Шартты оператор қайсы?',
    options: ['for', 'while', 'if-else', 'print'],
    correctAnswer: 2,
    explanation: 'if-else шартты тексеру үшін қолданылады.',
    type: 'choice'
  },
  {
    id: 6,
    text: 'Белгілі бір шарт бойынша таңдау жасалатын алгоритм:',
    options: ['Сызықтық', 'Тармақталған', 'Циклдік', 'Қарапайым'],
    correctAnswer: 1,
    explanation: 'Тармақталған алгоритмде шартқа байланысты жол таңдалады.',
    type: 'choice'
  },
  {
    id: 7,
    text: 'Әрекеттердің қайталануы не деп аталады?',
    options: ['Сызық', 'Тармақ', 'Цикл', 'Нәтиже'],
    correctAnswer: 2,
    explanation: 'Қайталанатын әрекеттер циклі деп аталады.',
    type: 'choice'
  },
  {
    id: 8,
    text: 'Python-да мәлімет енгізу командасы:',
    options: ['read()', 'get()', 'input()', 'set()'],
    correctAnswer: 2,
    explanation: 'input() арқылы пайдаланушыдан мәлімет аламыз.',
    type: 'choice'
  },
  {
    id: 9,
    text: 'range(5) неше сан жасайды?',
    options: ['4', '5', '6', '10'],
    correctAnswer: 1,
    explanation: 'range(5) 0,1,2,3,4 сандарын (барлығы 5) жасайды.',
    type: 'choice'
  },
  {
    id: 10,
    text: 'x = 10.5 типі қандай?',
    options: ['int', 'float', 'str', 'bool'],
    correctAnswer: 1,
    explanation: 'Бөлшек сандар float типіне жатады.',
    type: 'choice'
  },
  {
    id: 11,
    text: 'for циклі көбінесе қашан қолданылады?',
    options: ['Қайталану саны белгілі болғанда', 'Шексіз қайталау үшін', 'Шартты тексеру үшін', 'Енгізу үшін'],
    correctAnswer: 0,
    explanation: 'for циклі белгілі бір жиынтық немесе диапазон бойынша жүру үшін ыңғайлы.',
    type: 'choice'
  },
  {
    id: 12,
    text: 'Ромб блок-схемада нені білдіреді?',
    options: ['Басы/Аяғы', 'Әрекет', 'Шарт', 'Енгізу/Шығару'],
    correctAnswer: 2,
    explanation: 'Ромб фигурасы алгоритмдегі шартты білдіреді.',
    type: 'choice'
  },
  {
    id: 13,
    text: 'Python-да "and" операторының мағынасы:',
    options: ['Немесе', 'Және', 'Емес', 'Тең'],
    correctAnswer: 1,
    explanation: '"and" екі шарттың да орындалуын талап етеді.',
    type: 'choice'
  },
  {
    id: 14,
    text: 'Алгоритм қадамдарының нақтылығы қалай аталады?',
    options: ['Дискреттілік', 'Анықтылық', 'Нәтижелілік', 'Жалпылық'],
    correctAnswer: 1,
    explanation: 'Анықтылық (детерминирлілік) - әр қадамның нақты түсінікті болуы.',
    type: 'choice'
  },
  {
    id: 15,
    text: 'x = 5; y = "5"; x + int(y) нәтижесі:',
    options: ['"55"', '10', 'Есептелмейді', '5'],
    correctAnswer: 1,
    explanation: 'int("5") - 5 болады, сондықтан 5 + 5 = 10.',
    type: 'choice'
  }
];

export const FALLBACK_TASKS: Task[] = [
  {
    id: '1',
    level: 'easy',
    topic: 'algorithm',
    goal: 'Сызықтық алгоритм',
    problem: 'Тіктөртбұрыштың ауданын табатын алгоритм жаз.',
    requirements: ['A, B қабырғаларын енгізу', 'S = A * B есептеу'],
    criteria: 'Логикалық реттілік сақталуы керек.'
  },
  {
    id: '2',
    level: 'medium',
    topic: 'python',
    goal: 'Шартты тексеру',
    problem: 'Санның жұп немесе тақ екенін тексеретін код жаз.',
    requirements: ['% операторын қолдану', 'if-else құрылымын қолдану'],
    criteria: 'Дұрыс нәтиже шығуы керек.'
  }
];

const randomChoice = (arr) => {
    let randomInd = Math.floor(Math.random() * arr.length)
    return arr[randomInd]
}

export const randomQuestion = cards => {
    let answer = randomChoice(cards)
    let question = answer.definition;
    let choices = [
        null,
        null,
        null,
        null
    ];
    let randInd = Math.floor(Math.random() * 4)
    choices[randInd] = answer.term;
    choices.forEach((item, i) => {
        if (item === null) {
            choices[i] = randomChoice(cards).term
        }
    })

    return {
        question,
        choices,
        correct: answer.term
    }
}
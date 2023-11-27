const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const fs = require('fs');
const rl = readline.createInterface({ input, output });
class Terminal{

    constructor(props) {

    }


    questionAsync(prompt) {
        let promise = new Promise((resolve) => {
            rl.question(prompt, resolve);
        });
        return promise;
}
}
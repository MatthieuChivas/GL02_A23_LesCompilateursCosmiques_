const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const fs = require('fs');
const rl = readline.createInterface({ input, output });

class ICalendar {
    constructor() {
        this.coursSuivie = [];
        this.getCours();
    }

    getCours() {
        this.afficherCours();
        rl.question("Ecrit un cours que tu as dans le choix au dessus", (answer) =>{
            console.log(`Tu as choisie ${answer}`);
        })
    }

    async recupererData() {
        const cheminVersFichier = './Data/data.txt';

        try {
            const data = await fs.promises.readFile(cheminVersFichier, 'utf8');
            return data;
        } catch (err) {
            console.error("Erreur lors de la lecture du fichier :", err);
            return null;
        }

        /*await fs.readFile(cheminVersFichier, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(data);
        });*/
    }

    async recupererNomCours(data){
        let i = 0;
        let cours = []

        while (i < data.length){
            if (data[i] === "+"){
                let nomCours = "";
                for (i=i+1; data[i] != '\n'; i++ ){
                    nomCours = nomCours + data[i];
                }
                cours.push(nomCours);
            }
            i++
        }
        return cours
    }

    async afficherCours() {
        let data = await this.recupererData();
        if (data === null){
            console.log("problème de fichier")
            return;
        }
        let nomCours = await this.recupererNomCours(data);

    }
}

let cours = new ICalendar();


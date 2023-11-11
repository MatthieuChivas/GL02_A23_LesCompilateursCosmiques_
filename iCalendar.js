const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const fs = require('fs');
const rl = readline.createInterface({ input, output });
//const rl1 = readline.createInterface({ input, output });

class ICalendar {
    constructor() {
        this.coursSuivie = [];
        this.getCours();
    }

    async getCours() {
        let calendar = [];
        let cours = await this.recupererNomCours();
        this.afficherNomCours(cours)
        rl.question("Ecrit un cours que tu as dans le choix au dessus",async (answerNomCours) =>{
            console.log(`Tu as choisie ${answerNomCours}`);

            let infoCours = await this.recupererInfoCours(answerNomCours);
            let coursSelectionner = await this.afficherInfoCours(infoCours, 1);
            rl.question("Ecrit le numéro du cours que tu assistes",async (answerInfoCours) =>{
                try {
                    calendar.push([answerNomCours, coursSelectionner.infoCours[answerInfoCours -1 ]]);
                } catch (err){
                    console.log(err);
                }finally {
                    rl.close();
                }
            });
        });
    }

    async recupererInfoCours(answer){
        let infoCours = [];
        let data = await this.recupererData();
        if (data === null){
            console.log("problème de fichier")
            return;
        }
        const indexInfo = data.indexOf(answer);
        let i=(indexInfo+ answer.length +2);
        while (data[i]!=="+"){
            let cours = "";
            while (data[i]!== "\n"){
                cours += data[i]
                i++
            }
            infoCours.push(cours);
            i++;
        }
        return infoCours;
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

    async recupererNomCours(){
        let data = await this.recupererData();
        if (data === null){
            console.log("problème de fichier")
            return;
        }
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

    afficherNomCours(info) {
        for(let i = 0; i<info.length; i++){
            console.log(info[i]);
        }
    }

    async afficherInfoCours(info, index){
        let infoCours = [];
        for(let value in info){
            let indexJour = (await info[value].indexOf("H=")) +2;
            let i = 2;
            let horaire = "";
            while (info[value][indexJour+i] !== ","){
                horaire += info[value][indexJour+i];
                i++
            }
            let indexSalle = (await info[value].indexOf("S="))+2
            i=0;
            let salle = "";
            while (info[value][indexSalle+i] !== "/"){
                salle += info[value][indexSalle+i];
                i++
            }
            if ((await info[value].indexOf("/") !== (await info[value].indexOf("//")))){
                let indexInfo = (await info[value].indexOf("/")) +1
                let autreInfo = info[value].slice(indexInfo);
                let temp = await this.afficherInfoCours(["H=" + autreInfo], index)
                index = temp.index
                infoCours.push(temp.infoCours[0])
            }
            console.log(`${index}: A tu cours le ${dictionnaireJours[info[value][indexJour]].jour} ${horaire} en ${salle}`)
            infoCours.push([dictionnaireJours[info[value][indexJour]].jour, horaire, salle])
            index++;
        }
        return {infoCours, index}
    }
}
let dictionnaireJours = {
    "L" : {jour: "Lundi"},
    "MA": {jour: "Mardi"},
    "ME": {jour: "Mercredi"},
    "J": {jour: "Jeudi"},
    "V": {jour: "Vendredi"},
    "S": {jour: "Samedi"},
    "D": {jour: "Dimanche"},
}
let cours = new ICalendar();


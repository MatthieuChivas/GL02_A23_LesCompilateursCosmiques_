const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const fs = require('fs');
const rl = readline.createInterface({ input, output });
const path = require('path');

class ICalendar {
    constructor() {
        this.getCours()
    }

    async creerIcalendar(calendar){
        let uid = 1;
        let answerDateDebut = await new Date(await this.questionAsync("Ecrit la date du début du calendrier du type (yyyy-mm-dd)"));
        let answerDateFin = await new Date(await this.questionAsync("Ecrit la date de fin du calendrier du type (yyyy-mm-dd)"));
        let Icalendar = "BEGIN:VCALENDAR\n" +
            "VERSION:2.0\n" +
            "PRODID/-//LESBOSSDUCDC//CLIENT/FR\n";
        while (answerDateDebut.getTime() < answerDateFin.getTime()){
            for (let cours in calendar){
                if (calendar[cours][1][0] === dictionnaireChiffreToJour[answerDateDebut.getDay()].jour){
                    Icalendar += "BEGIN:VEVENT\n" +
                        `UID:${uid}\n` +
                        `LOCATION:${calendar[cours][1][2]}\n` +
                        `SUMMARY:Cours\n` +
                        `DESCRIPTION:Cours de ${calendar[cours][0]} en :${calendar[cours][1][2]}\n` +
                        "CLASS:PUBLIC\n" +
                        `DTSTART:${(await this.modifierDate(answerDateDebut)) + "T" + this.recupererHeureDebut(calendar[cours][1][1]) + "00Z\n"}` +
                        `DTEND:${(await this.modifierDate(answerDateDebut)) + "T" + this.recupererHeureFin(calendar[cours][1][1]) + "00Z\n"}` +
                        `DTSTAMP:${this.recupererStamp()}\n` +
                        `END:VEVENT\n`;
                    uid++;
                }
            }
            answerDateDebut.setDate(answerDateDebut.getDate() +1);
        }
        Icalendar += "END:VCALENDAR"
        await fs.promises.writeFile('./write.ics', Icalendar);
        console.log("Icalendar exporter avec succès");
    } catch (error) {
        console.error("Erreur lors de l'écriture du fichier :", error);
    }
    modifierDate(date){
        let year = date.getFullYear();
        let month = "";
        if (date.getMonth()+1<10){
            month = "0" + date.getMonth();
        } else {
            month = date.getMonth();
        }
        let day = "";
        if (date.getDate()<10){
            day = "0" + date.getDate()
        } else {
            day = date.getDate()
        }
        return year + month + day

    }

    recupererHeureDebut(heures){
        heures = heures.slice(0, heures.indexOf("-")).split(" ")[1]
        let nouvelleHeure = "";
        let i = 0;
        while (heures[i] != ":"){
            nouvelleHeure += heures[i]
            i++
        }
        if (nouvelleHeure.length <2){
            nouvelleHeure = "0" + nouvelleHeure
        }
        nouvelleHeure += heures[i+1] + heures[i+2]
        return nouvelleHeure
    }

    recupererHeureFin(heures){
        heures = heures.slice(heures.indexOf("-")+1)
        let nouvelleHeure = "";
        let i = 0;
        while (heures[i] != ":"){
            nouvelleHeure += heures[i]
            i++
        }
        if (nouvelleHeure.length <2){
            nouvelleHeure = "0" + nouvelleHeure
        }
        nouvelleHeure += heures[i+1] + heures[i+2]
        return nouvelleHeure
    }

    recupererStamp(){
        let date = new Date()
        date = date.toISOString().split('-')
        date = date.join("").split(":").join("")
        date = date.slice(0, date.indexOf("."))
        date += "Z"
        return date
    }
    async getCours() {
        let reponse = "1";
        let calendar = [];

        while (reponse === "1") {
            const cours = await this.recupererNomCours();
            this.afficherNomCours(cours);

            const answerNomCours = await this.questionAsync("Ecris un cours que tu as dans le choix ci-dessus : \n");
            console.log(`Tu as choisi ${answerNomCours}`);

            const infoCours = await this.recupererInfoCours(answerNomCours);
            const coursSelectionner = await this.afficherInfoCours(infoCours, 1);

            const answerInfoCours = await this.questionAsync("Ecris le numéro du cours que tu assistes : \n");
            try {
                if (coursSelectionner.infoCours[answerInfoCours - 1] !== undefined) {
                    calendar.push([answerNomCours, coursSelectionner.infoCours[answerInfoCours - 1]]);
                } else {
                    console.log("Tu as choisi une mauvaise valeur");
                }
            } catch (err) {
                console.log(err);
            }

            reponse = await this.questionAsync("Veux-tu encore rajouter des enseignements ? \n1-Oui \n2-Non\n");
        }
        this.creerIcalendar(calendar)
    }

        questionAsync(prompt) {
        return new Promise((resolve) => {
            rl.question(prompt, resolve);
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
        let i=(indexInfo + answer.length +2);
        while (data[i]!=="+" && i<data.length && indexInfo !== -1){
            let cours = "";
            while (data[i]!== "\n" && i<data.length){
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
            let jour = "";
            while (info[value][indexJour] !== " "){
                jour += info[value][indexJour]
                indexJour++
            }
            let horaire = "";
            while (info[value][indexJour] !== ","){
                horaire += info[value][indexJour];
                indexJour++;
            }
            let indexSalle = (await info[value].indexOf("S="))+2
            let salle = "";
            while (info[value][indexSalle] !== "/"){
                salle += info[value][indexSalle];
                indexSalle++;
            }
            if ((await info[value].indexOf("/") !== (await info[value].indexOf("//")))){
                let indexInfo = (await info[value].indexOf("/")) +1
                let autreInfo = info[value].slice(indexInfo);
                let temp = await this.afficherInfoCours(["H=" + autreInfo], index)
                index = temp.index
                infoCours.push(temp.infoCours[0])
            }
            console.log(`${index}: A tu cours le ${dictionnaireJours[jour].jour} ${horaire} en ${salle}`)
            infoCours.push([dictionnaireJours[jour].jour, horaire, salle])
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

let dictionnaireChiffreToJour = {
    "0" : {jour: "Lundi"},
    "1": {jour: "Mardi"},
    "2": {jour: "Mercredi"},
    "3": {jour: "Jeudi"},
    "4": {jour: "Vendredi"},
    "5": {jour: "Samedi"},
    "6": {jour: "Dimanche"},
}
let cours = new ICalendar();


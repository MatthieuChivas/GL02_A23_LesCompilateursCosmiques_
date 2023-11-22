const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const fs = require('fs');
const rl = readline.createInterface({ input, output });


class iCalendar{

    constructor(listeCours) {
        this.listeCours = listeCours
        this.execution()

    }

    async execution(){
        let cours = []
        let continuer = "oui"
        let nomsCours = await this.recupererNomsCours()
        while (continuer === "oui"){
            let nomCours = await this.questionUtilisateurNomCours(nomsCours)
            let infoCours = await this.recupererCours()
            if (infoCours){
                cours.push([nomsCours, infoCours])
            }
            continuer = await this.questionAsync("Veux-tu continuer ? oui/non")
        }
        await creerICalendar(cours)
    }

    recupererNomsCours(){
        let nomsCours = [];
        for (let cours in this.listeCours){
            nomsCours.push(this.listeCours[cours].nom)
        }
        return nomsCours
    }

    async questionUtilisateurNomCours(nomsCours){
        for (let cours in nomsCours){
            console.log(nomsCours[cours])
        }
        return await this.questionAsync("Ecris un cours que tu as dans le choix ci-dessus : \\n")

    }

    recupererCours(nomCours){
        let cours;
        for (let i in this.listeCours){
            if (this.listeCours[i].nom === nomCours){
                return this.recupererInfoCours(i)
            }
        }
        console.log("Le cours que tu as choisie n'existe pas donne un de la liste")
        return true

    }
    async recupererInfoCours(cours){
        let i = 1
        for (let info in cours.creneau){
            console.log(`${i} -> As tu cours le ${cours.creneau[info].horaire.jour} de ${cours.creneau[info].horaire.heureDebut} à ${cours.creneau[info].horaire.heureFin}`)
            i++
        }
        return cours.creneau[(await this.questionAsync("Ecris le numéro du cours que tu assistes : \n")) - 1]
    }

    async creerICalendar(allCours){
        let uid = 1
        let answerDateDebut = await new Date(await this.questionAsync("Ecrit la date du début du calendrier du type (yyyy-mm-dd)"))
        let answerDateFin = await new Date(await this.questionAsync("Ecrit la date de fin du calendrier du type (yyyy-mm-dd)"))
        let Icalendar = "BEGIN:VCALENDAR\n" +
            "VERSION:2.0\n" +
            "PRODID/-//LESBOSSDUCDC//CLIENT/FR\n";
        while (answerDateDebut.getTime() < answerDateFin.getTime()){
            for (let cours in allCours){
                if(this.dictionnaireJours[allCours[cours].creneau.horaire.jour] === dictionnaireChiffreToJour[answerDateDebut.getDay()].jour){
                    Icalendar += "BEGIN:VEVENT\n" +
                        `UID:${uid}\n` +
                        `LOCATION:${allCours[cours].creneau.salle}\n` +
                        `SUMMARY:Cours\n` +
                        `DESCRIPTION:Cours de ${allCours[cours].nom} en :${allCours[cours].creneau.salle}\n` +
                        "CLASS:PUBLIC\n" +
                        `DTSTART:${(await this.modifierDate(answerDateDebut)) + "T" + this.recupererHeure(allCours[cours].creneau.horaire.heureDebut) + "00Z\n"}` +
                        `DTEND:${(await this.modifierDate(answerDateDebut)) + "T" + this.recupererHeure(allCours[cours].creneau.horaire.heureFin) + "00Z\n"}` +
                        `DTSTAMP:${this.recupererStamp()}\n` +
                        `END:VEVENT\n`;
                    uid++;
                }
            }
            answerDateDebut.setDate(answerDateDebut.getDate() +1);
        }
        Icalendar += "END:VCALENDAR"
        try{
            await fs.promises.writeFile('./write.ics', Icalendar);
            console.log("Icalendar exporter avec succès");
        } catch (err){
            console.log("Erreur lors de l'écriture du fichier :", err)
        }

    }

    modifierDate(date){
        let year = date.getFullYear().toString();
        let month = "";
        if (date.getMonth()+1<10){
            month = "0" + (date.getMonth() +1).toString();
        } else {
            month = (date.getMonth() +1).toString();
        }
        let day = "";
        if (date.getDate()<10){
            day = "0" + date.getDate().toString()
        } else {
            day = date.getDate().toString()
        }
        return year + month + day

    }

    recupererHeure(heures){
        //A faire dépend de comment sont les horaires
    }

    questionAsync(prompt) {
        return new Promise((resolve) => {
            rl.question(prompt, resolve);
        });
    }

    dictionnaireJours = {
        "L" : {jour: "Lundi"},
        "MA": {jour: "Mardi"},
        "ME": {jour: "Mercredi"},
        "J": {jour: "Jeudi"},
        "V": {jour: "Vendredi"},
        "S": {jour: "Samedi"},
        "D": {jour: "Dimanche"},
    }

    dictionnaireChiffreToJour = {
        "1" : {jour: "Lundi"},
        "2": {jour: "Mardi"},
        "3": {jour: "Mercredi"},
        "4": {jour: "Jeudi"},
        "5": {jour: "Vendredi"},
        "6": {jour: "Samedi"},
        "0": {jour: "Dimanche"},
    }
}
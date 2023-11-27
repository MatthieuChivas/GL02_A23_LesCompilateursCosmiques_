const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const fs = require('fs');
const rl = readline.createInterface({ input, output });


class iCalendar{

    constructor(listeCours) {
        this.listeCours = listeCours
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

    async recupererCours(nomCours){
        let cours;
        for (let i in this.listeCours){
            if (this.listeCours[i].nom === nomCours){
                return (await this.recupererInfoCours(this.listeCours[i]))
            }
        }
        console.log("Le cours que tu as choisie n'existe pas donne un de la liste")
        return true

    }

    async recupererInfoCours(cours) {
        for (let i in cours.creneau) {
            console.log(`${parseInt(i) + 1} -> As tu cours le ${cours.creneau[i].horaire.jour} de ${cours.creneau[i].horaire.dateDebut/*.getAll()*/} à ${cours.creneau[i].horaire.dateFin/*.getAll()*/}`);
        }
            let reponse = await this.questionAsync("Ecrit le numero de cours que tu assistes :")
            console.log(reponse)
            if (reponse >= 1 && reponse <= cours.creneau.length) {
                return cours.creneau[reponse];
            } else {
                console.log("Réponse invalide. Veuillez entrer un numéro valide.");
                // Vous pouvez ajouter une logique pour gérer la réponse invalide, par exemple, redemander la question.
                return await this.recupererInfoCours(cours);
            }
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
                if(allCours[cours][1].horaire.jour === dictionnaireChiffreToJour[answerDateDebut.getDay()].jour){
                    Icalendar += "BEGIN:VEVENT\n" +
                        `UID:${uid}\n` +
                        `LOCATION:${allCours[cours][1].creneau.salle.nom}\n` +
                        `SUMMARY:Cours\n` +
                        `DESCRIPTION:Cours de ${allCours[cours][0]} en :${allCours[cours][1].creneau.salle.nom}\n` +
                        "CLASS:PUBLIC\n" +
                        `DTSTART:${(await this.modifierDate(answerDateDebut)) + "T" + this.recupererHeure(allCours[cours].creneau.horaire.dateDebut) + "00Z\n"}` +
                        `DTEND:${(await this.modifierDate(answerDateDebut)) + "T" + this.recupererHeure(allCours[cours].creneau.horaire.dateFin) + "00Z\n"}` +
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
        if (heures.heure.length == 1){
            return "0" + heures.heure + heures.minute
        } else {
            return heures.heure + heures.minute
        }
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
module.exports = iCalendar;
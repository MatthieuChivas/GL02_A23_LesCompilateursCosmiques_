class Horaire{
    constructor(jour,heureDebut,heureFin){
        this.jour=jour;
        this.heureDebut=heureDebut;
        this.heureFin=heureFin;
    }
}
// Modifier car on a modifier dans le main les heures : heureDebut = DateDebut donc il faut changer l'accès aux heures dans le programme 
module.exports = Horaire;
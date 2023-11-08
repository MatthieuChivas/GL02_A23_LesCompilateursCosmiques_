class Creneau{
    constructor(type,salle,horaire){
        this.salle=salle;
        this.type=type;
        this.horaire=horaire;
    }

    afficherHeureCreneau(){
        console.log(`Le creneau est a l'horaire : ${this.horaire}`);
    }
}



module.exports = Creneau;
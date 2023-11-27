class Creneau{
    constructor(type,salle,horaire,nombreEleve){
        this.salle=salle;
        this.type=type;
        this.horaire=horaire;
        this.nombreEleve=nombreEleve;
    }
    getSalle(){
        return this.salle;
    }
    toString(){
        console.log(`Le type du creneau est : ${this.type}, la salle ${this.salle.nom}, le nombreDeleve : ${this.nombreEleve}`);
        console.log("L'horaire : ");
        this.horaire.toString();
    }
}


module.exports = Creneau;
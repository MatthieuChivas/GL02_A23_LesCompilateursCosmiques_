class Horaire{
    constructor(jour,dateDebut,dateFin){
        this.jour=jour;
        this.dateDebut=dateDebut;
        this.dateFin=dateFin;
    }
    toString(){
        console.log(`La date de debut est : ${this.dateDebut}`);
        console.log(`La date de fin est : ${this.dateFin}`);
        console.log("FINDELHORAIRE")
    }
}

module.exports = Horaire;
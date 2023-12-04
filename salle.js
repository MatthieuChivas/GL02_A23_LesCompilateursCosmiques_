class Salle{
    constructor(nom){
        this.nom=nom;
    }

    ajouterCreneau(creneau){
        this.creneauxOccupations.push(creneau);
    }

    afficherLaSalle(){
        console.log(`La salle ${nom} a une capacite de ${capacite}`);
    }
}

module.exports = Salle;

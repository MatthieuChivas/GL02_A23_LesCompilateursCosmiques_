class Salle{
    constructor(nom, capacite){
        this.nom=nom;
        this.capacite=capacite;
        this.creneauxOccupations = new Array();
    }

    ajouterCreneau(creneau){
        this.creneauxOccupations.push(creneau);
    }

    afficherLaSalle(){
        console.log(`La salle ${nom} a une capacite de ${capacite}`);
    }

}

export default Salle;

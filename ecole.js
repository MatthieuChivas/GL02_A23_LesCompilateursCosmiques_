class Ecole{
    constructor(){
        this.listeCours = new Array();
        this.listeSalle = new Array();
    }

    addCours(cours){
        this.listeCours.push(cours);
    }

    getCours(){
        return this.listeCours;
    }
    
    addSalle(salle){
        this.listeSalle.push(this.listeSalle);
    }

    getSalle(){
        return this.salle;
    }

    isLaSalleEstCreeAPartirDunNom(salleNom){
        let checkSalleDejaCree=false;
        this.listeSalle.forEach((salleDejaCree)=>{
            if(salleDejaCree.nom==salleNom){
                checkSalleDejaCree = true;
                return(checkSalleDejaCree);
            }
        });

        if(checkSalleDejaCree){
            //console.log("Cette salle existe déjà!");
            return(checkSalleDejaCree);
        }
        else{
            this.listeSalle.push(salleNom);
            return(checkSalleDejaCree);
        }
    }

    afficherEcole(){
        this.listeCours.forEach((cours)=>{
            console.log(`Le cours ${cours.nom} a autant de creneau :`);
            cours.getCreneaux().forEach((creneau)=>{
                console.log(`Le creneau ${creneau.type} est a ${creneau.salle.nom} a ${creneau.horaire.heureDebut} jusque ${creneau.horaire.heureFin} le ${creneau.horaire.jour}`);
            })
        })
    }

    creerICalendar(){
        let iCalendar = new iCalendar(this.listeCours)
    }
}

module.exports = Ecole;
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
}

module.exports = Ecole;
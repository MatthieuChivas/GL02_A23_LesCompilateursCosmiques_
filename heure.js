class Heure {
    constructor(heure,minute){
        this.heure=heure;
        this.minute=minute;
        
    }
    convertionStringToInt(){
        let HeuresInt = parseInt(this.heure)+this.dictionnnaireStringToInt[this.minute].minute;
        console.log(HeuresInt)
        return HeuresInt
    }
    // Je me suis trompée au premier merge, j'avais mis OO au lieu de 00

    dictionnnaireStringToInt = {
        "00" : {minute : 0},
        "30" : {minute : 0.5},
    }
    
   
}


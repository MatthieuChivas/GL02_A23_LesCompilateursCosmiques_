const Ecole = require('./ecole.js');
const Fichier = require('./gestionFichier.js');
const ICalendar = require('./iCalendar.js');
const ExcelJS = require('exceljs');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { transferableAbortSignal } = require('node:util');
const { Console } = require('node:console');

const rl = readline.createInterface({ input, output });


class Main{
    universite;

    constructor(){
        this.importationDonneEtCreationObjets();
        this.afficherMenu();
    }

    async afficherMenu(){
        console.log("**************************************************");
        console.log("Bienvenue sur ce programme de gestion d'universite");
        console.log("");
        let answer = await this.questionAsync('1 - Recherche de classe associée à un cours\n2 - Recherche de capacite dune salle\n3- Recherche disponibilite dune salle \n4- Recherche de salle libre pour un creneau \n5- Export de lemploi du temps \n6 - Visualisation des taux des salles \n7 - Generer le classement des salles par capacite daccueil \nChoix --> ')
            if(answer=='1'){
                await this.menuClasseAssocieCours();
            }
            else if(answer=='2'){
                await this.menuCapaciteSalle();
            }
            else if(answer=='3'){
                await this.menuDisponibiliteDuneSalle();
            }
            else if(answer=='4'){
                await this.menuSalleLibrePourUnCreaneau();
            }
            else if(answer=='5'){
                await this.menuExportEmploiDuTemps();
            }
            else if(answer=='6'){
                await this.menuVisualisationTauxOccupationSalles();
            }else if(answer=='7'){
                await this.menuClassementSalleParCapaciteDoccupation();
            }

            answer = this.questionAsync('\n\nVeux tu continuer? \nChoix --> ')
                console.log(`${answer}`);
                if(answer=="oui"){
                    console.clear();
                    this.afficherMenu();
                }else{
                    rl.close();
                }
    }

    async menuExportEmploiDuTemps(){
        console.clear();
        let iCal = new ICalendar(this.universite.listeCours);
        //await iCal.execution();
        let cours = []
        let continuer = "oui"
        let nomsCours = await iCal.recupererNomsCours()
        while (continuer === "oui"){
            let nomCours = await iCal.questionUtilisateurNomCours(nomsCours)
            let infoCours = await iCal.recupererCours(nomCours)
            if (infoCours !== true){
                cours.push([nomCours,infoCours])
            }
            continuer = await iCal.questionAsync("Veux-tu continuer ? oui/non")
        }
        await iCal.creerICalendar(cours)

    }

    menuDisponibiliteDuneSalle(){
        
        
    }

    menuVisualisationTauxOccupationSalles(){
    }

    importationDonneEtCreationObjets(){
        const fichier = new Fichier('./Data/data.txt');
        this.universite = fichier.creationEcoleParLectureFichier();
    }

    //menu de la SPEC1 : 
    //permet d'obtenir les salles asssociés à un cours
    async menuClasseAssocieCours(){
        console.clear();
        console.log("**************************************************");
        console.log("*** Voici les salles qui sont accosiées à un cours ***")

        const sallesCours = new Map();
        let listeSalle = new Array();

        //on récup tous les cours de l'universite
        let listeCours = this.universite.getCours();
        listeCours.forEach(cours=>console.log(`${cours.nom}`));
        
        listeCours.forEach((cours) => {
            
            cours.getCreneaux().forEach((creneau) => {
                //on récupère les salles qui sont associés à tous les créneaux d'un cours
                listeSalle.push(creneau.salle.nom);
            })

            let listeSalleIdentique = new Set(listeSalle);
            sallesCours.set(cours.nom, listeSalleIdentique);

            listeSalleIdentique = [];
            listeSalle = [];
        })

        //affichage :
        // sallesCours.forEach((valueSet,key)=>{
        //     console.log(`Cours : ${key}, Salles :`);
        //     valueSet.forEach(value=>{
        //         console.log(value);
        //     })
        // })  
        
        const coursDemande = await this.questionAsync("ecrire le nom du cours : ")
        if(sallesCours.has(coursDemande)){
            console.log(`Le cours ${coursDemande} est associé aux salles :`);
            sallesCours.get(coursDemande).forEach((salle)=>console.log(salle));
        }else{
            console.log("Le cours demandé n'est pas dispensé dans cet établissement");
        }

    }

    questionAsync(prompt) {
        return new Promise((resolve) => {
        rl.question(prompt, resolve);
         });     
        }
    // Méthode pour vérifier la disponibilité pour une salle donnée
async menuDisponibiliteDuneSalle() {
    const SalleDemande = await this.questionAsync("Ecrire le nom de la salle : ");
      // Vérifier l'existence d'une salle
      let salleExiste = false;

      this.universite.getCours().forEach((cours) => {
          cours.getCreneaux().forEach((creneau) => {
              if (creneau.salle.nom === SalleDemande) {
                  salleExiste = true;
              }
          });
      });
  
      if (!salleExiste) {
          console.log("Erreur : La salle n'existe pas ou est mal écrite.");
          return;
      }
    if(salleExiste==true){
      const dictionnaireCreneaux = this.estLibre(SalleDemande);
    //console.log(dictionnaireCreneaux);
    // Dictionnaire des heures disponibles de 8h à 20h par pas de 30 minutes
    const heuresDisponibles = {};
    for (let heure = 8; heure <= 20; heure++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const heureMinute = `${heure}:${minute.toString().padStart(2, "0")}`;
        heuresDisponibles[heureMinute] = true; // Initialise chaque heure comme disponible
      }
    }
    // Utilisation de la fonction pour obtenir les créneaux libres par jour
    const creneauxLibresParJour = this.trouverCreneauxLibres(heuresDisponibles, dictionnaireCreneaux);
    // Affichage des créneaux libres par jour
    console.log("Créneaux libres par jour :");
    console.log(creneauxLibresParJour);
    } 
    
  }
  // Fonction pour trouver les créneaux libres 
  // Fonction pour obtenir les créneaux libres par jour
trouverCreneauxLibres(heuresDisponibles, dictionnaireCreneaux) {
    const creneauxLibresParJour = {};
  
    // Parcours de chaque jour de la semaine dans le dictionnaire de créneaux
    Object.keys(dictionnaireCreneaux).forEach((jour) => {
      creneauxLibresParJour[jour] = [];
  
      // Récupération des créneaux occupés pour ce jour
      const creneauxOccupes = dictionnaireCreneaux[jour];
  
      // Parcours des heures disponibles
      Object.keys(heuresDisponibles).forEach((heureDisponible) => {
        // Convertir l'heure disponible en nombre pour la comparaison
        const heureDisponibleNum = parseInt(heureDisponible.split(':')[0]);
  
        // Vérification si l'heure disponible est dans un créneau occupé
        const estOccupee = creneauxOccupes.some((creneauOccupe) => {
          const [debutOccupe, finOccupe] = creneauOccupe.split('-');
          const debutOccupeNum = parseInt(debutOccupe.split(':')[0]);
          const finOccupeNum = parseInt(finOccupe.split(':')[0]);
  
          // Si l'heure disponible est comprise dans un créneau occupé
          return heureDisponibleNum >= debutOccupeNum && heureDisponibleNum < finOccupeNum;
        });
  
        // Si l'heure disponible n'est pas occupée, on l'ajoute aux créneaux libres
        if (!estOccupee) {
          creneauxLibresParJour[jour].push(heureDisponible);
        }
      });
    });
  
    return creneauxLibresParJour;
  }
  
  
  // Fonction estLibre pour récupérer les créneaux occupés pour une salle donnée
  estLibre(SalleChercher) {
    const dictionnaireSemaine = {
      "L": [],
      "M": [],
      "ME": [],
      "J": [],
      "V": [],
      "SA": [],
    };
  
    // Remplir dictionnaireSemaine avec les créneaux occupés pour la salle spécifiée
    this.universite.getCours().forEach((cours) => {
      cours.getCreneaux().forEach((creneau) => {
        if (creneau.salle.nom === SalleChercher) {
          dictionnaireSemaine[creneau.horaire.jour].push(`${creneau.horaire.dateDebut.heure}:${creneau.horaire.dateDebut.minute}-${creneau.horaire.dateFin.heure}:${creneau.horaire.dateFin.minute}`);
        }
      });
    });
  
    return dictionnaireSemaine;
  }
  // Méthode pour récupérer les créneaux occupés pour toutes les salles
  menuVisualisationTauxOccupationSalles(){
  const EnsembleSalles = this.NosSalles();
  const Occupationtotale = this.OccupationSalles(EnsembleSalles);
  console.log("Le taux d'occupation des différentes salles : ");
  console.log(Occupationtotale);
  this.genererFichierExcel(Occupationtotale);
  
  }
  NosSalles(){
        const toutesLesSalles = {}; // Initialisation du dictionnaire
        // Parcours de toutes les salles disponibles
        this.universite.getCours().forEach((cours) => {
            cours.getCreneaux().forEach((creneau) => {
                const salleNom = creneau.salle.nom;
                if (!toutesLesSalles[salleNom]) {
                    toutesLesSalles[salleNom] = {
                        "L": [],
                        "M": [],
                        "ME": [],
                        "J": [],
                        "V": [],
                        "SA":[],
                    };
                }
                
                toutesLesSalles[salleNom][creneau.horaire.jour].push(`${creneau.horaire.dateDebut.heure}:${creneau.horaire.dateDebut.minute}-${creneau.horaire.dateFin.heure}:${creneau.horaire.dateFin.minute}`);
            });
           
        });
        return toutesLesSalles;
    }
  
    OccupationSalles(EnsembleSalles) {
        const tauxOccupationSalles = {};
      
        Object.keys(EnsembleSalles).forEach((salle) => {
          const heuresOccupationJour = {
            "L": 0,
            "M": 0,
            "ME": 0,
            "J": 0,
            "V": 0,
            "SA": 0,
          };
      
          Object.keys(EnsembleSalles[salle]).forEach((jour) => {
            heuresOccupationJour[jour] = this.calculerHeuresTotalesJour(EnsembleSalles[salle][jour]);
          });
      
          const heuresTotalesSemaine = Object.values(heuresOccupationJour).reduce((total, heures) => total + heures, 0);
          const heuresTotalesPossibles = (20.5 - 8) * 6; // Nombre total d'heures possibles (8h à 20h, 6 jours)
          const tauxOccupation = (heuresTotalesSemaine / heuresTotalesPossibles) * 100;
      
          tauxOccupationSalles[salle] = `${tauxOccupation.toFixed(2)}%`; // Arrondi à deux décimales
        });
      
        return tauxOccupationSalles;
      }
      
  calculerHeuresTotalesJour(creneauxJour) {
    let totalHeures = 0;
  
    creneauxJour.forEach((creneau) => {
      const [heureDebut, minuteDebut] = creneau.split('-')[0].split(':');
      const [heureFin, minuteFin] = creneau.split('-')[1].split(':');
  
      const heuresDebut = parseInt(heureDebut);
      const heuresFin = parseInt(heureFin);
      const minutesDebut = parseInt(minuteDebut);
      const minutesFin = parseInt(minuteFin);
  
      const dureeHeures = heuresFin - heuresDebut;
      const dureeMinutes = (dureeHeures * 60) + (minutesFin - minutesDebut);
      const dureeEnHeures = dureeMinutes / 60;
  
      totalHeures += dureeEnHeures;
    });
  
    return totalHeures;
  }
// Fonction pour générer le fichier Excel
async genererFichierExcel(tauxOccupation) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Taux Occupation Salles');
  
  // Ajouter des en-têtes
  worksheet.columns = [
      { header: 'Salle', key: 'salle' },
      { header: 'Taux Occupation', key: 'tauxOccupation' },
  ];

  // Ajouter les données du taux d'occupation
  Object.keys(tauxOccupation).forEach((salle) => {
      worksheet.addRow({ salle: salle, tauxOccupation: tauxOccupation[salle] });
  });
    // Définir des règles de mise en forme conditionnelle
    const tauxOccupationCol = worksheet.getColumn('tauxOccupation');
    tauxOccupationCol.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      // Vérifier si la cellule est vide ou non
      if (cell.value) {
        const tauxOccupation = parseFloat(cell.value.replace('%', ''));
  
        // Appliquer une mise en forme conditionnelle
        if (tauxOccupation > 10) {
          cell.style.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF0000' }, // Rouge vif
          };
        } else if (tauxOccupation > 5) {
          cell.style.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF9900' }, // Orange vif
          };
        } else {
          cell.style.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF00FF00' }, // Vert vif
          };
        }
      }
    });
  // Générer le fichier Excel
  const fileName = 'TauxOccupationSalles.xlsx';
  await workbook.xlsx.writeFile(fileName);
  console.log(`Le fichier ${fileName} a été généré avec succès.`);
}

}

const main = new Main();


module.exports = Main;
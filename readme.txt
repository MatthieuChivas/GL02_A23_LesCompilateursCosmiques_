### README - GL02_A23_LesCompilateursCosmisques_ - Projet GL02

Description : Ce projet permet d'organiser une université, notament de connaitre les différents créneaux de cours, leurs salles et leurs heures. 
Ce logiciel permet de lire des fichiers contenant le nom de cours, leur créneaux avec les horaires et la salle ainsi que la capacité de la salle donnée. 

Pour que le logiciel puisse lire correctement ces fichiers, ils doivent respecter la syntaxe suivante et être au format texte (.txt) 
<file> = *<BlockMatière>
<BlockMatière> = <Matière> CRLF "1", <TypeCours>,<Capacité>,<Horaire>, <SgIndex>, <salle> "//"
<Matière> = "+" (1*2ALPHA 1*2DIGIT / 1*4ALPHA 1*2DIGIT [1ALPHA]) 
<TypeCours> = ( "C" / "D" / "T" ) 1*1DIGIT
<Capacité> = "P=" 1*DIGIT
<Horaire> = "H=" <nomJour> WSP <Créneau>
<nomJour> = "L" / "MA" / "ME" / "J" / "V" / "S" / "D"
<Heure> = 2DIGIT ":" 2DIGIT
<Créneau> = <Heure> "-" <Heure>
<SgIndex> = "F" ("1" / "2" / "A" / "B")
<Salle> = "S=" (1*ALPHA 3*DIGIT / "EXT" 1*DIGIT / "//")


### Installation


Avoir accès à un éditeur de code type Visual Studio Code (https://code.visualstudio.com/Download)
Installer node sur votre ordinateur : https://nodejs.org/en/download/

Dans le dossier du projet, installer les dépendances suivantes.
Sur votre console avant le lancement du projet :
$ npm install
$ npm install exceljs

### Utilisation :

Pour lancer le logiciel :
Si vous êtes sur windows, lancer depuis vos documents le fichier "GL02 App gestion salles-win.exe"

Suivre les instructions indiquées par la console.


### Liste des contributeurs
M. Chivas (matthieu.chivas@utt.fr), M. Florian Bonelli (florian.bonelli@utt.fr), M. Adrien Laugier (adrien.laugier@utt.fr), Mme Jeanne Raynaud (jeanne.raynaud@utt.fr), Mme Alice Tréché (alice.treche@utt.fr)
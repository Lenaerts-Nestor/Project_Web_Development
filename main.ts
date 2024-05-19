import * as readline from 'readline-sync';
import { Player, Faction } from './public/interfaces/interface';


//importeren van de json github link
async function fetchFromUrl() : Promise<Player[]> {
  try {  
    const response = await fetch("https://raw.githubusercontent.com/Lenaerts-Nestor/WorldofWarcraft/main/warcraft.json");
    if(!response.ok){ //controleren als die response iets heeft gefecth
      throw new Error('Failed de fetching ding');
    }
    const data: Player[] = await response.json() as Player[]; //meneer de probleem tijdens de less, was gewoon dat ik moest zeggen dat de response.json() as PLayer[]
    return data;
  } catch (error) {
     console.log(error);
    throw new Error("de try is mislukt ;c")
  }
}

//toont alle data van de json , ze allemaal ! 
async function viewAllData(): Promise<void> {
  try {
    const data: Player[] = await fetchFromUrl();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
//we gebruiken de Klassike data.FIND() 
async function findPlayerById(id: number): Promise<Player | null> {
  try {
    const data: Player[] = await fetchFromUrl();
    return data.find(player => player.id === id) || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function Menu(){

  let Exit : boolean = false;
  while(Exit == false){
    console.log("\n \n Welcome to the warcraft viewer! \n ")
    console.log("1. View all data")
    console.log("2. Filter by ID");
    console.log("3. Exit");

    let DecidingAnswer : number = Number(readline.question("my choice is : "));
    switch (DecidingAnswer) {
      case 1:
          console.log("\n \n We gonna vieuw all the heroes from Azeroth \n\n")
          await viewAllData();
        break;
      case 2: 
        console.log("Please enter the ID of the heroe you want to filter by: ");
        let CharachterId : number = Number(readline.question())
        let dataWithId = await findPlayerById(CharachterId);
        if(dataWithId == null){
          console.log("the given Id, isnt in Azeroth. Try finding another heroe !");
        }
        else{
          console.log(`\n The heroe with id : ${dataWithId} \n` );
          console.log(dataWithId);
          
        }
        break;
      case 3:
        console.log("YOU'VE PRESSED 3, YOU WIL Leave Azeroth search engine");
        Exit = true;
      default:
        console.log("you've havent pressed a correct option, try pressing one that is shown on the screen ♥");
        break;
    }
  }
}



/* showing heroes BY NAME
fetchFromUrl().then(jsonData => {
  jsonData.forEach(player => {
    console.log(player.name);
  });
});

*/

//RUN THE MENUUU
Menu();








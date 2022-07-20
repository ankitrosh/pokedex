function getEvo(obje){
    var evoChain = [];
    var evoData = obje.chain;

    do{
        for(int i=0; i< evoData.legth;i++){
            evoChain.push(evoData[i].species.name);
        }
        
        evoData = evoData.evolves_to;
    }while(evoData != undefined && evoData.hasOwnProperty('evolves_to'))
}


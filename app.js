var express = require("express");
var app = express();
var request = require("request");
app.set("view engine","ejs");
app.use(express.static("public"));


app.get('/', function(req,res){
	
	var url = "https://pokeapi.co/api/v2/evolution-chain/26/" 
	request(url,function(error,request,body){
		var test = JSON.parse(body);
		var disp = test['chain']
		res.render("home",{data:disp});
	})
});


app.get('/evolution', function(req,res){
	var pkmn = req.query.pkmn_name;
	var url = "https://pokeapi.co/api/v2/" + "pokemon/"+pkmn;

	request(url,function(error, response, body){
		if(!error && response.statusCode == 200){
			var obj = JSON.parse(body);
			var urls = obj["species"]["url"];

			request(urls, function(error, response, body){
				var objs = JSON.parse(body);
				var urle = objs["evolution_chain"]["url"];


				request(urle, function(erro, response, body) {

					var obje = JSON.parse(body);
					var chain = getEvo(obje);

					res.render("evolution", {chain:chain});
				});
			});
		}
	});
});

app.get("/pokemon", function(req,res){
	var pkmn = req.query.pkmn_name;
	var url = "https://pokeapi.co/api/v2/" + "pokemon/"+pkmn;
	
	request(url,function(error, response, body){
		if(!error && response.statusCode == 200){
			var obj=JSON.parse(body);
			var urls =obj["species"]["url"];
			
			
			request(urls, function(error, response, body){
				var objs =JSON.parse(body);
				var urle = objs["evolution_chain"]["url"];
				
				var varieties = objs["varieties"];
				varieties = getVars(varieties);
				
				request(urle, function(error, response, body){
					var obje = JSON.parse(body);
					var chain = getEvo(obje);
					var Imgs =[];
					for(var i=0;i < chain.length;i++){
						var l ="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
						var tempImgs = []
						for(var j=0; j<chain[i].length;j++){
							var li = l+ chain[i][j].link +".png";
							tempImgs.push(li);

						}
						Imgs.push(tempImgs);
					} 
					//res.send(obj);
					console.log("fine")
					request(url, function(error, response, body){
						var obj = JSON.parse(body);
						var u = obj["sprites"]["other"]["dream_world"]["front_default"];
						var end1;
						var end0;
						var i = chain.length-1;

						if (chain[i].length ==2){
							end0 = chain[i][0].name;
								end1= chain[i][1].name;

						} else {
							end0 = chain[i][0].name;
							end1= end0;
						}
								
							
						
						console.log("fine")
						//res.send(end);
						var urlv = "https://pokeapi.co/api/v2/" + "pokemon-species/"+end0;
							request(urlv, function(error, response, body){
								var objv = JSON.parse(body);
								var mvarieties = objv["varieties"];
								mvarieties = getMVars(mvarieties);
								//res.send(chain);
								//res.send(Imgs);
								//res.send(mvarieties);
								var urlv1 = "https://pokeapi.co/api/v2/" + "pokemon-species/"+end1;
								console.log("fine")
									request(urlv1, function(error, response, body){
										
										if(end1 != end0){
											var objv1 = JSON.parse(body);
											var m1varieties = objv1["varieties"];
										m1varieties = getMVars(m1varieties);

										mvarieties = mvarieties.concat(m1varieties);
										}
										var MImgs =[];
										var l ="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
										var tempMImgs = []
										for(var j=0; j<mvarieties.length;j++){
											var li = l+ mvarieties[j].link +".png";
											tempMImgs.push(li);

										}
										MImgs.push(tempMImgs);
										var regs = getRegions(obj,chain,varieties);
										var regs0 = getRegions0(obj,chain,varieties);
										//res.send(regs0)
										//res.send(MImgs)
										console.log("fine")
										res.render("pokemon",{data:obj, chain:chain, Imgs: Imgs, varieties: varieties,mvarieties: mvarieties, MImgs: MImgs, galar: regs, alola: regs0 });

									})

							})

					})
				})
			})
			
			
			
		}
	})
});


function getMVars(varieties) {
	var v =[];

	for(var i=0; i< varieties.length; i++){
		var l =varieties[i].pokemon.url;
		var length = l.length;
		if(i==0){
			var link = l.substring(length-4).slice(0, -1);

		} else {
			var link = l.substring(length-6).slice(0, -1);
		}
		
	
		if(varieties[i].pokemon.name.substr(varieties[i].pokemon.name.length - 6) == "mega-x" || varieties[i].pokemon.name.substr(varieties[i].pokemon.name.length - 6)== "mega-y" || varieties[i].pokemon.name.substr(varieties[i].pokemon.name.length - 4) == "mega" || varieties[i].pokemon.name.substr(varieties[i].pokemon.name.length - 4) == "gmax"){
			v.push({"name":varieties[i].pokemon.name, "link":link })
		}
		



	}
	return v;

}

function getVars(varieties) {
	var v =[];

	for(var i=0; i< varieties.length; i++){
		var l =varieties[i].pokemon.url;
		var length = l.length;
		if(i==0){
			var k=4;
			var link = l.substring(length-k).slice(0, -1);
			if(link[0] != "0" & link[0] != "1" & link[0] != "2" & link[0] != "3" & link[0] != "4" & link[0] != "5" & link[0] != "6" & link[0] != "7" & link[0] != "8" & link[0] != "9"){
			k=3;
		}

		if(link[1] != "0" & link[1] != "1" & link[1] != "2" & link[1] != "3" & link[1] != "4" & link[1] != "5" & link[1] != "6" & link[1] != "7" & link[1] != "8" & link[1] != "9"){
			k=2;
		}
			 link = l.substring(length-k).slice(0, -1);

			v.push({"name":varieties[i].pokemon.name, "link":link })
		} else {
			var link = l.substring(length-6).slice(0, -1);
		}
		
		if(i != 0){
		if(varieties[i].pokemon.name.substr(varieties[i].pokemon.name.length - 6) != "mega-x" & varieties[i].pokemon.name.substr(varieties[i].pokemon.name.length - 6) != "mega-y" & varieties[i].pokemon.name.substr(varieties[i].pokemon.name.length - 4) != "mega" & varieties[i].pokemon.name.substr(varieties[i].pokemon.name.length - 4) != "gmax"){
			v.push({"name":varieties[i].pokemon.name, "link":link })
		}
		}



	}
	return v;

}

// function getEvo(obje){
//     var evoChain = [];
//     var evoData = obje.chain;

// 	evoChain.push([{"name":evoData.species.name}])
// 	var tempData = [];
// 	tempData.push(evoData.evolves_to);
// 	evoData = [];
// 	evoData.push(tempData);
	
// 	evoData = tempData;
// 	//evoData.push(evoData);
// 	var condition = false;
//     do{	
// 		var noEvo = evoData.length;
// 		console.log(evoData);
// 		for(var j=0;j<noEvo;j++){
// 			var noEvos = evoData[j].length;
// 			if(noEvos == 1){
// 				evoChain.push([{"name":evoData[j][0].species.name}]);
// 			} else {
// 				var tempChain =[];
// 				for(var i=0; i< noEvos;i++){
// 					tempChain.push({"name":evoData[j][i].species.name});
// 				}
// 				evoChain.push(tempChain);
// 			}
// 		}
		
        
// 		var tempData = [];

// 		for(var i =0; i < noEvo; i++){
// 			var noEvos = evoData[i].length;
// 			for(var j=0; j <noEvos;j++){
// 				tempData.push(evoData[i][j].evolves_to);
// 			}
			
// 		}
// 		condition = false;
// 		for(var i=0; i < noEvo; i++){
// 			var noEvos = evoData[i].length;
// 			for(var j=0; j< noEvos; j++){
// 				if(evoData[i][j].hasOwnProperty('evolves_to' ) && evoData[i][j].evolves_to.length){
				
// 					condition =true;
// 				//	console.log(condition);
// 					break;
// 				}
// 			}
			
// 			if(condition){
// 				break;
// 			}
// 		}
//         evoData = tempData;
		
// 		//console.log(evoData);
		
// 		console.log(condition);
//     }while(condition)
// //	console.log('done');
// 	return evoChain;
// }

function getEvo(obje) {
var evoChain =[];
var evoData = obje.chain;
do{




	var l = evoData.species.url.length;
	var k=4;
	var link = evoData.species.url.substring(l-4);
		
		
		if(link[0] != "0" & link[0] != "1" & link[0] != "2" & link[0] != "3" & link[0] != "4" & link[0] != "5" & link[0] != "6" & link[0] != "7" & link[0] != "8" & link[0] != "9"){
			k=3;
		}

		if(link[1] != "0" & link[1] != "1" & link[1] != "2" & link[1] != "3" & link[1] != "4" & link[1] != "5" & link[1] != "6" & link[1] != "7" & link[1] != "8" & link[1] != "9"){
			k=2;
		}

	var noEvos = evoData['evolves_to'].length;
	if(noEvos <= 1){
		
		
		evoChain.push([{"name": evoData.species.name, "link": evoData.species.url.substring(l-k).slice(0, -1)}]);

		
		
	}
	

	if(noEvos >1) {
		evoChain.push([{"name": evoData.species.name, "link": evoData.species.url.substring(l-k).slice(0, -1)}]);
		var tempChain = []
		for(var i =0; i<noEvos; i++) {
			var l = evoData.species.url.length;

			
			tempChain.push({"name": evoData["evolves_to"][i].species.name, "link": evoData["evolves_to"][i].species.url.substring(l-k).slice(0, -1)});
		}
		evoChain.push(tempChain);
		evoData = evoData['evolves_to'][0];
	}

	evoData = evoData['evolves_to'][0];

	}while(evoData != undefined && evoData.hasOwnProperty('evolves_to'));


  return evoChain;
} 

function getRegions(data, chain,varieties){

var flag = "no";
for(var x=0; x<varieties.length; x++){
	
	if(varieties[x].name.substring(varieties[x].name.length-5)== "galar"){
		flag = "yes"
		link =varieties[x].link;
	}
}

if(flag == "yes"){

	for(var i=0; i<chain.length; i++){
		for(var j=0; j< chain[i].length; j++){
			
			
			if (data["species"]["name"] == chain[i][j].name){
				var temp =[];
					for(var k=i; k<chain.length; k++){

					var tempchain=[];
					for(var l=j; l< chain[k].length; l++){


						tempchain.push({"name": chain[k][l].name + "-galar", "link": Number(link) +k-i })

							}
							temp.push(tempchain)

					}
					
				return temp;	
			}

		}
	}

} else{
	var temp= [];
	return temp;
}
	
}


function getRegions0(data, chain,varieties){

var flag = "no";
var link;
for(var x=0; x<varieties.length; x++){
	
	if(varieties[x].name.substring(varieties[x].name.length-5)== "alola"){
		flag = "yes";
		link =varieties[x].link;

	}
}

if(flag == "yes"){

	for(var i=0; i<chain.length; i++){
		for(var j=0; j< chain[i].length; j++){
			
			
			if (data["species"]["name"] == chain[i][j].name){
				var temp =[];
					for(var k=i; k<chain.length; k++){

					var tempchain=[];
					for(var l=j; l< chain[k].length; l++){


						tempchain.push({"name": chain[k][l].name + "-alola", "link": Number(link) +k-i })

							}
							temp.push(tempchain)

					}
					
				return temp;	
			}

		}
	}

} else{
	var temp= [];
	return temp;
}
	
}

app.listen(5000,function(){
	console.log("konichiwa pocket monsters desu");
});






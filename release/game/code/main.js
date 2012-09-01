/*
WTF - A text/tile based RPG/base building game
Copyright (C) 2009 DracSoft.com

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

/*
	ASCII Game - WTF (What the Frig?)	
*/
var wtf_version = "0.91 ALPHA";

include('game/lib/astar.js');
include('game/code/common_funcs.js');
include('game/code/gameplay.js');
include('game/code/worldObject.js');
include('game/code/ai.js');
include('game/code/eventfuncs.js');

setwindowtitle("What The Frig?","What The Frig?");
var maxx = get_max_x();
var maxy = get_max_y();
var maxx_half = Math.floor(maxx/2);
var maxy_half = Math.floor(maxy/2);
var screen_width=get_screen_width();
var screen_height=get_screen_height();


for (var i=1; i<15; i++){
	var c=i;
	if (i==7) c=i+1;
	create_color_pair(i,c,0);
}

create_color_pair(15,7,1);
use_color_pair(0);

var getchvar = -1;
var getchar = "";
var bottom_mesg="";
var last_player_hp=0;

var rowclear = "";
for (var i=0;i<maxx;i++)
	rowclear+=" ";
	

//show intro with copyrigth etc.
showIntro();


//show load prompt if there is one, else make new world
printxy(10,5,"CHECKING FOR PREVIOUS SAVE...");
refresh_screen();

var oldsav = stringFromFileZlib("save/world.sav");
if (oldsav=="" || typeof oldsav == "undefined") {
	print(" NO SAVE FOUND... ");
	refresh_screen();
	var tilefunc = getTileGenInput();
	var floors = getFloorInput();
	printxy(5,15,"PLEASE WAIT, GENERATING NEW WORLD.");
	refresh_screen();	
	var world = new worldObject(floors,300,300,tilefunc,"worldgen_entity_random",usefixedentitychars);
}
else 
{
	printxy(5,10,"PREVIOUS WORLD EXISTS... PRESS L KEY TO LOAD.");
	printxy(5,11,"OR PRESS ANY OTHER KEY TO START A NEW WORLD.");
	refresh_screen();
	
	if (waitForKeyInput('l')){
		printxy(5,12,"LOADING... THIS MAY TAKE A FEW MINUTES.");
		refresh_screen();
		
		printxy(5,14,"WORLD"); refresh_screen();
		var world = JSON.parse(oldsav);  
		oldsav=null;
		
		world.entityTypeArray=world.entityTypeSearchArray;
		world.tileTypeArray=world.tileTypeSearchArray;
		
		print(", TILES"); refresh_screen();
		world.tile = new Array();
		for (var z=0; z< world.zdepth; z++){
			world.tile[z] = new Array();
			var oldsavtile = stringFromFileZlib("save/tile"+z+".sav");
			var oldsavtile = oldsavtile.split("\n");			
			for (var y=0; y< world.height; y++){
				
				world.tile[z][y]=new Array();
				var oldsavtiley = oldsavtile[y].split("\t");
				
				for (var x=0; x< world.width; x++){
					//world.tile[z][y][x] = JSON.parse(oldsavtiley[x]);
					var params=oldsavtiley[x].split("\r");
					world.tile[z][y][x] = new Object();
					var ttype=getTileTypeByNameWorld(params[0], world);
					if (ttype==null){
						if (params[0]=="BASE")
							ttype=world.baseTileType;
						else	
							ttype=world.tileTypeArray[0];
					}
					
					applyTypeToTile(world,world.tile[z][y][x], ttype,z,y,x);
					world.tile[z][y][x].isbase=(params[1].toLowerCase()=="true");
					world.tile[z][y][x].hitpoints=parseInt(params[2]);
					world.tile[z][y][x].spriteIndex=parseInt(params[3]);
					
				}
				
				//world.tile[z][y] = JSON.parse(oldsavtile[y]);
				oldsavtile[y]=null;
			}
			oldsavtile=null;
		}
		
		print(", ENTITIES"); refresh_screen();
		world.entity = new Array();
		for (var z=0; z< world.zdepth; z++){
			world.entity[z] = new Array();
			var oldsaventity = stringFromFileZlib("save/entity"+z+".sav");
			var oldsaventity = oldsaventity.split("\n");			
			for (var y=0; y< world.height; y++){
				world.entity[z][y] = JSON.parse(oldsaventity[y]);
				oldsaventity[y]=null;
			}
			oldsaventity=null;
		}
		
		//load sprites if needed
		if (usefixedentitychars)
			reloadWorldSprites(world);
	}
	else {
		stringToFile("save/world.sav","");
		clearBuffer();
		var tilefunc = getTileGenInput();		
		var floors = getFloorInput();
		printxy(5,15,"NEW GAME... PLEASE WAIT, GENERATING NEW WORLD.");
		refresh_screen();
		var world = new worldObject(floors,300,300,tilefunc,"worldgen_entity_random",usefixedentitychars); 
	}
}

//setup time vars
var startTimeMs = getmstime();
var currentTickMs = getmstime();
var previousTickMs = getmstime();
var lastAITickMs = getmstime();
var timeDiffMs = 0;
var gameover=false;
var AIFreqMs = 100;
var sprite_width = get_sprite_width();
var sprite_height = get_sprite_height();

//enter main game loop
if (typeof world!="undefined")
{
	while(getchvar!=27) // == ESCAPE
	{	
		if (userealtimemode)
		    currentTickMs = getmstime();

	    timeDiffMs = previousTickMs - currentTickMs;
		
		//get input, clear world
		getchvar = getch();
		getchar = String.fromCharCode(getchvar);
		//waitUntilNoKey();	 //what was the point of this?!
	
		clearBuffer();
		
		doInput(getchvar, getchar);
		doGameLogic();			
		drawWorldToBuffer();
		last_player_hp = world.player.entity.hitpoints;
		
		//finaly update the screen
		refresh_screen();		
		if (timeDiffMs < 55)
			sleep(30);
		
		if (gameover) break;
		
		previousTickMs = currentTickMs;
		
	}

	//save game
	clearBuffer();
	refresh_screen();
	
	if (!gameover)
	{
		printxy(5,10,"PRESS S TO SAVE YOUR GAME, ANY OTHER KEY TO QUIT.");
		refresh_screen();
		
		if (waitForKeyInput('s'))	{
			printxy(5,12,"SAVING... THIS MAY TAKE A FEW MINUTES.");
			refresh_screen();
			
			saveGame();
		}
	}
	else
	{
		showStatScreen();
		printxy(5,10,"GAME OVER: PRESS SPACEBAR TO QUIT");
		printxy(5,12,"SORRY, BUT YOU ARE DEAD. PLAY AGAIN!");
		refresh_screen();
		while (getch()!=32) sleep(10);
	}
	clearBuffer();
	refresh_screen();
}
else
{
	printxy(5,10,"THERE WAS AN ERROR CREATING THE WORLD...");
	refresh_screen();
	sleep(5000);
}

function saveGame()
{
	for (var z=0; z< world.zdepth; z++){
		var zfile="";
		for (var y=0; y< world.height; y++){
			for (var x=0; x< world.width; x++){
				var s="";
				s+=world.tile[z][y][x].typename+"\r";
				s+=world.tile[z][y][x].isbase+"\r";
				s+=world.tile[z][y][x].hitpoints+"\r";
				s+=world.tile[z][y][x].spriteIndex;
				zfile+=s+"\t";
			}
			zfile+="\n";
		}
		stringToFileZlib("save/tile"+z+".sav",zfile);
	}			
	
	for (var z=0; z< world.zdepth; z++){
		var zfile="";
		for (var y=0; y< world.height; y++){
			zfile += JSON.stringify(world.entity[z][y]) + "\n";
		}
		stringToFileZlib("save/entity"+z+".sav",zfile);
	}
	
	world.entity=null;
	world.tile=null;
	world.entityTypeArray=null;
	world.tileTypeArray=null;
	stringToFileZlib("save/world.sav",JSON.stringify(world));
}

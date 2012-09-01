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

function printDebug(msg)
{
	return; 
	
	printxy(5,maxy-1,"(ENTER) DEBUG: "+msg.toUpperCase()+"                               ");
	refresh_screen();
	while (getch()!=10) sleep(10);
}

function set_bottom_mesg(mesg)
{
    if (bottom_mesg!=mesg)
	{
	    world.eventLogArray.unshift(bottom_mesg);
	    //if (world.eventLogArray.length > 100)
	    //    world.eventLogArray.pop();
	    bottom_mesg = mesg;
	}
}

function showBookmark(i)
{
	var tz =world.player.entity.pos.z, ty=world.player.entity.pos.y, tx=world.player.entity.pos.x;
	var bm = world.bookmarks[i];
	world.player.entity.pos.z=bm.z;
	world.player.entity.pos.y=bm.y;
	world.player.entity.pos.x=bm.x;
	
	set_bottom_mesg( "VIEWING FAV. COORD "+i+", PRESS "+i+" AGAIN TO SET NEW FAV. COORD");
	
	var inp=-1;
	while (inp==-1) { 
		inp=getch(); 		
		clearBuffer();	
		drawWorldToBuffer();
		refresh_screen();	
		sleep(33); 
	}
	
	world.player.entity.pos.z=tz;
	world.player.entity.pos.y=ty;
	world.player.entity.pos.x=tx;
	
	if (inp!=-1)
	{
		var inpchar = String.fromCharCode(inp);
		var inpval = parseInt(inpchar);
		if (inpval>=1 && inpval <=9 && inpval==i)
		{
			world.bookmarks[inpval].z = tz;
			world.bookmarks[inpval].y = ty;
			world.bookmarks[inpval].x = tx;
		}
		else if (inpval>=1 && inpval <=9)
		{
			showBookmark(inpval);
		}
	}
	
	set_bottom_mesg( "");
}

function stat(statname)
{
	eval("world.player.stats."+statname+"+=1;");
}

function stat_s(statname)
{
	eval("world.player.stats."+statname+"-=1;");
}

function waitForAnyKey()
{
	var inp=-1;
	while (inp==-1) { sleep(10); inp=getch(); }
}

function showEventLog()
{	
	clearBuffer();
	printxy(5,2, "//////////////////// EVENT LOG ////////////////////");
	
	var i=4;
	for (var k=0; k<17; k++)
	{
	    if (world.eventLogArray.length>k)
    	    printxy(5,i+k,(world.eventLogArray.length - k) + ": "+world.eventLogArray[k]);
	}
	
	printxy(5,i+k+1,"////////////// PRESS SPACE TO CONTINUE /////////////"); 
	refresh_screen();

	var inp=-1;
	while (String.fromCharCode(inp)!=' ') { sleep(10); inp=getch(); }
	
	clearBuffer();
}

function showStatScreen()
{	
	clearBuffer();
	printxy(5,2, "//////////////////// YOUR STATS ////////////////////");
	
	var i=4;
	printxy(5,i, "   MONSTERS KILLED: "+world.player.stats.monsters_killed); i++;
	printxy(5,i, "   MONSTERS TRAINED: "+world.player.stats.monsters_trained); i++;
	printxy(5,i, "   ANIMALS KILLED: "+world.player.stats.animals_killed); i++;
	printxy(5,i, "   ANIMALS TRAINED: "+world.player.stats.animals_trained); i++;	
	printxy(5,i, "   OBJECTS CONSTRUCTED: "+world.player.stats.objects_constructed); i++;
	printxy(5,i, "   OBJECTS DESTROYED: "+world.player.stats.objects_destroyed); i++;
	printxy(5,i, "   WEAPONS/ITEMS USED: "+world.player.stats.weapons_used); i++;
	printxy(5,i, "   RESOURCES MINED: "+world.player.stats.resources_mined); i++;
	printxy(5,i, "   OBJECTS DRAGGED: "+world.player.stats.objects_dragged); i++;
	printxy(5,i, "   PLAYER AGE IN TICKS: "+world.player.stats.game_ticks); i++;
	printxy(5,i, "   DISTANCE TRAVELLED: "+world.player.stats.distance_travelled); i++;
	printxy(5,i, "   TOTAL BASE SIZE: "+world.player.stats.base_size); i++;
	printxy(5,i, "   DAMAGE BLOCKED: "+world.player.stats.damage_defended); i++;
	printxy(5,i, "   DAMAGE TAKEN: "+world.player.stats.damage_taken); i++;
	printxy(5,i, "   DAMAGE DEALT: "+world.player.stats.damage_dealt); i++;
	printxy(5,i, "   STAIRS CLIMBED: "+world.player.stats.stairs_climbed); i++;
	printxy(5,i, "   DEATHS: "+world.player.stats.deaths); i++;
	printxy(5,i, "   LAND FARMED: "+world.player.stats.farmlands); i++;
	printxy(5,i, "   HIGHEST HP: "+world.player.stats.mosthp); i++;
	
	printxy(5,i+1,"////////////// PRESS SPACE TO CONTINUE /////////////"); 
	refresh_screen();

	var inp=-1;
	while (String.fromCharCode(inp)!=' ') { sleep(10); inp=getch(); }
	
	clearBuffer();
}

function showIntro()
{
	clearBuffer();
	printxy(5,7, "////////////////// WHAT THE FRIG? //////////////////");
	printxy(5,8, "/////////                                  /////////");
	printxy(5,9, "///////// ADVENTURE AND BASE BUILDING GAME /////////");
	printxy(5,10,"///////// COPYRIGHT 2009 - DRACSOFT.COM    /////////");
	printxy(5,11,"///////// VERSION: "+wtf_version+"               /////////");
	printxy(5,12,"/////////                                  /////////");
	printxy(5,13,"/////////   PRESS ANY KEY TO CONTINUE...   /////////");	
	printxy(5,14,"///////// LOOK AT: KEYMAP-INSTRUCTIONS.PNG /////////");	
	printxy(5,15,"/////////                                  /////////");
	printxy(5,16,"/////////      LICENSED UNDER GPL v2       /////////");
	printxy(5,17,"////////////////////////////////////////////////////");
	refresh_screen();

	var inp=-1;
	while (inp==-1) { sleep(10); inp=getch(); }
	
	clearBuffer();
}

function getFloorInput()
{	
	//clearBuffer();
	printxy(5,12,"ENTER THE # OF FLOORS TO GENERATE (1-9, DEFAULT=5): ");
	refresh_screen();
	
	var inp = getch();
	while (inp==-1) { sleep(10); inp=getch(); }
	
	var c = String.fromCharCode(inp);
	var result = 3;
	switch (c)
	{
		case '1':
			result = 1;
			break; 
		case '2':
			result = 2;
			break;
		case '3':
			result = 3;
			break;
		case '4':
			result = 4;
			break;
		case '5':
			result = 5;
			break;
		case '6':
			result = 6;
			break;
		case '7':
			result = 7;
			break;
		case '8':
			result = 8;
			break;
		case '9':
			result = 9;
			break;
		default:
			result = 5;
			break;
	}
	print(result);
	return result;
}

function getTileGenInput()
{	
	
	printxy(5,7,"  1) RANDOM TILES (AWFUL)");
	printxy(5,8,"  2) STAMPS (GOOD)");	
	printxy(5,9,"  3) CAVERN/STAMP HYBRID (BEST, DEFAULT)");
	printxy(5,11,"ENTER THE # OF THE WORLD CREATION METHOD TO USE: ");
	refresh_screen();
	
	var inp = getch();
	while (inp==-1) { sleep(10); inp=getch(); }
	
	var c = String.fromCharCode(inp);
	var result = "worldgen_tile_randomshape";
	switch (c)
	{
		case '1':
			result = "worldgen_tile_random";
			break; 
		case '2':
			result = "worldgen_tile_randomshape";
			break;
		case '3':
			result = "worldgen_tile_cavern";
			break;
		default:
			result = "worldgen_tile_cavern";
			break;
	}
	print(c);
	
	return result;
}

function arrayShuffle(o){ //v1.0
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

function clearBuffer()
{
	 //for (var i=0;i<maxy;i++)
	//	printxy(0,i,rowclear);
	clear_screen();
}

function waitForKeyInput(trueChar)
{
	var inp=-1
	while (inp==-1) { inp=getch(); sleep(0); }
	return (String.fromCharCode(inp)==trueChar);
}

function waitUntilNoKey()
{
	while (getch()!=-1) { sleep(0); }
}

/*
* getstring
* -- pauses program and gets user input (blocking)
*/
function getstring(x,y,prompt)
{
	var res="";
	var getchval=-1;
	printxy(x,y,prompt);
	refresh_screen();
	
	while (getchval!=10)
	{
		getchval = getch();
		if (getchval!=-1 && getchval!=10)
		{
			res += String.fromCharCode(getchval);
			print(String.fromCharCode(getchval));
			refresh_screen();
		}
		
		sleep(1);
	}
	
	return res;
}


/*
* loadXML
* -- creates DOM from xml
*/
function loadXML(xmlStr) {
  var parser = new DOMImplementation();
  parser.namespaceAware = false;
  var dom = parser.loadXML(xmlStr);

  return dom;
}

function loadXMLFile(filename){
	return loadXML(stringFromFile(filename));
}

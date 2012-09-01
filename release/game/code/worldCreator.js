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

include('game/code/worldGen.js');
var spriteIndex=0;

//used by tiles.js
function clearAllBaseTiles(world)
{
	var o = world.tileTypeArray[0];
	
	for (var z=0; z< world.zdepth-1; z++)
		for (var y=0; y< world.height-1; y++)
			for (var x=0; x< world.width-1; x++)
			{
				if (world.tile[z][y][x].isbase)
				{
					world.tile[z][y][x].isbase=false;					
					if (o!=null){
						applyTypeToTile(world,world.tile[z][y][x], o,z,y,x);
					}					
				}
			}
			
	world.player.stats.base_size = 0;
	world.baseTileArray= new Array();
}

function removeBaseTile(z,y,x)
{
	if (x>=0 && y>=0 && x<world.width && y<world.height)
	{
		var tile = world.tile[z][y][x];
			
		if (tile.isbase)
		{
			stat_s("base_size");
			set_bottom_mesg("YOU REMOVE A BASE TILE.");
			applyTypeToTile(world,tile,world.tileTypeArray[0],z,y,x);
			tile.isbase=false;
			for (var i=0; i<world.baseTileArray.length; i++)
				if (world.baseTileArray[i].z==z && world.baseTileArray[i].y==y && world.baseTileArray[i].x==x)
				{
					world.baseTileArray.splice(i,1);
				}
		}
	}
}
function makeBaseTile(z,y,x)
{
	if (x>=0 && y>=0 && x<world.width && y<world.height)
	{
		var tile = world.tile[z][y][x];
			
		if (tile.canbebase && !tile.isbase){
			set_bottom_mesg("YOU MAKE A BASE TILE.");
			applyTypeToTile(world,tile,world.baseTileType,z,y,x);
			tile.isbase=true;
			stat("base_size");
			
			var pos=new Object();
			pos.z=z;
			pos.y=y;
			pos.x=x;
			world.baseTileArray.push(pos);
		}
	}
}
function applyTypeToTile(world,tileobj,typeobj,z,y,x)
{
	if (tileobj.isbase){
		stat_s("base_size");
		for (var i=0; i<world.baseTileArray.length; i++)
			if (world.baseTileArray[i].z==z && world.baseTileArray[i].y==y && world.baseTileArray[i].x==x)
				world.baseTileArray.splice(i,1);
	}
	
	tileobj.character = typeobj.character;
	tileobj.does_block = typeobj.does_block;
	tileobj.typename = typeobj.typename;
	tileobj.isbase = false;
	tileobj.canbebase = typeobj.canbebase;
	
	tileobj.mineprop = new Object();
	tileobj.mineprop.minable = typeobj.mineprop.minable;
	tileobj.mineprop.mineratio = typeobj.mineprop.mineratio;
	tileobj.mineprop.minetype = typeobj.mineprop.minetype;
	tileobj.mineprop.isfarmland = typeobj.mineprop.isfarmland;
	
	tileobj.destroyable = typeobj.destroyable;
	tileobj.hitpoints = typeobj.hitpoints;	
	tileobj.damage_to_deal= typeobj.damage_to_deal;
	tileobj.spriteIndex = typeobj.spriteIndex;
		
	if(z<0 || x < 0 || y < 0 || x > world.width-1 || y > world.height-1 || z > world.zdepth-1) return;
	updateCollisionMapPos(world,z,y,x);	
}
function getTileTypeByNameWorld(name, world)
{
	for (var i=0; i<world.tileTypeSearchArray.length; i++)
	{	
		if (world.tileTypeSearchArray[i].typename == name)
			return world.tileTypeSearchArray[i];
	}
	return null;
}
function getTileTypeByName(name)
{
	for (var i=0; i<world.tileTypeSearchArray.length; i++)
	{	
		if (world.tileTypeSearchArray[i].typename == name)
			return world.tileTypeSearchArray[i];
	}
	return null;
}
function increaseLastTileTypeOdds(amt, tileTypeArray)
{
	for (var i=0; i<amt; i++)
		tileTypeArray.push(tileTypeArray[tileTypeArray.length-1]);
}
function createTileType(typename, character, does_block, minable, isfarmland, minetype, mineratio, destroyable, canbebase, damage_to_deal, hitpoints)
{
	var o = new Object();
	o.typename = typename;
	o.character = character;
	o.does_block = does_block;
	
	o.mineprop = new Object();
	o.mineprop.minable = minable;
	o.mineprop.mineratio = mineratio;
	o.mineprop.minetype = minetype;
	o.mineprop.isfarmland = isfarmland;
	
	o.destroyable = destroyable;
	o.hitpoints = hitpoints;
	o.canbebase = canbebase;
	o.damage_to_deal = damage_to_deal;
	
	if (usefixedentitychars)
		load_sprite(spriteIndex, spritefolder+"/"+typename+".bmp");
		
	o.spriteIndex = spriteIndex;
	spriteIndex++;
	
	return o;
}

//used by entities.js
function getBossEntityType(basetype, world, bossmult)
{
	if (!basetype.ismoddable)
		return basetype;
		
	var type = createEntityType(basetype.character, 
					basetype.color_pair, 
					basetype.typename + " BOSS", 
					basetype.does_block, 
					basetype.is_draggable, 
					Math.max(Math.floor(basetype.hitpoints* bossmult), 1), 
					Math.floor(basetype.hitpoints_variance* bossmult), 
					basetype.destroyable, 
					basetype.constructtype, 
					basetype.constructratio, 
					basetype.combinewithtype, 
					basetype.combineresulttype, 
					basetype.combineratio,
					basetype.isitem, 
					Math.floor(basetype.itemdamage*bossmult), 
					Math.floor(basetype.itemdamage_variance*bossmult), 
					Math.floor(basetype.healamount*bossmult), 
					Math.floor(basetype.healamount_variance*bossmult), 
					basetype.isAI, 
					basetype.ismonster, 
					basetype.isanimal, 
					basetype.istrainable, 
					0.0,	
					basetype.aifuncname, 
					Math.floor(basetype.aidamage*bossmult), 
					basetype.aidropitem, 
					basetype.aidropratio*bossmult, 
					basetype.aiextrastring,
					basetype.ismoddable, 
					basetype.zrestrict,
					basetype.disableworldgencreate);
	
	type.spriteIndex = basetype.spriteIndex;
	
	return type;
}	

function getModEntityType(basetype, world)
{
	if (!basetype.ismoddable)
		return basetype;

	var modifiers = world.entityModArray;
	
	var mod = modifiers[Math.floor(Math.random()*modifiers.length)];	
	
	var type = createEntityType(basetype.character, 
					basetype.color_pair, 
					mod.descriptor+basetype.typename, 
					basetype.does_block, 
					basetype.is_draggable, 
					Math.max(Math.floor(basetype.hitpoints* mod.hitpoints_mod), 1), 
					Math.floor(basetype.hitpoints_variance* mod.hitpoints_mod), 
					basetype.destroyable, 
					basetype.constructtype, 
					basetype.constructratio*mod.constructratio_mod, 					
					basetype.combinewithtype, 
					basetype.combineresulttype, 
					basetype.combineratio, 
					basetype.isitem, 
					Math.floor(basetype.itemdamage*mod.itemdamage_mod), 
					Math.floor(basetype.itemdamage_variance*mod.itemdamage_mod), 
					Math.floor(basetype.healamount*mod.healamount_mod), 
					Math.floor(basetype.healamount_variance*mod.healamount_mod), 
					basetype.isAI, 
					basetype.ismonster, 
					basetype.isanimal, 
					basetype.istrainable, 
					basetype.trainratio*mod.trainratio_mod,	
					basetype.aifuncname, 
					Math.floor(basetype.aidamage*mod.aidamage_mod), 
					basetype.aidropitem, 
					basetype.aidropratio*mod.aidropratio_mod, 
					basetype.aiextrastring,
					basetype.ismoddable, 
					basetype.zrestrict,
					basetype.disableworldgencreate);
	
	type.spriteIndex = basetype.spriteIndex;

	return type;
}	

function createEntityFromType(typeobj,z,y,x,world)
{
	var AIArray = world.AIArray;
	
	var e = new Object();
	e.origtypename = typeobj.typename;	
	
	//random attributes
	if (Math.random()*100 > 70)
		typeobj = getModEntityType(typeobj,world);
	
	//z-based modifier
	var zmod=1.0;
	if (typeobj.zrestrict==null){
		//zmod= (z+2)/2 ;	// an extra 0.5 per level
		zmod= (z+1);	// an extra 1.0 per floor
	}	
	
	e.character = typeobj.character;
	e.typename = typeobj.typename;	
	e.color_pair = typeobj.color_pair;		
	e.does_block = typeobj.does_block;
	e.hitpoints = typeobj.hitpoints + Math.floor(Math.random()*typeobj.hitpoints_variance);
	e.hitpoints *= zmod;
	e.spriteIndex = typeobj.spriteIndex;
	
	e.tileprop = new Object();
	e.tileprop.destroyable = typeobj.destroyable;
	e.tileprop.constructtype = typeobj.constructtype;
	e.tileprop.constructratio = typeobj.constructratio;						
	
	e.itemprop = new Object();
	e.itemprop.isitem = typeobj.isitem;
	e.itemprop.itemdamage = typeobj.itemdamage + Math.floor(Math.random()*typeobj.itemdamage_variance);
	e.itemprop.healamount = typeobj.healamount + Math.floor(Math.random()*typeobj.healamount_variance);
	e.itemprop.itemdamage*= zmod;
	e.itemprop.healamount*= zmod;
	e.itemprop.combine = new Object();
	e.itemprop.combine.combinewithtype=typeobj.combinewithtype;
	e.itemprop.combine.combineresulttype=typeobj.combineresulttype;
	e.itemprop.combine.combineratio =typeobj.combineratio;
	
	e.aiprop = new Object();
	e.aiprop.isAI = typeobj.isAI;
	e.aiprop.ismonster = typeobj.ismonster;
	e.aiprop.isanimal = typeobj.isanimal;	
	e.aiprop.aifuncname = typeobj.aifuncname;
	e.aiprop.wasattacked = false;
	if (e.aiprop.aifuncname!="") e.aiprop.aifuncname += "(world, ai);";
	
	e.aiprop.trainprop = new Object();
	e.aiprop.trainprop.istrainable = typeobj.istrainable;
	e.aiprop.trainprop.istrained=false;
	e.aiprop.trainprop.trainratio = typeobj.trainratio;	
	
	e.aiprop.item = new Object();
	e.aiprop.item.typename = typeobj.aidropitem;
	e.aiprop.item.dropratio = typeobj.aidropratio;
	
	e.aiprop.aiparams = new Object();	//used by aifunc to store specific info
	e.aiprop.aiparams.damage = typeobj.aidamage;
	e.aiprop.aiparams.damage *= zmod;
	e.aiprop.aiparams.aiextrastring = typeobj.aiextrastring; //could be used like a CSV or xml for special ai info like movement speed
	
	if (e.aiprop.isAI){						
		var aicont = new Object();
		aicont.entity = e;
		AIArray.push(aicont);
	}	
	
	e.dragprop = new Object();
	e.dragprop.is_dragging = false;
	e.dragprop.is_draggable = typeobj.is_draggable;
	e.dragprop.drag_x=0;
	e.dragprop.drag_y=0;
	e.dragprop.drag_z=0;
	
	e.pos = new Object();
	e.pos.x_last = x;
	e.pos.y_last = y;
	e.pos.z_last = z;
	e.pos.x=x;
	e.pos.y=y;
	e.pos.z=z;
	
	return e;
}
function getEntityTypeByNameWorld(name,world)
{
	for (var i=0; i<world.entityTypeArray.length; i++)
	{	
		if (world.entityTypeArray[i].typename == name)
			return world.entityTypeArray[i];
	}
	return null;
}
function getEntityTypeByName(name)
{
	for (var i=0; i<world.entityTypeSearchArray.length; i++)
	{	
		if (world.entityTypeSearchArray[i].typename == name)
			return world.entityTypeSearchArray[i];
	}
	return null;
}
function increaseLastEntityTypeOdds(amt, entityTypeArray)
{
	for (var i=0; i<amt; i++)
		entityTypeArray.push(entityTypeArray[entityTypeArray.length-1]);
}
function createEntityType(character, color_pair, typename, does_block, is_draggable, hitpoints, 
							hitpoints_variance, destroyable, constructtype, constructratio, combinewithtype, combineresulttype, combineratio,
							isitem, itemdamage, itemdamage_variance, healamount, healamount_variance, 
							isAI, ismonster, isanimal, istrainable, trainratio, aifuncname,
							aidamage, aidropitem, aidropratio, aiextrastring,ismoddable,zrestrict,disableworldgencreate)
{
	var o = new Object();
	
	o.typename = typename;
	o.does_block = does_block;
	o.is_draggable = is_draggable;
	o.hitpoints = hitpoints;
	o.hitpoints_variance = hitpoints_variance;
	o.destroyable = destroyable;
	o.constructtype=constructtype;
	o.constructratio=constructratio;
	
	o.zrestrict = zrestrict;
	o.ismoddable = ismoddable;
	o.disableworldgencreate = disableworldgencreate;
	
	o.isitem = isitem;
	o.itemdamage = itemdamage;
	o.itemdamage_variance = itemdamage_variance;
	o.healamount = healamount;
	o.healamount_variance = healamount_variance;
	o.combinewithtype=combinewithtype;
	o.combineresulttype=combineresulttype;
	o.combineratio=combineratio;
	
	o.isAI = isAI;
	o.ismonster = ismonster;
	o.isanimal = isanimal;
	o.istrainable = istrainable;
	o.trainratio = trainratio;
	o.aifuncname = aifuncname;
	o.aidropitem = aidropitem;
	o.aidropratio = aidropratio;
	o.aidamage = aidamage;
	o.aiextrastring = aiextrastring;
	
	o.character = character;	//null will be assigned randomly
	o.color_pair = color_pair; //null will be assigned randomly
	
	if (usefixedentitychars)
		load_sprite(spriteIndex, spritefolder+"/"+typename+".bmp");
	o.spriteIndex = spriteIndex;
	spriteIndex++;
	
	return o;
}

function bulldozePlayerPath(world)
{
	var ttype = world.tileTypeArray[0];
	var y = world.player.entity.pos.y;
	var z = world.player.entity.pos.z;
	for (var x=world.player.entity.pos.x+1; x<world.width; x++)
	{
		if (world.tile[z][y][x].does_block)
			applyTypeToTile(world,world.tile[z][y][x], ttype,z,y,x);			
		else 
			return; 
	}
}

/* worldCreator function - generates the world */   //NOTE: DO NOT USE % AS A CHAR
function worldCreator(world, tilealgo, entityalgo, usefixedentitychars)     
{	
	printDebug("world creator start");
	
	var playercharacter="@";
	
	//load in tile type specs/ranges, entity specs/ranges
	var tileTypeArray = new Array(); 
	var entityTypeArray = new Array(); 
	var AIArray = new Array();
	var eventFuncArray = new Array();
	
	world.tileTypeArray = tileTypeArray;
	world.entityTypeArray = entityTypeArray;
	world.tileTypeSearchArray = new Array();
	world.entityTypeSearchArray = new Array();
	world.eventFuncArray = eventFuncArray;
	world.entityModArray = new Array();
	world.AIArray = AIArray;
	world.baseTileArray = new Array();
	world.eventLogArray = new Array();
	
	//create AStar collision map
	world.collisionMap = new Array();
	for (var z =0; z<world.zdepth; z++) {
		world.collisionMap[z] = new Array();
		for(var i = 0;i < world.height;i++) {
			world.collisionMap[z][i] = new Array();
			for(var j = 0;j < world.width;j++) {
				world.collisionMap[z][i][j] = 0;
			}
		}
	}
	
	world.lastEventTickMs = getmstime();
	world.nextEventTickMs = Math.floor(Math.random()*1200000)+600000;
	
	world.lastFarmTickMs = getmstime();
	world.nextFarmTickMs = Math.floor(Math.random()*300000)+900000;
	
	printDebug("start evals");
	
	//The first tile type created in here is used as the default 'ground', 
	//and also sets the tile size in tiled graphics mode	
	eval(stringFromFile('game/settings/tiles.js')); //var tileTypeArray - 
	eval(stringFromFile('game/settings/entities.js')); //var entityTypeArray
	if (usefixedentitychars)
		eval(stringFromFile('game/settings/entityfixed.js'));
	eval(stringFromFile('game/settings/events.js')); //var eventFuncArray
	eval(stringFromFile('game/settings/entitymods.js'));//entityModArray	
	
	for (var i=0; i<tileTypeArray.length; i++)
		if (world.tileTypeSearchArray.length==0 || tileTypeArray[i]!=world.tileTypeSearchArray[0])
			world.tileTypeSearchArray.unshift(tileTypeArray[i]);
		
	for (var i=0; i<entityTypeArray.length; i++)
		if (world.entityTypeSearchArray.length==0 || entityTypeArray[i]!=world.entityTypeSearchArray[0])
			world.entityTypeSearchArray.unshift(entityTypeArray[i]);
			
	//assign weapon drops to ai without droptypes
	for (var i=0; i<world.entityTypeSearchArray.length; i++) {
		if (world.entityTypeSearchArray[i].isitem && world.entityTypeSearchArray[i].itemdamage>0){
			for (var k=0; k<world.entityTypeSearchArray.length; k++) {
				if (world.entityTypeSearchArray[k].ismonster && world.entityTypeSearchArray[k].isAI && world.entityTypeSearchArray[k].aidropitem==""){
					world.entityTypeSearchArray[k].aidropitem = world.entityTypeSearchArray[i].typename;
					break;
				}
			}
		}
	}
	for (var k=0; k<world.entityTypeSearchArray.length; k++) {
		if (world.entityTypeSearchArray[k].ismonster && world.entityTypeSearchArray[k].isAI && world.entityTypeSearchArray[k].aidropitem==""){
			for (var i=k; i<world.entityTypeSearchArray.length; i++) {
				if (world.entityTypeSearchArray[i].isitem && world.entityTypeSearchArray[i].itemdamage>0){
					world.entityTypeSearchArray[k].aidropitem = world.entityTypeSearchArray[i].typename;
				}
			}
		}
	}

	printDebug("evals complete");	
	world.baseTileType = createTileType(
	"BASE",			/* typename */
	'+', //String.fromCharCode(249),			/* character */
	false,			/* does_block */
	false,			/* minable */
	false,			/* isfarmland */
	"",				/* minetype */
	0,				/* mineratio */
	false,			/* destroyable */
	true,			/* canbebase */
	0,				/* damage_to_deal */
	999				/* hitpoints */	
	);
	
	//assign chars to entity types
	printDebug("assign chars to entity types");
	
	var entitychars="[,\,],^,_,";
	for (var c=97; c<254; c++){
		var ok = true;
		
		for (var ti=0; ti<world.tileTypeSearchArray.length; ti++)
			if (String.fromCharCode(c)==world.tileTypeSearchArray[ti].character || c==127) //127=DEL, so dont show
				ok=false;
		
		if (ok)
			entitychars += String.fromCharCode(c)+",";
	}
	entitychars += String.fromCharCode(254);
		
	var entitycharArray = entitychars.split(",");
	entitycharArray = arrayShuffle(entitycharArray);	
	for (var i=0; i< entityTypeArray.length; i++) {
		if (entityTypeArray[i].character==null)
			entityTypeArray[i].character = entitycharArray[i % entitycharArray.length];			
		if (entityTypeArray[i].color_pair==null)
			entityTypeArray[i].color_pair = Math.floor(Math.random()*13)+1; //1-13 (14==player)
	}	
	printDebug("assign chars complete");
	
	//create empty entity Array
	world.entity = new Array();
	for (var z =0; z< world.zdepth; z++)
	{
		world.entity[z] = new Array();
		for (var y =0; y< world.height; y++)
		{
			world.entity[z][y] = new Array();
			for (var x =0; x< world.width; x++)
			{
				world.entity[z][y][x] = null;
			}
		}
	}
	
	//create tile arrays 
	printDebug("create tile arrays");	
	world.tile = new Array();
	for (var z =0; z< world.zdepth; z++)
	{
		world.tile[z] = new Array();
		for (var y =0; y< world.height; y++)
		{
			world.tile[z][y] = new Array();
			for (var x =0; x< world.width; x++)
			{
				world.tile[z][y][x]=new Object();								
				applyTypeToTile(world,world.tile[z][y][x], world.tileTypeArray[0],z,y,x);
				
			}
		}
	}	
	eval(tilealgo+"(world);");			
	printDebug("tile arrays complete");
	
	//create entities
	printDebug("create entity arrays");		
	eval(entityalgo+"(world);");	
	printDebug("entity arrays complete");
	
	
	//create player entity
	world.player = new Object();
	world.player.damage = 2;
	world.player.weaponentity = null;
	world.player.dir = 0; //0=up, 1=down, 2=left, 3=right
	world.player.isdefending = false;
	
	world.player.stats = new Object();
	world.player.stats.monsters_killed = 0;
	world.player.stats.animals_killed = 0;
	world.player.stats.animals_trained = 0;
	world.player.stats.monsters_trained = 0;
	world.player.stats.objects_constructed = 0;
	world.player.stats.distance_travelled = 0;
	world.player.stats.weapons_used = 0; //and items
	world.player.stats.objects_destroyed = 0;
	world.player.stats.resources_mined = 0;
	world.player.stats.objects_dragged = 0;
	world.player.stats.game_ticks = 0;
	world.player.stats.base_size = 0;
	world.player.stats.stairs_climbed = 0;
	world.player.stats.damage_defended = 0;	
	world.player.stats.damage_dealt =0;
	world.player.stats.damage_taken = 0;
	world.player.stats.deaths = 0;
	world.player.stats.farmlands = 0;
	world.player.stats.mosthp = 0;
	
	
	var z=0;
	var y=Math.floor(world.height/2);
	var x=Math.floor(world.width/2);
	
	playerType = createEntityType(
		playercharacter,/* character */
		14,				/* color_pair */
		"PLAYER",		/* typename */
		true,			/* does_block */
		true,			/* is_draggable */
		65 - (5*world.zdepth),				/* hitpoints */
		0,				/* hitpoints_variance */
		false,			/* destroyable */
		"",				/* constructtype */
		0,				/* constructratio (decimal 0.0-1.0, chance of success) */
		"",				/* combinewithtype */
		"",				/* combineresulttype */
		0,				/* combineratio */
		false,			/* isitem */
		0,				/* itemdamage */
		0,				/* itemdamage_variance */
		0,				/* healamount */
		0,				/* healamount_variance */
		false,			/* isAI */
		false,			/* ismonster */
		false,			/* isanimal */
		false,			/* istrainable */
		0,				/* trainratio */
		"",				/* aifuncname */
		false,			/* ismoddable */
		true			/* disableworldgencreate */
	);	
	
	world.entity[z][y][x] = createEntityFromType(playerType,z,y,x,world);
	world.player.entity = world.entity[z][y][x];
	world.player.viewradius = 11;
	
	bulldozePlayerPath(world);
	
	world.bookmarks = new Array();
	for (var i=0; i<10; i++) {
		world.bookmarks[i] = new Object;
		world.bookmarks[i].z = world.player.entity.pos.z;
		world.bookmarks[i].y = world.player.entity.pos.y;
		world.bookmarks[i].x = world.player.entity.pos.x;
	}
		
	//update the collision map
	updateCollisionMap(world);
	
	//add fog of war
    for (var z =0; z< world.zdepth; z++)
		for (var y =0; y< world.height; y++)
			for (var x =0; x< world.width; x++)
				world.tile[z][y][x].hasFogOfWar = true;
	
	revealFogAt(world, world.player.entity.pos.z, world.player.entity.pos.y, world.player.entity.pos.x, world.player.viewradius);
	
	//wait for any key
	clearBuffer();
	printxy(5,10,"WORLD IS READY. PRESS ANY KEY TO BEGIN");
	refresh_screen();
	waitForAnyKey();
}	

function updateCollisionMapPos(world, z,y,x)
{
	world.collisionMap[z][y][x] = (world.tile[z][y][x].does_block) ? 1 : 0;
}

function updateCollisionMap(world)
{
	for (var z =0; z<world.zdepth-1; z++) {	
		for(i = 0;i < world.height-1;i++) {	
			for(j = 0;j < world.width-1;j++) {
				world.collisionMap[z][i][j] = (world.tile[z][i][j].does_block) ? 1 : 0;
			}
		}
	}
}

function reloadWorldSprites(world)
{
	for (var i=0; i< world.tileTypeSearchArray.length; i++)
	{
		load_sprite(world.tileTypeSearchArray[i].spriteIndex, spritefolder+"/"+world.tileTypeSearchArray[i].typename+".bmp");
	}
	
	for (var i=0; i< world.entityTypeSearchArray.length; i++)
	{
		load_sprite(world.entityTypeSearchArray[i].spriteIndex, spritefolder+"/"+world.entityTypeSearchArray[i].typename+".bmp");
	}
	
	load_sprite(world.player.entity.spriteIndex, spritefolder+"/"+world.player.entity.typename+".bmp");
	load_sprite(world.baseTileType.spriteIndex, spritefolder+"/"+world.baseTileType.typename+".bmp");
}

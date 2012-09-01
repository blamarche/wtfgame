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

//CREATE TILE TYPES HERE. 
//TO INCREASE ODDS OF ONE TYPE OVER ANOTHER, increaseLastTileTypeOdds(5, tileTypeArray)
//function createTileType(typename, character, does_block, minable, minetype, mineratio, destroyable, canbebase, damage_to_deal, hitpoints)
//minetype == an entity typename

//NOTE: First entry is the default tile for the whole world

//*******************************************
tileTypeArray.push(createTileType(
	"DIRTGROUND",	/* typename */
	".",			/* character */
	false,			/* does_block */
	false,			/* minable */
	false, 			/* isfarmland */
	"",				/* minetype */
	0,				/* mineratio */
	false,			/* destroyable */
	true,			/* canbebase */
	0,				/* damage_to_deal */
	999				/* hitpoints */	
));
increaseLastTileTypeOdds(4000, tileTypeArray);

//*******************************************
tileTypeArray.push(createTileType(
	"FARMLAND",		/* typename */
	'*',			/* character */
	false,			/* does_block */
	false,			/* minable */
	true, 			/* isfarmland */
	"",				/* minetype - for farmland, this is what grows*/
	0,				/* mineratio - for farmland, this controls the chance somethng will grow every X minutes*/
	true,			/* destroyable */
	true,			/* canbebase */
	0,				/* damage_to_deal */
	10				/* hitpoints */	
));
increaseLastTileTypeOdds(0, tileTypeArray);

//*******************************************
tileTypeArray.push(createTileType(
	"GRASSGROUND",	/* typename */
	'`',			/* character */
	false,			/* does_block */
	false,			/* minable */	
	false, 			/* isfarmland */
	"",				/* minetype */
	0,				/* mineratio */
	false,			/* destroyable */
	true,			/* canbebase */
	0,				/* damage_to_deal */
	999				/* hitpoints */	
));
increaseLastTileTypeOdds(300, tileTypeArray);

//*******************************************
tileTypeArray.push(createTileType(
	"WATER",	/* typename */
	'~',			/* character */
	true,			/* does_block */
	true,			/* minable */
	false, 			/* isfarmland */
	"DIRTGROUND",	/* minetype */
	0,				/* mineratio */
	false,			/* destroyable */
	false,			/* canbebase */
	0,				/* damage_to_deal */
	150				/* hitpoints */	
));
increaseLastTileTypeOdds(300, tileTypeArray);

//*******************************************
tileTypeArray.push(createTileType(
	"ROCKWALL",		/* typename */
	String.fromCharCode(177),			/* character */
	true,			/* does_block */
	true,			/* minable */
	false, 			/* isfarmland */
	"ROCK",			/* minetype - entity typename */
	0.65,			/* mineratio */
	true,			/* destroyable */
	false,			/* canbebase */
	0,				/* damage_to_deal */
	50				/* hitpoints */	
));
increaseLastTileTypeOdds(600, tileTypeArray);

//*******************************************
tileTypeArray.push(createTileType(
	"TREE",			/* typename */
	String.fromCharCode(226),			/* character */
	true,			/* does_block */
	true,			/* minable */
	false, 			/* isfarmland */
	"WOOD",			/* minetype - entity typename */
	0.85,			/* mineratio */
	true,			/* destroyable */
	false,			/* canbebase */
	0,				/* damage_to_deal */
	20				/* hitpoints */	
));
increaseLastTileTypeOdds(600, tileTypeArray);

//*******************************************
tileTypeArray.push(createTileType(
	"BUSH",			/* typename */
	String.fromCharCode(231),	/* character */
	true,			/* does_block */
	true,			/* minable */
	false, 			/* isfarmland */
	"FRUIT",			/* minetype - entity typename */
	0.77,			/* mineratio */
	true,			/* destroyable */
	false,			/* canbebase */
	0,				/* damage_to_deal */
	10				/* hitpoints */	
));
increaseLastTileTypeOdds(150, tileTypeArray);

//*******************************************
tileTypeArray.push(createTileType(
	"DIRTWALL",		/* typename */
	String.fromCharCode(176),			/* character */
	true,			/* does_block */
	true,			/* minable */
	false, 			/* isfarmland */
	"CLAY",			/* minetype */
	0.95,			/* mineratio */
	true,			/* destroyable */
	false,			/* canbebase */
	0,				/* damage_to_deal */
	10				/* hitpoints */	
));
increaseLastTileTypeOdds(300, tileTypeArray);

//*******************************************
tileTypeArray.push(createTileType(
	"PERMWALL",		/* typename */
	String.fromCharCode(219),			/* character */
	true,			/* does_block */
	false,			/* minable */
	false, 			/* isfarmland */
	"",				/* minetype */
	0,				/* mineratio */
	true,			/* destroyable */
	false,			/* canbebase */
	0,				/* damage_to_deal */
	9999				/* hitpoints */	
));
increaseLastTileTypeOdds(600, tileTypeArray);

//*******************************************
tileTypeArray.push(createTileType(
	"SPIKES",		/* typename */
	"v",			/* character */
	false,			/* does_block */
	false,			/* minable */
	false, 			/* isfarmland */
	"",				/* minetype */
	0,				/* mineratio */
	true,			/* destroyable */
	false,			/* canbebase */
	1,				/* damage_to_deal */
	10				/* hitpoints */	
));
increaseLastTileTypeOdds(15, tileTypeArray);

//*******************************************
tileTypeArray.push(createTileType(
	"LAVA",			/* typename */
	String.fromCharCode(240),			/* character */
	false,			/* does_block */
	true,			/* minable */
	false, 			/* isfarmland */
	"ORE",			/* minetype */
	0.45,			/* mineratio */
	false,			/* destroyable */
	false,			/* canbebase */
	2,				/* damage_to_deal */
	100				/* hitpoints */	
));
increaseLastTileTypeOdds(15, tileTypeArray);

//*******************************************
tileTypeArray.push(createTileType(
	"FENCE",		/* typename */
	String.fromCharCode(215),			/* character */
	true,			/* does_block */
	false,			/* minable */
	false, 			/* isfarmland */
	"",				/* minetype */
	0,				/* mineratio */
	true,			/* destroyable */
	false,			/* canbebase */
	0,				/* damage_to_deal */
	20				/* hitpoints */	
));
increaseLastTileTypeOdds(0, tileTypeArray);

//*******************************************
tileTypeArray.push(createTileType(
	"STAIRS_UP",	/* typename */
	String.fromCharCode(245),			/* character */
	false,			/* does_block */
	false,			/* minable */
	false, 			/* isfarmland */
	"",				/* minetype */
	0,				/* mineratio */
	false,			/* destroyable */
	false,			/* canbebase */
	0,				/* damage_to_deal */
	20				/* hitpoints */	
));
increaseLastTileTypeOdds(0, tileTypeArray);

//*******************************************
tileTypeArray.push(createTileType(
	"STAIRS_DOWN",	/* typename */
	String.fromCharCode(244),			/* character */
	false,			/* does_block */
	false,			/* minable */
	false, 			/* isfarmland */
	"",				/* minetype */
	0,				/* mineratio */
	false,			/* destroyable */
	false,			/* canbebase */
	0,				/* damage_to_deal */
	20				/* hitpoints */	
));
increaseLastTileTypeOdds(0, tileTypeArray);

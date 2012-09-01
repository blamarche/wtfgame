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

//CREATE ENTITY TYPES HERE. 
//TO INCREASE ODDS OF ONE TYPE OVER ANOTHER, increaseLastEntityTypeOdds(5)  

/*
*	RESITRICTIONS & RULES
*	- AI should not be draggable - Bug causes replication
*   - All entities must block, or they can be over-written when player/ai moves over them
*   - `aiextrastring` is a string that can be used by aifuncname to have extra info passed in
*     such as movement or attack speed, vision distance, shop items, etc.
*/

eval(stringFromFile('game/settings/entitiesmore.js'));


//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"EVIL CERTIFICATE",	/* typename */
	true,			/* does_block */
	true,			/* is_draggable */
	1,				/* hitpoints */
	0,				/* hitpoints_variance */
	false,			/* destroyable */
	"",				/* constructtype */
	0,				/* constructratio (decimal 0.0-1.0, chance of success) */
	"",				/* combinewithtype */
	"",				/* combineresulttype */
	0,				/* combineratio */
	true,			/* isitem */
	0,				/* itemdamage */
	0,				/* itemdamage_variance */
	-10,			/* healamount */
	0,				/* healamount_variance */
	false,			/* isAI */
	false,			/* ismonster */
	false,			/* isanimal */
	false,			/* istrainable */
	0,				/* trainratio */
	"",				/* aifuncname */
	0,				/* aidamage */
	"",				/* aidropitem */
	0,				/* aidropratio */
	"",				/* aiextrastring */
	true,			/* ismoddable */
	null,			/* zrestrict */
	true			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(10, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"SINGING SWORD",/* TYPENAME */
	true,			/* does_block */
	false,			/* is_draggable */
	100,				/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
	"",				/* constructtype */
	0,				/* constructratio (decimal 0.0-1.0, chance of success) */
	"",				/* combinewithtype */
	"",				/* combineresulttype */
	0,				/* combineratio */
	true,			/* isitem */
	5,				/* itemdamage */
	5,				/* itemdamage_variance */
	0,				/* healamount */
	0,				/* healamount_variance */
	true,			/* isAI */
	false,			/* ismonster */
	true,			/* isanimal */
	false,			/* istrainable */
	0,				/* trainratio */
	"aifunc_random",/* aifuncname */
	10,				/* aidamage */
	"EVIL CERTIFICATE",	/* AIDROPITEM */
	0.8,				/* aidropratio */
	"",				/* aiextrastring */
	true,			/* ismoddable */
	null,			/* zrestrict */
	false			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(10, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"LONG SWORD",	/* TYPENAME */
	true,			/* does_block */
	true,			/* is_draggable */
	100,				/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
	"",				/* constructtype */
	0,				/* constructratio (decimal 0.0-1.0, chance of success) */
	"",				/* combinewithtype */
	"",				/* combineresulttype */
	0,				/* combineratio */
	true,			/* isitem */
	7,				/* itemdamage */
	2,				/* itemdamage_variance */
	-2,				/* healamount */
	0,				/* healamount_variance */
	false,			/* isAI */
	false,			/* ismonster */
	false,			/* isanimal */
	false,			/* istrainable */
	0,				/* trainratio */
	"",				/* aifuncname */
	0,				/* aidamage */
	"",				/* aidropitem */
	0,				/* aidropratio */
	"",				/* aiextrastring */
	true,			/* ismoddable */
	null,			/* zrestrict */
	false			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(40, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"ORE",			/* TYPENAME */
	true,			/* does_block */
	true,			/* is_draggable */
	3,				/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
	"SPIKES",	/* CONSTRUCTTYPE */
	0.95,			/* constructratio (decimal 0.0-1.0, chance of success) */
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
	0,				/* aidamage */
	"",				/* aidropitem */
	0,				/* aidropratio */
	"",				/* aiextrastring */
	true,			/* ismoddable */
	null,			/* zrestrict */
	false			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(20, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"ROCK",			/* TYPENAME */
	true,			/* does_block */
	true,			/* is_draggable */
	2,				/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
	"ROCKWALL",		/* CONSTRUCTTYPE */
	0.45,			/* constructratio (decimal 0.0-1.0, chance of success) */
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
	0,				/* aidamage */
	"",				/* aidropitem */
	0,				/* aidropratio */
	"",				/* aiextrastring */
	false,			/* ismoddable */
	null,			/* zrestrict */
	true			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(80, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"CLAY",			/* typename */
	true,			/* does_block */
	true,			/* is_draggable */
	1,				/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
	"DIRTWALL",		/* CONSTRUCTTYPE */
	0.95,			/* constructratio (decimal 0.0-1.0, chance of success) */
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
	0,				/* aidamage */
	"",				/* aidropitem */
	0,				/* aidropratio */
	"",				/* aiextrastring */
	false,			/* ismoddable */
	null,			/* zrestrict */
	true			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(80, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"WOOD",			/* typename */
	true,			/* does_block */
	true,			/* is_draggable */
	1,				/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
	"FENCE",		/* CONSTRUCTTYPE */
	0.85,			/* constructratio (decimal 0.0-1.0, chance of success) */
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
	0,				/* aidamage */
	"",				/* aidropitem */
	0,				/* aidropratio */
	"",				/* aiextrastring */
	false,			/* ismoddable */
	null,			/* zrestrict */
	true			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(80, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"NECROMANCER",	/* typename */
	true,			/* does_block */
	false,			/* is_draggable */
	8,				/* hitpoints */
	7,				/* hitpoints_variance */
	true,			/* destroyable */
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
	true,			/* isAI */
	true,			/* ismonster */
	false,			/* isanimal */
	false,			/* istrainable */
	0,				/* trainratio */
	"aifunc_random",/* aifuncname */
	4,				/* aidamage */
	"UNDEAD SKELETON",	/* AIDROPITEM */
	0.5,				/* aidropratio */
	"",				/* aiextrastring */
	true,			/* ismoddable */
	null,			/* zrestrict */
	false			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(15, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"ORC",			/* typename */
	true,			/* does_block */
	false,			/* is_draggable */
	15,				/* hitpoints */
	3,				/* hitpoints_variance */
	true,			/* destroyable */
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
	true,			/* isAI */
	true,			/* ismonster */
	false,			/* isanimal */
	false,			/* istrainable */
	0,				/* trainratio */
	"aifunc_random",/* aifuncname */
	5,				/* aidamage */
	"",	/* AIDROPITEM */
	0.6,			/* aidropratio */
	"",				/* aiextrastring */
	true,			/* ismoddable */
	null,			/* zrestrict */
	false			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(15, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"SKELETAL REMAINS",		/* typename */
	true,			/* does_block */
	true,			/* is_draggable */
	1,				/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
	"UNDEAD SKELETON",			/* constructtype */
	0.6,			/* constructratio (decimal 0.0-1.0, chance of success) */
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
	0,				/* aidamage */
	"",				/* aidropitem */
	0,				/* aidropratio */
	"",				/* aiextrastring */
	false,			/* ismoddable */
	null,			/* zrestrict */
	false			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(20, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"UNDEAD SKELETON",	/* TYPENAME */
	true,			/* does_block */
	false,			/* is_draggable */
	3,				/* hitpoints */
	4,				/* hitpoints_variance */
	true,			/* destroyable */
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
	true,			/* isAI */
	false,			/* ismonster */
	true,			/* isanimal */
	false,			/* istrainable */
	0,				/* trainratio */
	"aifunc_random",/* aifuncname */
	1,				/* aidamage */
	"",				/* aidropitem */
	0,				/* aidropratio */
	"",				/* aiextrastring */
	true,			/* ismoddable */
	null,			/* zrestrict */
	true			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(10, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"WOLF",			/* typename */
	true,			/* does_block */
	false,			/* is_draggable */
	4,				/* hitpoints */
	2,				/* hitpoints_variance */
	true,			/* destroyable */
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
	true,			/* isAI */
	true,			/* ismonster */
	false,			/* isanimal */
	true,			/* istrainable */
	0.05,			/* trainratio */
	"aifunc_random",/* aifuncname */
	2,				/* aidamage */
	"WOLF TOOTH",	/* AIDROPITEM */
	0.5,				/* aidropratio */
	"",				/* aiextrastring */
	true,			/* ismoddable */
	null,			/* zrestrict */
	false			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(80, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"WOLF TOOTH",	/* TYPENAME */
	true,			/* does_block */
	true,			/* is_draggable */
	50,				/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
	"",				/* constructtype */
	0,				/* constructratio (decimal 0.0-1.0, chance of success) */
	"",				/* combinewithtype */
	"",				/* combineresulttype */
	0,				/* combineratio */
	true,			/* isitem */
	3,				/* itemdamage */
	0,				/* itemdamage_variance */
	0,				/* healamount */
	0,				/* healamount_variance */
	false,			/* isAI */
	false,			/* ismonster */
	false,			/* isanimal */
	false,			/* istrainable */
	0,				/* trainratio */
	"",				/* aifuncname */
	0,				/* aidamage */
	"",				/* aidropitem */
	0,				/* aidropratio */
	"",				/* aiextrastring */
	true,			/* ismoddable */
	null,			/* zrestrict */
	true			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(20, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"FRUIT",		/* typename */
	true,			/* does_block */
	true,			/* is_draggable */
	3,				/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
	"FARMLAND",				/* constructtype */
	0.6,				/* constructratio (decimal 0.0-1.0, chance of success) */
	"",				/* combinewithtype */
	"",				/* combineresulttype */
	0,				/* combineratio */
	true,			/* isitem */
	0,				/* itemdamage */
	0,				/* itemdamage_variance */
	1,				/* healamount */
	1,				/* healamount_variance */
	false,			/* isAI */
	false,			/* ismonster */
	false,			/* isanimal */
	false,			/* istrainable */
	0,				/* trainratio */
	"",				/* aifuncname */
	0,				/* aidamage */
	"",				/* aidropitem */
	0,				/* aidropratio */
	"",				/* aiextrastring */
	false,			/* ismoddable */
	null,			/* zrestrict */
	true			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(10, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"NUT",			/* typename */
	true,			/* does_block */
	true,			/* is_draggable */
	1,				/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
	"",				/* constructtype */
	0,				/* constructratio (decimal 0.0-1.0, chance of success) */
	"",				/* combinewithtype */
	"",				/* combineresulttype */
	0,				/* combineratio */
	true,			/* isitem */
	0,				/* itemdamage */
	0,				/* itemdamage_variance */
	1,				/* healamount */
	0,				/* healamount_variance */
	false,			/* isAI */
	false,			/* ismonster */
	false,			/* isanimal */
	false,			/* istrainable */
	0,				/* trainratio */
	"",				/* aifuncname */
	0,				/* aidamage */
	"",				/* aidropitem */
	0,				/* aidropratio */
	"",				/* aiextrastring */
	true,			/* ismoddable */
	null,			/* zrestrict */
	true			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(10, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"ACORN",		/* typename */
	true,			/* does_block */
	true,			/* is_draggable */
	1,				/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
	"NUT",			/* constructtype */
	0.9,			/* constructratio (decimal 0.0-1.0, chance of success) */
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
	0,				/* aidamage */
	"",				/* aidropitem */
	0,				/* aidropratio */
	"",				/* aiextrastring */
	false,			/* ismoddable */
	null,			/* zrestrict */
	false			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(20, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"SQUIRREL",		/* typename */
	true,			/* does_block */
	false,			/* is_draggable */
	1,				/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
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
	true,			/* isAI */
	false,			/* ismonster */
	true,			/* isanimal */
	true,			/* istrainable */
	0.85,			/* trainratio */
	"aifunc_random",/* aifuncname */
	2,				/* aidamage */
	"ACORN",			/* aidropitem */
	0.5,				/* aidropratio */
	"",				/* aiextrastring */
	false,			/* ismoddable */
	null,			/* zrestrict */
	false			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(500, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"SHORT SWORD",	/* TYPENAME */
	true,			/* does_block */
	true,			/* is_draggable */
	50,				/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
	"",				/* constructtype */
	0,				/* constructratio (decimal 0.0-1.0, chance of success) */
	"",				/* combinewithtype */
	"",				/* combineresulttype */
	0,				/* combineratio */
	true,			/* isitem */
	3,				/* itemdamage */
	1,				/* itemdamage_variance */
	0,				/* healamount */
	0,				/* healamount_variance */
	false,			/* isAI */
	false,			/* ismonster */
	false,			/* isanimal */
	false,			/* istrainable */
	0,				/* trainratio */
	"",				/* aifuncname */
	0,				/* aidamage */
	"",				/* aidropitem */
	0,				/* aidropratio */
	"",				/* aiextrastring */
	true,			/* ismoddable */
	null,			/* zrestrict */
	false			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(20, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	String.fromCharCode(239),			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"TRADER",		/* typename */
	true,			/* does_block */
	false,			/* is_draggable */
	999,			/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
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
	true,			/* isAI */
	false,			/* ismonster */
	true,			/* isanimal */
	false,			/* istrainable */
	0.0,			/* trainratio */
	"aifunc_trader",/* aifuncname */
	0,				/* aidamage */
	"RECEIPT",		/* aidropitem */
	0.9,			/* aidropratio */
	"",				/* aiextrastring */
	false,			/* ismoddable */
	null,			/* zrestrict */
	false			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(100, entityTypeArray);

//*******************************************
entityTypeArray.push(createEntityType(
	null,			/* character (null for random) */
	null,			/* color_pair (null for random) */
	"RECEIPT",		/* TYPENAME */
	true,			/* does_block */
	true,			/* is_draggable */
	1,				/* hitpoints */
	0,				/* hitpoints_variance */
	true,			/* destroyable */
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
	0,				/* aidamage */
	"",				/* aidropitem */
	0,				/* aidropratio */
	"",				/* aiextrastring */
	false,			/* ismoddable */
	null,			/* zrestrict */
	true			/* disableworldgencreate */
));
increaseLastEntityTypeOdds(0, entityTypeArray);
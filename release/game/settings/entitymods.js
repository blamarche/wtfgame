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
	Adds modifier types for entities
*/

var modifiers = world.entityModArray;

//***************************************
var modi = 0;
modifiers[modi] = [];
modifiers[modi].descriptor = "STRONG ";
modifiers[modi].hitpoints_mod = 1.5;
modifiers[modi].constructratio_mod = 1.0;
modifiers[modi].itemdamage_mod = 1.5;
modifiers[modi].healamount_mod = 1.5;
modifiers[modi].trainratio_mod = 0.5;
modifiers[modi].aidamage_mod = 1.5;
modifiers[modi].aidropratio_mod = 1.25;

//***************************************
modi=1;
modifiers[modi] = [];
modifiers[modi].descriptor = "WEAK ";
modifiers[modi].hitpoints_mod = 0.75;
modifiers[modi].constructratio_mod = 1.0;
modifiers[modi].itemdamage_mod = 0.75;
modifiers[modi].healamount_mod = 0.75;
modifiers[modi].trainratio_mod = 1.5;
modifiers[modi].aidamage_mod = 0.75;
modifiers[modi].aidropratio_mod = 0.75;

//***************************************
modi=2
modifiers[modi] = [];
modifiers[modi].descriptor = "PATHETIC ";
modifiers[modi].hitpoints_mod = 0.5;
modifiers[modi].constructratio_mod = 1.0;
modifiers[modi].itemdamage_mod = 0.5;
modifiers[modi].healamount_mod = 0.5;
modifiers[modi].trainratio_mod = 1.5;
modifiers[modi].aidamage_mod = 0.5;
modifiers[modi].aidropratio_mod = 0.5;

//***************************************
modi=3
modifiers[modi] = [];
modifiers[modi].descriptor = "AWESOME ";
modifiers[modi].hitpoints_mod = 2;
modifiers[modi].constructratio_mod = 1.0;
modifiers[modi].itemdamage_mod = 2;
modifiers[modi].healamount_mod = 2;
modifiers[modi].trainratio_mod = 0.25;
modifiers[modi].aidamage_mod = 2;
modifiers[modi].aidropratio_mod = 1.5;



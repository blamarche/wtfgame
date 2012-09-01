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
	Non-standard/random/testing entities go here
	
	hp,hpv,constructratio,itemdamage,itemdamagev,healamount,healamountv;
	trainratio,aidamage,aidropitem,aidropratio;
*/


//config vars
var _hp_per = 2.25;
var _hpv_per = 1.0;
var _cr_per = 0.02;
var _itemdmg_per = 0.5;
var _itemdmgv_per = 0.33;
var _healamt_per = 0.33;
var _healamtv_per = 0.125;
var _tr_per = 0.04;
var _aidmg_per = 1;
var _aidr_per = 0.002;


//do extra generation
var _extraentstring = stringFromFile('game/settings/extraentities.csv');
var _extrarows = _extraentstring.split("\r\n");
if (_extrarows.length <= 1)
	_extrarows = _extraentstring.split("\n");

var _lastlevel = 0;
var _lastlevelcount = 0;
var _lastitemname = "";
	
if (_extrarows.length>1){
	printDebug("Extra count: "+_extrarows.length);
	
	//shuffle
	_extrarows.splice(0,1);
	_extrarows=arrayShuffle(_extrarows);
	_extrarows=arrayShuffle(_extrarows);
	var _rows_per_z = Math.floor(_extrarows.length / world.zdepth);
	
	
	var _maxflrlvl = _rows_per_z / 4;
	if (world.zdepth==1)
		_maxflrlvl = 20;
	
	for (var rowi=0; rowi<_extrarows.length; rowi++){
		var row = _extrarows[rowi].split(",");
		if (row.length >= 15){
			var name=row[0].toUpperCase();
			//var level=row[1];	//doesnt matter since the shuffle above
			var is_moddable=row[2];
			var disableworldgencreate=row[3];
			var is_draggable=row[4];
			var destroyable=row[5];
			var constructtype=row[6].toUpperCase();
			var isitem=row[7];
			var doesdamage=row[8];
			var doesheal=row[9];
			var isai=row[10];
			var ismonster=row[11];
			var aifuncname=row[12];
			var aiextrastring=row[13];
			var combineresulttype=row[14].toUpperCase();
			
			//shuffled, so compute new level
			var zrestrict = Math.floor(rowi / _rows_per_z)+1;
			//printDebug("extras z restrict: "+zrestrict);
			
			//generate other values			
			var hp,hpv,constructratio,itemdamage,itemdamagev,healamount,healamountv;
			var trainratio,aidamage,aidropratio, combinewithtype, combineratio;
			
			if (zrestrict!=_lastlevel){
				_lastlevel=zrestrict;
				_lastlevelcount=0;
			}else{
				
				if (_lastlevelcount<_maxflrlvl)
					_lastlevelcount++;
				else
					_lastlevelcount=0;
			}
			
			zrestrict -= 1
			var simlevel = (zrestrict) * _maxflrlvl + _lastlevelcount;
			if (zrestrict==-1){
				simlevel = Math.floor(Math.random()*5) * _maxflrlvl;			
				zrestrict=null;
			}
			
			hp 		=	Math.floor(_hp_per * simlevel);
			hpv 	=	Math.floor(_hpv_per * simlevel);
			
			constructratio 	=	1.0 - (_cr_per * simlevel);
			combineratio = constructratio;
			if (doesdamage=='1'){
				itemdamage 	=	Math.floor(_itemdmg_per * simlevel);
				itemdamagev 	=	Math.floor(_itemdmgv_per * simlevel);
				if (itemdamage<=0)
					itemdamage=1;
				hp=itemdamage;
				hpv=0;				
			}else {
				itemdamage 	=	0;
				itemdamagev 	=	0;
			}
			
			if (doesheal=='1'){
				healamount 	=	Math.floor(_healamt_per * simlevel);
				healamountv 	=	Math.floor(_healamtv_per * simlevel);
				if (healamount<=0)
					healamount=1;
				hp=healamount;
				hpv=0;
			}else{
				healamount 	=	0;
				healamountv 	=	0;
			}
			
			//weapons have % chance to do damage on equip
			if (doesdamage=='1' && 0.28 > Math.random())
				healamount 	=	Math.floor(_healamt_per * simlevel) * -1;
			
			trainratio 	=	1.0 - (_tr_per * simlevel);
			aidamage 	=	Math.floor(_aidmg_per * simlevel);
			//aidropratio 	=	1.0 - (_aidr_per * simlevel);
			aidropratio = Math.random()*0.75+0.25;
			
			if (isitem=='1'){
				hp = simlevel*5;
				hpv = 0;
				
				//determine combine types				
				if (combineresulttype!="")
					combinewithtype = _lastitemname;
			}
			
			//create ent
			entityTypeArray.push(createEntityType(
				null,				/* character (null for random) */
				null,				/* color_pair (null for random) */
				name,				/* typename */
				true,				/* does_block */
				(is_draggable=='1'),	/* is_draggable */
				hp,					/* hitpoints */
				hpv,				/* hitpoints_variance */
				(destroyable=='1'),	/* destroyable */
				constructtype,		/* constructtype */
				constructratio,		/* constructratio (decimal 0.0-1.0, chance of success) */
				combinewithtype,
				combineresulttype,
				combineratio,
				(isitem=='1'),		/* isitem */
				itemdamage,			/* itemdamage */
				itemdamagev,		/* itemdamage_variance */
				healamount,			/* healamount */
				healamountv,		/* healamount_variance */
				(isai=='1'),		/* isAI */
				(ismonster=='1'),	/* ismonster */
				(ismonster=='0'),	/* isanimal */
				(ismonster=='0'),	/* istrainable */
				trainratio,			/* trainratio */
				aifuncname,			/* aifuncname */
				aidamage,			/* aidamage */
				_lastitemname,			/* aidropitem */
				aidropratio,		/* aidropratio */
				aiextrastring,		/* aiextrastring */
				(is_moddable=='1'),	/* ismoddable */
				zrestrict,			/* zrestrict */
				(disableworldgencreate=='1')	/* disableworldgencreate */
			));
			
			//determine how much to increase entity odds
			var increasechance = _maxflrlvl+1 - _lastlevelcount;
			increasechance *= 10;
			increaseLastEntityTypeOdds(increasechance, entityTypeArray);
			
			
			if (isitem=='1' && Math.random() >= 0.10){
				_lastitemname = name;
				//printDebug("extras last item: "+_lastitemname);
			}
			else 
				_lastitemname = "";
		}
	}
}
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
standard ai funcs 
	relevant globals:
		bottom_mesg
		startTimeMs
		currentTickMs
		lastAITickMs
		timeDiffMs
		AIFreqMs
*/
function aifunc_trader(world, ai)
{
	//assign random message, taketypename, givetypename
	if ( typeof ai.entity.aiprop.aiparams.message == "undefined" )
	{
		ai.entity.aiprop.aiparams.message ="DRAG SOMETHING OVER AND HIT ME UP!";
		ai.entity.aiprop.aiparams.lastinfoms= currentTickMs;
		
		var typeindex = Math.floor(Math.random()*world.entityTypeArray.length);		
		while (!world.entityTypeArray[typeindex].is_draggable)
			typeindex = Math.floor(Math.random()*world.entityTypeArray.length);		
		ai.entity.aiprop.aiparams.taketypename = world.entityTypeArray[typeindex].typename;
		
		typeindex = Math.floor(Math.random()*world.entityTypeArray.length);
		//while (!world.entityTypeArray[typeindex].is_draggable)
		//	typeindex = Math.floor(Math.random()*world.entityTypeArray.length);
		ai.entity.aiprop.aiparams.givetypename = world.entityTypeArray[typeindex].typename;
		
		ai.entity.typename = ai.entity.aiprop.aiparams.taketypename+ " "+ai.entity.typename;
	}
		
	//if wasattacked, then check player dragging and trade, reset wasattacked
	if (ai.entity.aiprop.wasattacked)
	{
		var dragent = getEntityDragEntity(world.player.entity);
		if (dragent!=null && dragent.typename.indexOf(ai.entity.aiprop.aiparams.taketypename)>=0)
		{
			var etype = getEntityTypeByName(ai.entity.aiprop.aiparams.givetypename);
			if (etype!=null){
				set_bottom_mesg( "YOU TRADE: "+ai.entity.aiprop.aiparams.taketypename+", FOR: "+ai.entity.aiprop.aiparams.givetypename);
				world.entity[dragent.pos.z][dragent.pos.y][dragent.pos.x] = createEntityFromType(etype,dragent.pos.z,dragent.pos.y,dragent.pos.x,world);
			}
			else 
				set_bottom_mesg( "HUH? WHAT? I MUST BE SENILE... PLEASE REPORT THIS TO THE DEVELOPERS, I DO NOT HAVE THAT ITEM");
			
			ai.entity.aiprop.wasattacked=false;
		}
		else
		{
			set_bottom_mesg( ai.entity.aiprop.aiparams.message+" I WANT: "+ai.entity.aiprop.aiparams.taketypename+", FOR: "+ai.entity.aiprop.aiparams.givetypename);
			ai.entity.aiprop.wasattacked=false;
		}
		ai.entity.aiprop.aiparams.lastinfoms= currentTickMs;
	}
	else if (currentTickMs - ai.entity.aiprop.aiparams.lastinfoms > 3000)
	{
		//check for player next to trader
		var p = getPlayerDirPos();
		if (p.z==ai.entity.pos.z && p.y==ai.entity.pos.y && p.x==ai.entity.pos.x){
			set_bottom_mesg( ai.entity.aiprop.aiparams.message+" I WANT: "+ai.entity.aiprop.aiparams.taketypename+", FOR: "+ai.entity.aiprop.aiparams.givetypename);
			ai.entity.aiprop.aiparams.lastinfoms= currentTickMs;
		}
	}
}

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
	Base raid/random event system
*/

function worldevent_randombaseraid(world)
{
	if (world.baseTileArray.length>0)
	{
		var base = world.baseTileArray[Math.floor(Math.random()*world.baseTileArray.length)];
		
		var etype = world.entityTypeSearchArray[Math.floor(Math.random()*world.entityTypeSearchArray.length)];
		while ((etype.zrestrict!=null && base.z != etype.zrestrict) || !etype.isAI || !etype.ismonster)
			etype = world.entityTypeSearchArray[Math.floor(Math.random()*world.entityTypeSearchArray.length)];
		
		bottom_mesg = "A "+etype.typename+" GROUP IS RAIDING YOUR BASE AT FLOOR:"+(base.z+1)+", X:"+base.x+", Y:"+base.y;
		
		var num = Math.floor(Math.random()*10)+3;
		for (var i=0; i<num; i++)
		{
			var z=base.z;
			
			var y= Math.min(Math.max(base.y+Math.floor(Math.random()*120)-60, 0), world.height-1);
			var x= Math.min(Math.max(base.x+Math.floor(Math.random()*120)-60, 0), world.width-1);		
			while (world.tile[z][y][x].does_block) {
				y= Math.min(Math.max(base.y+Math.floor(Math.random()*120)-60, 0), world.height-1);
				x= Math.min(Math.max(base.x+Math.floor(Math.random()*120)-60, 0), world.width-1);		
			}
			
			world.entity[z][y][x] = createEntityFromType(etype,z,y,x,world);
			world.entity[z][y][x].aiprop.aiparams.raid=new Object();
			world.entity[z][y][x].aiprop.aiparams.raid.raid_z=base.z;
			world.entity[z][y][x].aiprop.aiparams.raid.raid_y=base.y;
			world.entity[z][y][x].aiprop.aiparams.raid.raid_x=base.x;
			
			world.entity[z][y][x].aiprop.aiparams.raid.start_z=z;
			world.entity[z][y][x].aiprop.aiparams.raid.start_y=y;
			world.entity[z][y][x].aiprop.aiparams.raid.start_x=x;
			
			world.entity[z][y][x].aiprop.aifuncname = "aifunc_randomraid(world, ai);";
		}
	}
}
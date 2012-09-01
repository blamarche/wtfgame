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

include('game/code/worldGenCavern.js');

function makeStairs(world,z)
{
	if (world.zdepth>1)
	{
		//must have stairs		
		if (z<world.zdepth-1){	//stairs_down
			var x = Math.floor(Math.random()*world.width);
			var y = Math.floor(Math.random()*world.height);
			while (world.tile[z][y][x].does_block)
			{
				x = Math.floor(Math.random()*world.width);
				y = Math.floor(Math.random()*world.height);
			}
			world.tile[z][y][x]=new Object();
			var typeobj = getTileTypeByNameWorld("STAIRS_DOWN", world);				
			if (typeobj!=null)
				applyTypeToTile(world,world.tile[z][y][x], typeobj,z,y,x);
				
			if (x<world.width-1){	//stairs back up
				world.tile[z+1][y][x+1]=new Object();
				typeobj = getTileTypeByNameWorld("STAIRS_UP", world);				
				if (typeobj!=null)
					applyTypeToTile(world,world.tile[z+1][y][x+1], typeobj,z+1,y,x+1);
			}
		}
		
		if (z>0) { 	//stairs_up
			var x = Math.floor(Math.random()*world.width);
			var y = Math.floor(Math.random()*world.height);
			while (world.tile[z][y][x].does_block)
			{
				x = Math.floor(Math.random()*world.width);
				y = Math.floor(Math.random()*world.height);
			}
			world.tile[z][y][x]=new Object();
			var typeobj = getTileTypeByNameWorld("STAIRS_UP", world);				
			if (typeobj!=null)
				applyTypeToTile(world,world.tile[z][y][x], typeobj,z,y,x);
				
			if (x<world.width-1){	//stairs back down
				world.tile[z-1][y][x+1]=new Object();
				typeobj = getTileTypeByNameWorld("STAIRS_DOWN", world);				
				if (typeobj!=null)
					applyTypeToTile(world,world.tile[z-1][y][x+1], typeobj,z-1,y,x+1);
			}
		}	
	}
}


/*
*	 Random Tiles and Entities
*/
function worldgen_entity_random(world)
{
	for (var z =0; z< world.zdepth; z++)
	{
		for (var y =0; y< world.height; y++)
		{
			for (var x =0; x< world.width; x++)
			{		
				if (Math.random()*1000.0 > 995.0 && !world.tile[z][y][x].does_block)
				{
					var typeindex = Math.floor(Math.random()*world.entityTypeArray.length);
					var typeobj = world.entityTypeArray[typeindex];
					while ((typeobj.zrestrict!=null && z != typeobj.zrestrict) || typeobj.disableworldgencreate)
					{
						typeindex = Math.floor(Math.random()*world.entityTypeArray.length);
						typeobj = world.entityTypeArray[typeindex];
					}
				
					if (!typeobj.isitem || Math.random()>0.33)
						world.entity[z][y][x] = createEntityFromType(typeobj,z,y,x,world);
				}
			}
		}
	}
}

function worldgen_tile_random(world)
{
	for (var z =0; z< world.zdepth; z++)
	{
		for (var y =0; y< world.height; y++)
		{
			for (var x =0; x< world.width; x++)
			{				
				
				var typeindex = Math.floor(Math.random()*world.tileTypeArray.length);
				var typeobj = world.tileTypeArray[typeindex];
				
				if (typeobj.typename!="STAIRS_UP" && typeobj.typename!="STAIRS_DOWN"){
					world.tile[z][y][x]=new Object();
					applyTypeToTile(world,world.tile[z][y][x], typeobj,z,y,x);
				}
			}
		}
		makeStairs(world,z);
	}
}


/*
*	Randomly places 'shapes' of tiles
*/
function worldgen_tile_randomshape(world, dontstamptypename)
{
	//read files
	var shapearray = new Array();
	var shapetext = "";
	
	for (var i=1; i<9999; i++)
	{
		shapetext = stringFromFile("game/settings/worldshapes/"+i+".txt");
		if (typeof shapetext == "undefined" || shapetext=="")
			break;
			
		var starray = shapetext.split("\n");
		shapearray[i-1]=starray;
	}
	
	//generate world
	if (shapearray.length>0)
	{
		//7500 per floor should be sufficient?
		for (var z=0; z<world.zdepth; z++) {
			//fill in shapes
			var themax = world.width*13;
			for (var i=0; i<themax; i++) {				
				var shapei = Math.floor(Math.random()*shapearray.length);		
				
				var typei = Math.floor(Math.random()*world.tileTypeArray.length);
				while (world.tileTypeArray[typei].typename==dontstamptypename || world.tileTypeArray[typei].typename=="STAIRS_UP" || world.tileTypeArray[typei].typename=="STAIRS_DOWN")
					typei = Math.floor(Math.random()*world.tileTypeArray.length);
				
				var sx = Math.floor(Math.random()*world.width), sy = Math.floor(Math.random()*world.height);
						
				for (var y=sy; y<sy+shapearray[shapei].length; y++) {						
					for (var x=sx; x<sx+shapearray[shapei][0].length; x++) {
						if (sx<world.width && sy<world.height) {
							var yi=y-sy;
							var xi=x-sx;
							
							if (y<world.height && x<world.width && xi < shapearray[shapei][yi].length && shapearray[shapei][yi].charAt(xi)=="X") {
								world.tile[z][y][x]=new Object();
								applyTypeToTile(world,world.tile[z][y][x], world.tileTypeArray[typei],z,y,x);
							}
						}
					}
				}
			}
			
			//fill in with random tiles after
			for (var y =0; y< world.height; y++)
			{
				for (var x =0; x< world.width; x++)
				{	
					if (Math.random()*100 > 99.0){
						world.tile[z][y][x]=new Object();
						var typeindex = Math.floor(Math.random()*world.tileTypeArray.length);
						var typeobj = world.tileTypeArray[typeindex];
						
						applyTypeToTile(world,world.tile[z][y][x], typeobj,z,y,x);
					}
				}
			}
			
			for (var s = 0; s<=world.width; s+=100)
			{
				makeStairs(world,z);				
			}
		}		
	}
	else 
		worldgen_tile_random(world);
}



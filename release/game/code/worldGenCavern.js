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


function worldgen_tile_cavern(world)
{
	worldgen_tile_randomshape(world,"DIRTGROUND");

	
	for(z = 0;z < world.zdepth;z++){
	
		//draw caves
		printDebug("Enter cave draw");
		world.cavernNodes = new Array();
		for(c=0;c < (world.width * world.height / 350);c++)
		{							
			temp_y = Math.floor(Math.random()*world.height);
			temp_x = Math.floor(Math.random()*world.width);
			temp_size = Math.floor(Math.random()*4)+7;
			world.cavernNodes[c] = new Object;
			world.cavernNodes[c].z = z;
			world.cavernNodes[c].y = temp_y;
			world.cavernNodes[c].x = temp_x;
			world.cavernNodes[c].size = temp_size;
			drawCavern(z,temp_y,temp_x,temp_size,world);
			drawCavern(z,Math.floor(temp_y-temp_size/2),temp_x,temp_size,world);
			drawCavern(z,Math.floor(temp_y+temp_size/2),temp_x,temp_size,world);
			drawCavern(z,temp_y,Math.floor(temp_x+temp_size/2),temp_size,world);
			drawCavern(z,temp_y,Math.floor(temp_x-temp_size/2),temp_size,world);			
		}
		printDebug("Exit cave draw");
	
	
		//check for "straggler" tiles and delete them
		printDebug("Enter straggler");
		for(y = 1;y < world.height-1;y++) {
			for(x = 1;x < world.width-1;x++) {
				numOpen = 0;
				if(world.tile[z][y][x].does_block == true)
				{
					if(world.tile[z][y-1][x-1].does_block == false ) {  numOpen++; }
					if(world.tile[z][y-1][x].does_block == false ) {  numOpen++; }
					if(world.tile[z][y-1][x+1].does_block == false ) {  numOpen++; }
					if(world.tile[z][y][x+1].does_block == false ) {  numOpen++; }
					if(world.tile[z][y+1][x+1].does_block == false ) {  numOpen++; }
					if(world.tile[z][y+1][x].does_block == false ) {  numOpen++; }
					if(world.tile[z][y+1][x-1].does_block == false ) {  numOpen++; }
					if(world.tile[z][y][x-1].does_block == false) {  numOpen++; }
					
					if(numOpen > 5) {
						var typeobj = world.tileTypeArray[0];
						applyTypeToTile(world,world.tile[z][y][x], typeobj,z,y,x);
					}
				}
			}
		}
		printDebug("Exit straggler");
		
		//create temp empty map for A* algorithm
		printDebug("Enter temp map");
		var tempmap = new Array();
		for(i = 0;i < world.height;i++) {
			tempmap[i] = new Array();
			for(j = 0;j < world.width;j++) {
					tempmap[i][j] = 0;
			}
		}
		printDebug("Exit temp map");

		printDebug("Enter roads");
		//draw cavern road connections
		
		for(c=0;c < (world.width * world.height / 350);c++) {
			if(world.cavernNodes.length > c+1){
				if(Math.floor(Math.random()*100) > 97){	
					var startpoint = new Array(world.cavernNodes[c].x,world.cavernNodes[c].y);
					var endpoint = new Array(world.cavernNodes[c+1].x,world.cavernNodes[c+1].y);
					path = AStar(tempmap,startpoint,endpoint,"Diagonal");
					if(path.length > 0){
						for(p = 0;p < path.length;p++){
							var typeobj = world.tileTypeArray[0];
							applyTypeToTile(world,world.tile[z][path[p][1]][path[p][0]], typeobj,z,path[p][1],path[p][0]);
							//make sure we don't go out of bounds					
							if(p>1 && p<path.length-1 && path[p][1]>1 && path[p][1]<world.width-2 && path[p][0]>1 && path[p][0]<world.height-2){
								//bottom right diagonal line
								if(path[p][0]+1 == path[p+1][0] && path[p][1]+1 == path[p+1][1]){
									applyTypeToTile(world,world.tile[z][path[p][1]+1][path[p][0]], typeobj,z,path[p][1]+1,path[p][0]);
								}
								//top right diagonal line
								if(path[p][0]+1 == path[p+1][0] && path[p][1]-1 == path[p+1][1]){
									applyTypeToTile(world,world.tile[z][path[p][1]+1][path[p][0]], typeobj,z,path[p][1]+1,path[p][0]);
								}
								//bottom left diagonal line
								if(path[p][0]-1 == path[p+1][0] && path[p][1]+1 == path[p+1][1]){
									applyTypeToTile(world,world.tile[z][path[p][1]+1][path[p][0]], typeobj,z,path[p][1]+1,path[p][0]);
								}
								//top left diagonal line
								if(path[p][0]-1 == path[p+1][0] && path[p][1]-1 == path[p+1][1]){
									applyTypeToTile(world,world.tile[z][path[p][1]+1][path[p][0]], typeobj,z,path[p][1]+1,path[p][0]);
								}
							}
						}
					}
				}
			}
		}		
		printDebug("Exit roads");
		
		for (var s = 0; s<=world.width; s+=100)
		{
			makeStairs(world,z);				
		}	
	}
	
	
	//create bosses in some caverns
	printDebug("enter boss spawn");
	for (var i=0; i<world.cavernNodes.length; i++)
	{
		var x,y,z;
		z=world.cavernNodes[i].z;
		y=world.cavernNodes[i].y;
		x=world.cavernNodes[i].x;
		if (z>=0&&y>=0&&x>=0&&z<=world.zdepth-1&&y<=world.height-1&&x<=world.width-1)
		{		
			if (Math.random()*100>33)
			{
				var typeindex = Math.floor(Math.random()*world.entityTypeArray.length);
				var typeobj = world.entityTypeArray[typeindex];
			
				if (!typeobj.disableworldgencreate && typeobj.isAI && typeobj.ismonster && (typeobj.zrestrict==null || z == typeobj.zrestrict)) 
				{
					world.entity[z][y][x] = createEntityFromType(getBossEntityType(typeobj,world,Math.random()+2.0),z,y,x,world);				
				}
			}
		}
	}
	printDebug("exit boss spawn");
	
	//world.cavernNodes = null;
}

function drawCavern(z,y,x,size,world)
{
		
		if(x <= 0 || y <= 0 || x >= world.width-1 || y >= world.height-1 || size <= 0){ return; }
		numOpen = 0;
		
		if(world.tile[z][y-1][x-1].does_block == true ) {  numOpen++; }
		if(world.tile[z][y-1][x].does_block == true ) {  numOpen++; }
		if(world.tile[z][y-1][x+1].does_block == true ) {  numOpen++; }
		if(world.tile[z][y][x+1].does_block == true ) {  numOpen++; }
		if(world.tile[z][y+1][x+1].does_block == true ) {  numOpen++; }
		if(world.tile[z][y+1][x].does_block == true ) {  numOpen++; }
		if(world.tile[z][y+1][x-1].does_block == true ) {  numOpen++; }
		if(world.tile[z][y][x-1].does_block == true) {  numOpen++; }
		
		if(numOpen >2){
			var typeobj = world.tileTypeArray[0];
			applyTypeToTile(world,world.tile[z][y][x], typeobj,z,y,x);
			drawCavern(z,y-1,x,size-1,world);
			drawCavern(z,y,x-1,size-1,world);
			drawCavern(z,y+1,x,size-1,world);
			drawCavern(z,y,x+1,size-1,world);
			drawCavern(z,y-1,x-1,size-1,world);
			drawCavern(z,y+1,x-1,size-1,world);
			drawCavern(z,y+1,x+1,size-1,world);
			drawCavern(z,y-1,x+1,size-1,world);
		}else{
			//map[y][x] = 1;
			return;
		}
	}

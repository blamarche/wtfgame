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

/* gameplay class - functions that affect 'world' during gameplay */
function revealFogAt(world,z,y,x,radius)
{
    for (var i=y-radius; i<=y+radius; i++)
        for (var j=x-radius; j<=x+radius; j++)
            if (Math.abs(i-y)+Math.abs(j-x)<=radius)    //TODO: Make this an actual radius calc
            {
                if (i>=0 && i<world.height && j>=0 && j<world.width)
                    world.tile[z][i][j].hasFogOfWar = false;
            }
}

function getNearestBasePosFree(z,y,x)
{
	var dist=9999999999;
	var nearest = null;
	for (var i=0; i< world.baseTileArray.length; i++)
	{
		if (world.baseTileArray[i].z==z)
		{							
			var pz3 = world.baseTileArray[i].z;
			var px3 = world.baseTileArray[i].x;
			var py3 = world.baseTileArray[i].y;
			
			var tdist = Math.abs(px3-x) + Math.abs(py3-y);
			if (tdist<dist && world.entity[pz3][py3][px3]==null){
				nearest = world.baseTileArray[i];
				dist=tdist;
			}
		}
	}
	return nearest;
}

function getNearestBasePos(z,y,x)
{
	var dist=9999999999;
	var nearest = null;
	for (var i=0; i< world.baseTileArray.length; i++)
	{
		if (world.baseTileArray[i].z==z)
		{							
			var pz3 = world.baseTileArray[i].z;
			var px3 = world.baseTileArray[i].x;
			var py3 = world.baseTileArray[i].y;
			
			var tdist = Math.abs(px3-x) + Math.abs(py3-y);
			if (tdist<dist){
				nearest = world.baseTileArray[i];
				dist=tdist;
			}
		}
	}
	return nearest;
}

function getEntityDirEntity(srcent,toent)
{
	if (srcent.pos.y<toent.pos.y)
		return 1;//down
	if (srcent.pos.y>toent.pos.y)
		return 0;//up
	if (srcent.pos.x<toent.pos.x)
		return 3;//right
	if (srcent.pos.x>toent.pos.x)
		return 2;//left
		
	return -1;
}

function AIAttackEntity(aientity, entity)
{	
	
	if (entity!=null){
		entity.hitpoints -= aientity.aiprop.aiparams.damage;	
		if (entity.aiprop.ismonster && !entity.aiprop.trainprop.istrained)
			entity.aiprop.wasattacked=true;
		
	
		if (entity.hitpoints<=0)
			world.entity[entity.pos.z][entity.pos.y][entity.pos.x]=null;
	}
}

function AIAttackPlayer(aientity, damage)
{
	if (world.player.isdefending){
		damage=Math.ceil(damage/2);
		world.player.isdefending=false;
		world.player.stats.damage_defended+=damage;
	}
	
	if (damage>0){
		world.player.entity.hitpoints -= damage;
		set_bottom_mesg(aientity.typename+": CAUSED YOU "+damage+" DAMAGE, HP LEFT: "+world.player.entity.hitpoints);
		world.player.stats.damage_taken+=damage;
	}else if (damage<0){
		world.player.entity.hitpoints -= damage;
		set_bottom_mesg(aientity.typename+": HEALED YOU "+damage+" HP, TOTAL HP: "+world.player.entity.hitpoints);
	}
}
function isBlocked(z,y,x, entity)
{	
	if (world.tile[z][y][x].does_block)
		return true;
	
	if (entity!=null && entity.dragprop.is_dragging && entity.dragprop.drag_z == z && entity.dragprop.drag_y==y && entity.dragprop.drag_x==x
		&& getEntityDragEntity(entity)!=null && getEntityDragEntity(entity).dragprop.is_draggable)
		return false;
	
	if (world.entity[z][y][x]!=null && world.entity[z][y][x].does_block)
		return true;
	
	return false;
}

function drawWorldToBuffer()
{
	//draw new world
	if (useisometricrendering && usefixedentitychars && sprite_width>0 && sprite_height>0) //tile-based - isometric
	{		
		//HACK: Dunno why this happens (probably cuz i cant use pdc_retile()), 
		//but need to refresh cleared screen w/o flip before displaying sprites
		refresh_noflip();
				
		var halfh = Math.floor(screen_height/sprite_height/2);
		var halfw = halfh;
		
		var currow=0;
		var sy=world.player.entity.pos.y - halfh*2;
		var ey=world.player.entity.pos.y + halfh*2+1;
		var sx=world.player.entity.pos.x - halfw*2;
		var ex=world.player.entity.pos.x + halfw*2;
		
		//tiles
		var tx=0;
		var ty=0;
		
		for (var wy=sy; wy<ey; wy++)
		{
			var rowstr="";
			for (var wx=sx; wx<ex; wx++)
			{			
				if (wy>=0 && wx>=0 && wy<world.height && wx<world.width){
					var yoff = get_sprite_height(world.tile[world.player.entity.pos.z][wy][wx].spriteIndex) - sprite_height;
					
					var scale_x = Math.floor(tx * sprite_height)
					var scale_y = Math.floor(ty * sprite_height) 
					
					var x = (( scale_x - scale_y )     ) + screen_width/2
					var y = Math.floor(( scale_x + scale_y ) / 2 ) - screen_height/2;
					
					if (!world.tile[world.player.entity.pos.z][wy][wx].hasFogOfWar)
					{					
					    draw_spritexy(x,y-yoff,world.tile[world.player.entity.pos.z][wy][wx].spriteIndex);
					
					    if (world.entity[world.player.entity.pos.z][wy][wx]!=null)
					    {
						    var xoff = sprite_width - get_sprite_width(world.entity[world.player.entity.pos.z][wy][wx].spriteIndex);//for sprites smaller than tile width
						    if (xoff < 0)
							    xoff=0;
						    else 
							    xoff = xoff / 2;
						    yoff = get_sprite_height(world.entity[world.player.entity.pos.z][wy][wx].spriteIndex) - sprite_height;						
						    draw_spritexy(x+xoff,y-yoff,world.entity[world.player.entity.pos.z][wy][wx].spriteIndex);
					    }
					}
				}
				tx++;
			}	
			tx=0;
			ty++;
		}
	}
	else if (usefixedentitychars && sprite_width>0 && sprite_height>0) //tile-based
	{		
		//HACK: Dunno why this happens (probably cuz i cant use pdc_retile()), 
		//but need to refresh cleared screen w/o flip before displaying sprites
		refresh_noflip();
		
		var halfw = Math.floor(screen_width/sprite_width/2);
		var halfh = Math.floor(screen_height/sprite_height/2);
		
		var currow=0;
		var sy=world.player.entity.pos.y - halfh;
		var ey=world.player.entity.pos.y + halfh+1;
		var sx=world.player.entity.pos.x - halfw;
		var ex=world.player.entity.pos.x + halfw;
				
		//tiles
		var tx=0;
		var ty=0;
		//use_font_set(1);
		for (var wy=sy; wy<ey; wy++)
		{
			var rowstr="";
			for (var wx=sx; wx<ex; wx++)
			{			
				if (wy>=0 && wx>=0 && wy<world.height && wx<world.width){
					var yoff = get_sprite_height(world.tile[world.player.entity.pos.z][wy][wx].spriteIndex) - sprite_height;
					
					if (!world.tile[world.player.entity.pos.z][wy][wx].hasFogOfWar)
					{
					    draw_spritexy(tx*sprite_width,ty*sprite_height-yoff,world.tile[world.player.entity.pos.z][wy][wx].spriteIndex);
					
					    if (world.entity[world.player.entity.pos.z][wy][wx]!=null)
					    {
						    yoff = get_sprite_height(world.entity[world.player.entity.pos.z][wy][wx].spriteIndex) - sprite_height;
						    draw_spritexy(tx*sprite_width,ty*sprite_height-yoff,world.entity[world.player.entity.pos.z][wy][wx].spriteIndex);
					    }
			        }
				}
				tx++;
			}	
			tx=0;
			ty++;
		}
	}
	else //ascii-based
	{
		var currow=0;
		var sy=world.player.entity.pos.y - maxy_half;
		var ey=world.player.entity.pos.y + maxy_half+1;
		var sx=world.player.entity.pos.x - maxx_half;
		var ex=world.player.entity.pos.x + maxx_half;
		
		use_color_pair(0);
		
		//tiles
		//use_font_set(1);
		for (var wy=sy; wy<ey; wy++)
		{
			var rowstr="";
			for (var wx=sx; wx<ex; wx++)
			{
				if (wy>=0 && wx>=0 && wy<world.height && wx<world.width && !world.tile[world.player.entity.pos.z][wy][wx].hasFogOfWar )
					rowstr += world.tile[world.player.entity.pos.z][wy][wx].character;
				else
					rowstr += " ";
			}
			
			printxy(0,currow,rowstr);
			currow++;
		}
		
		//entities
		//use_font_set(2);
		var tx=0;
		var ty=0;
		for (var wy=sy; wy<ey; wy++)
		{
			for (var wx=sx; wx<ex; wx++)
			{
				if (wy>=0 && wx>=0 && wy<world.height && wx<world.width && world.entity[world.player.entity.pos.z][wy][wx]!=null && !world.tile[world.player.entity.pos.z][wy][wx].hasFogOfWar) {
					use_color_pair(world.entity[world.player.entity.pos.z][wy][wx].color_pair);
					printxy(tx,ty,world.entity[world.player.entity.pos.z][wy][wx].character);
				}
				tx++;
			}
			tx=0;
			ty++;
		}
	}
	
	use_color_pair(15);
	//draw + border if player hit
	if (last_player_hp > world.player.entity.hitpoints)
	{
		var c = String.fromCharCode(255);
		for (var i=0; i<maxx; i++){
			printxy(i,0,c);
			printxy(i,maxy-1,c);
		}
		for (var i=0; i<maxy; i++){
			printxy(0,i,c);
			printxy(maxx-1,i,c);
		}
		//refresh_screen();
		//sleepgreedy(33);
	}
	
	//use_font_set(0);
	//bottom_mesg = world.AIArray.length;
	if (bottom_mesg.length > maxx)
	{
		var bottom_mesgp1, bottom_mesgp2;
		
		bottom_mesgp1 = bottom_mesg.substring(0,maxx);
		bottom_mesgp2 = bottom_mesg.substring(maxx, bottom_mesg.length);
		
		printxy(0,maxy-2,bottom_mesgp1);
		printxy(0,maxy-1,bottom_mesgp2);
	}
	else 
		printxy(0,maxy-1,bottom_mesg);
	
	//draw player status
	var hpstr="HP:"+world.player.entity.hitpoints;
	hpstr+=" DMG:"+world.player.damage;
	if (world.player.weaponentity!=null)
		hpstr+=" WEAP:"+world.player.weaponentity.typename;
	
	var floorstr = "FLOOR:"+(world.player.entity.pos.z+1)+" X:"+world.player.entity.pos.x+" Y:"+world.player.entity.pos.y;
	
	printxy(maxx-hpstr.length,0,hpstr);
	printxy(maxx-floorstr.length,1,floorstr);
	
	use_color_pair(0);
}

function setEntityPos(ent,nz,ny,nx){
	if (ent!=null){
		world.entity[ent.pos.z][ent.pos.y][ent.pos.x] = null;
		world.entity[nz][ny][nx] = ent;
		world.entity[nz][ny][nx].pos.x_last = ent.pos.x;
		world.entity[nz][ny][nx].pos.y_last = ent.pos.y;
		world.entity[nz][ny][nx].pos.z_last = ent.pos.z;
		world.entity[nz][ny][nx].pos.x = nx;
		world.entity[nz][ny][nx].pos.y = ny;
		world.entity[nz][ny][nx].pos.z = nz;				
	}
}
function moveDragCheck(ent, z, y, x)
{	
	var dent = getEntityDragEntity(ent);
	if (ent.dragprop.is_dragging && dent!=null)
	{
		if (!dent.dragprop.is_draggable) 
			ent.dragprop.is_dragging=false;	
	}
	else 
	{
		ent.dragprop.is_dragging=false;
	}
	
	if (dent!=null){		
		setEntityPos(dent, z,y,x);
	}
}
function moveEntityLeft(ent){
	var z,y,x;
	z=ent.pos.z;
	y=ent.pos.y;
	x=ent.pos.x;
	//if (world.entity[z][y][x]==null) return false;
	
	var dent = getEntityDragEntity(ent);
	
	if (x-1 >= 0){
		if (!isBlocked(z,y,x-1, world.entity[z][y][x])){
			//var ent = world.entity[z][y][x];			
			
			moveDragCheck(ent,z,y,x);
			
			world.entity[z][y][x-1] = ent;			
			world.entity[z][y][x] = dent;			
			ent.pos.x_last = x;
			ent.pos.y_last = y;
			ent.dragprop.drag_x = x;
			ent.dragprop.drag_y = y;
			ent.pos.x = x-1;
			ent.pos.y = y;
			return true;
		}
	}
	return false;
}
function moveEntityRight(ent){
	var z,y,x;
	z=ent.pos.z;
	y=ent.pos.y;
	x=ent.pos.x;
	var dent = getEntityDragEntity(ent);
	//if (world.entity[z][y][x]==null) return false;
	if (x+1 < world.width){
		if (!isBlocked(z,y,x+1, world.entity[z][y][x])){
			//var ent = world.entity[z][y][x];			
			
			moveDragCheck(ent,z,y,x);
			
			world.entity[z][y][x+1] = ent;			
			world.entity[z][y][x] = dent;
			ent.pos.x_last = x;
			ent.pos.y_last = y;
			ent.dragprop.drag_x = x;
			ent.dragprop.drag_y = y;
			ent.pos.x = x+1;
			ent.pos.y = y;
			
			return true;
		}
	}
	return false;
}
function moveEntityUp(ent){
	var z,y,x;
	z=ent.pos.z;
	y=ent.pos.y;
	x=ent.pos.x;
	var dent = getEntityDragEntity(ent);
	//if (world.entity[z][y][x]==null) return false;
	if (y-1 >= 0){
		if (!isBlocked(z,y-1,x, world.entity[z][y][x])){
			//var ent=world.entity[z][y][x];
			
			moveDragCheck(ent,z,y,x);
			
			world.entity[z][y-1][x] = ent;					
			world.entity[z][y][x] = dent;	
			ent.pos.y_last = y;
			ent.pos.x_last = x;
			ent.dragprop.drag_y = y;
			ent.dragprop.drag_x = x;
			ent.pos.x = x;
			ent.pos.y = y-1;
			
			return true;
		}
	}
	return false;
}
function moveEntityDown(ent){
	var z,y,x;
	z=ent.pos.z;
	y=ent.pos.y;
	x=ent.pos.x;
	
	var dent = getEntityDragEntity(ent);
	//if (world.entity[z][y][x]==null) return false;
	if (y+1 < world.height){
		if (!isBlocked(z,y+1,x, world.entity[z][y][x])){
			//var ent=world.entity[z][y][x];
			
			moveDragCheck(ent,z,y,x);
			
			world.entity[z][y+1][x] = ent;			
			world.entity[z][y][x] = dent; 
			ent.pos.y_last = y;
			ent.pos.x_last = x;
			ent.dragprop.drag_y = y;
			ent.dragprop.drag_x = x;
			ent.pos.x = x;
			ent.pos.y = y+1;
			
			return true;
		}
	}
	return false;
}
function getEntityDragEntity(entity)
{
	if (entity.dragprop.is_dragging)
		return world.entity[entity.dragprop.drag_z][entity.dragprop.drag_y][entity.dragprop.drag_x];
	return null;
}
function getPlayerEntity()
{
	return world.player.entity;
}
function entityGrabEntity(ent, z,y,x)
{	
	
	if (world.entity[z][y][x]!=null 
			&& world.entity[z][y][x].dragprop.is_draggable && world.entity[z][y][x]!=ent)
	{
		ent.dragprop.drag_x = x;
		ent.dragprop.drag_y = y;
		ent.dragprop.drag_z = z;
		ent.dragprop.is_dragging=true;
		
		return true;
	}
	return false;
}
function changeEntityZ(z,y,x,new_z){
	if (world.entity[z][y][x]!=null){
		world.entity[new_z][y][x] = world.entity[z][y][x];
		world.entity[new_z][y][x].pos.x_last = x;
		world.entity[new_z][y][x].pos.y_last = y;
		world.entity[new_z][y][x].pos.z_last = z;
		world.entity[new_z][y][x].pos.z = new_z;
		world.entity[z][y][x] = null;		
	}
}

function getPlayerDirPos()
{
	var dx,dy,dz;
	switch (world.player.dir)
	{
		case 0: 
			dy=world.player.entity.pos.y-1;
			dx=world.player.entity.pos.x;
			dz=world.player.entity.pos.z;
			break;
		case 1: 
			dy=world.player.entity.pos.y+1;
			dx=world.player.entity.pos.x;
			dz=world.player.entity.pos.z;
			break;
		case 2: 
			dy=world.player.entity.pos.y;
			dx=world.player.entity.pos.x-1;
			dz=world.player.entity.pos.z;
			break;
		case 3: 
			dy=world.player.entity.pos.y;
			dx=world.player.entity.pos.x+1;
			dz=world.player.entity.pos.z;
			break;
		default:
			dy=world.player.entity.pos.y;
			dx=world.player.entity.pos.x;
			dz=world.player.entity.pos.z;
			break;
	}
	var o = new Object();
	o.x=dx;
	o.y=dy;
	o.z=dz;
	return o;
}

function removeEntityFromAIArray(aient)
{
	for (var i=0; i<world.AIArray.length; i++){
		var ai = world.AIArray[i];
		
		//check if dead
		if (ai.entity == aient){
			world.AIArray.splice(i,1);
			//world.entity[ai.entity.pos.z][ai.entity.pos.y][ai.entity.pos.x] = null;			
			return true;
		}
	}
	return false;
}

function mineTile(tile,z,y,x, damage) //return 0,1,2,3 - 0:not minable, 1:mined, 2:success, 3:fail
{
	var res=0;
	if (tile.mineprop.minable){	
		tile.hitpoints -= damage;
		//bottom_mesg = "YOU MINE: "+tile.typename+", "+tile.hitpoints+" HP LEFT.";
		res=1;
		if (tile.hitpoints<=0){
			var o = world.tileTypeArray[0];
			if (o!=null){
				var type = getEntityTypeByName(tile.mineprop.minetype);
				if (type!=null){
					if (tile.mineprop.mineratio>=Math.random()){
						world.entity[z][y][x] = createEntityFromType(type,z,y,x,world);
						//bottom_mesg = "YOU SUCCESSFULLY MINED: "+tile.mineprop.minetype+", FROM: "+tile.typename;
						res=2;
						//stat("resources_mined");
					}
					else
						res=3;
						//bottom_mesg = "YOUR ATTEMPT TO MINE: "+tile.typename+" FAILED.";
						
					applyTypeToTile(world,tile, o,z,y,x);
				}
				else if (getTileTypeByName(tile.mineprop.minetype)!=null){
					var ttype=getTileTypeByName(tile.mineprop.minetype);
					if (tile.mineprop.mineratio >= Math.random()){							
						//bottom_mesg = "YOU SUCCESSFULLY MINED: "+tile.mineprop.minetype+", FROM: "+tile.typename;
						res=2;
						applyTypeToTile(world,tile, ttype,z,y,x);
						//stat("resources_mined");
					}
					else{
						res=3;
						//bottom_mesg = "YOUR ATTEMPT TO MINE: "+tile.typename+" FAILED.";													
						applyTypeToTile(world,tile, o,z,y,x);
					}
				}
				else {
					applyTypeToTile(world,tile, o,z,y,x);
					res=2;
				}				
			}
		}
	}
	
	return res;
}

function doInput(getchvar, getchar)
{	
	var plyr = world.entity[world.player.entity.pos.z][world.player.entity.pos.y][world.player.entity.pos.x];

	//bottom_mesg=getchvar;
	
	//movement input		
	var didmove=false;
	if (getchvar==259 || getchar=='i'){
		if (moveEntityUp(world.player.entity)){
			didmove=true;
			}
		world.player.dir=0;
	}
	else if (getchvar==258 || getchar=='k'){
		if (moveEntityDown(world.player.entity)){
			didmove=true;
			}
		world.player.dir=1;
	}
	else if (getchvar==260 || getchar=='j'){
		if (moveEntityLeft(world.player.entity)){
			didmove=true;
			}
		world.player.dir=2;
	}
	else if (getchvar==261 || getchar=='l'){
		if (moveEntityRight(world.player.entity)){
			didmove=true;
			}
		world.player.dir=3;
	}
	else if (getchar=='L'){ //event log
	    showEventLog();
	}
	else if (getchar=='.'){ //DEBUG
		//changeEntityZ(world.player.entity.pos.z, world.player.entity.pos.y, world.player.entity.pos.x, world.player.entity.pos.z+1);
		//world.nextEventTickMs=0;
		world.nextFarmTickMs=0;
	}
	else if (getchar=='s'){
		showStatScreen();
	}
	else if (getchar=='d'){ //DEFEND
		world.player.isdefending=!world.player.isdefending;
		incrementTurn();
		if (world.player.isdefending)
			set_bottom_mesg( "YOU ARE NOW DEFENDING...");
		else 
			set_bottom_mesg( "YOU ARE NO LONGER DEFENDING...");
	}
	else if (getchar=='g'){ //GRAB
		if (world.player.isdefending){
			world.player.isdefending=false;
		}
	
		if (plyr.dragprop.is_dragging){
			plyr.dragprop.is_dragging = false;
			var ent=world.entity[plyr.dragprop.drag_z][plyr.dragprop.drag_y][plyr.dragprop.drag_x];
			if (ent!=null)
				set_bottom_mesg( "YOU LET GO OF: "+ent.typename);
				
			
			incrementTurn();
		}
		else
		{
			var p = getPlayerDirPos();
			if (entityGrabEntity(plyr, p.z,p.y,p.x))
			{
				var ent=world.entity[plyr.dragprop.drag_z][plyr.dragprop.drag_y][plyr.dragprop.drag_x];
				if (ent!=null){
					set_bottom_mesg( "YOU GRAB: "+ent.typename);
					stat("objects_dragged");
				}
				
    			incrementTurn();
			}
		}
	}
	else if (getchar=='b'){	//BASE+
		if (world.player.isdefending){
			world.player.isdefending=false;
		}
		
		makeBaseTile(world.player.entity.pos.z,world.player.entity.pos.y,world.player.entity.pos.x);
		makeBaseTile(world.player.entity.pos.z,world.player.entity.pos.y-1,world.player.entity.pos.x);
		makeBaseTile(world.player.entity.pos.z,world.player.entity.pos.y+1,world.player.entity.pos.x);
		makeBaseTile(world.player.entity.pos.z,world.player.entity.pos.y,world.player.entity.pos.x-1);
		makeBaseTile(world.player.entity.pos.z,world.player.entity.pos.y,world.player.entity.pos.x+1);
		
		incrementTurn();
	}
	else if (getchar=='n'){	//BASE-
		if (world.player.isdefending){
			world.player.isdefending=false;
		}
		
		removeBaseTile(world.player.entity.pos.z,world.player.entity.pos.y,world.player.entity.pos.x);
		removeBaseTile(world.player.entity.pos.z,world.player.entity.pos.y-1,world.player.entity.pos.x);
		removeBaseTile(world.player.entity.pos.z,world.player.entity.pos.y+1,world.player.entity.pos.x);
		removeBaseTile(world.player.entity.pos.z,world.player.entity.pos.y,world.player.entity.pos.x-1);
		removeBaseTile(world.player.entity.pos.z,world.player.entity.pos.y,world.player.entity.pos.x+1);

		incrementTurn();
	}
	else if (getchar=='a'){	//attack
		var p = getPlayerDirPos();
		var tile = world.tile[p.z][p.y][p.x];
		var ent = world.entity[p.z][p.y][p.x];
		
		if (world.player.isdefending){
			world.player.isdefending=false;
		}
		
		if (ent!=null && ent.tileprop.destroyable){
			ent.hitpoints -= world.player.damage;
			set_bottom_mesg( "YOU HIT: "+ent.typename+", "+ent.hitpoints+" HP LEFT.");
			ent.aiprop.wasattacked=true;
			if (ent.hitpoints<=0){
				world.entity[p.z][p.y][p.x]=null;
				if (!ent.aiprop.isAI)
					stat("objects_destroyed");
				else {
					world.player.stats.damage_dealt+=world.player.damage;
					if (ent.aiprop.ismonster)
						stat("monsters_killed");
					if (ent.aiprop.isanimal)
						stat("animals_killed");
				}
			}
			incrementTurn();
		}
		else if (tile.destroyable){	
			tile.hitpoints -= world.player.damage;
			set_bottom_mesg( "YOU HIT: "+tile.typename+", "+tile.hitpoints+" HP LEFT.");
			if (tile.hitpoints<=0){
				var o = world.tileTypeArray[0];
				if (o!=null){
					applyTypeToTile(world,tile, o,p.z,p.y,p.x);
				}
				stat("objects_destroyed");
			}
			incrementTurn();
		}
	}
	else if (getchar=='m'){	//MINE
		var p = getPlayerDirPos();
		var tile = world.tile[p.z][p.y][p.x];
		
		if (world.player.isdefending){
			world.player.isdefending=false;
		}
		
		var minetypetmp = tile.mineprop.minetype;
		var res=mineTile(tile,p.z,p.y,p.x, world.player.damage/2);
		
		incrementTurn();
		
		if (res==1)
			set_bottom_mesg( "YOU MINE: "+tile.typename+", "+tile.hitpoints+" HP LEFT.");
		else if(res==2)
			set_bottom_mesg("YOU SUCCESSFULLY MINED: "+minetypetmp+", FROM: "+tile.typename);
		else if (res==3)
			set_bottom_mesg("YOUR ATTEMPT TO MINE: "+tile.typename+" FAILED.");
		
		/*
		if (tile.mineprop.minable){	
			tile.hitpoints -= world.player.damage/2;
			bottom_mesg = "YOU MINE: "+tile.typename+", "+tile.hitpoints+" HP LEFT.";
			if (tile.hitpoints<=0){
				var o = world.tileTypeArray[0];
				if (o!=null){
					var type = getEntityTypeByName(tile.mineprop.minetype);
					if (type!=null){
						if (tile.mineprop.mineratio>=Math.random()){
							world.entity[p.z][p.y][p.x] = createEntityFromType(type,p.z,p.y,p.x,world);
							bottom_mesg = "YOU SUCCESSFULLY MINED: "+tile.mineprop.minetype+", FROM: "+tile.typename;
							stat("resources_mined");
						}else
							bottom_mesg = "YOUR ATTEMPT TO MINE: "+tile.typename+" FAILED.";
							
						applyTypeToTile(world,tile, o,p.z,p.y,p.x);
					}
					else if (getTileTypeByName(tile.mineprop.minetype)!=null){
						var ttype=getTileTypeByName(tile.mineprop.minetype);
						if (tile.mineprop.mineratio >= Math.random()){							
							bottom_mesg = "YOU SUCCESSFULLY MINED: "+tile.mineprop.minetype+", FROM: "+tile.typename;
							applyTypeToTile(world,tile, ttype,p.z,p.y,p.x);
							stat("resources_mined");
						}
						else{
							bottom_mesg = "YOUR ATTEMPT TO MINE: "+tile.typename+" FAILED.";							
							applyTypeToTile(world,tile, o,p.z,p.y,p.x);
						}
					}
					else 
						applyTypeToTile(world,tile, o,p.z,p.y,p.x);
						
										
				}
			}
		}
		*/
	}
	else if (getchar=='v') {//LOOK
		var tname="(NOTHING)";
		var p = getPlayerDirPos();
		var tile = world.tile[p.z][p.y][p.x];
		var ent = world.entity[p.z][p.y][p.x];
		
		if (ent!=null) {
			tname=ent.typename;
			if (ent.itemprop.isitem)
			{
				if (ent.itemprop.itemdamage>0)
					tname+=", "+ent.itemprop.itemdamage + "("+(ent.itemprop.itemdamage-world.player.damage)+")";
				if (ent.itemprop.healamount>0)
					tname+=", HP+"+ent.itemprop.healamount;
				if (ent.itemprop.healamount<0)
					tname+=", HP"+ent.itemprop.healamount;
				if (ent.itemprop.combine.combinewithtype!="")
					tname+=", COMBINES WITH: "+ent.itemprop.combine.combinewithtype;
			}
		}
		else 
			tname=tile.typename;
		set_bottom_mesg( "YOU SEE: "+tname);
	}
	else if (getchar=='u') {	//USE/EQUIP
		var p = getPlayerDirPos();
		var ent = world.entity[p.z][p.y][p.x];
		
		if (world.player.isdefending){
			world.player.isdefending=false;
		}
		
		if (ent!=null && ent.itemprop.isitem)
		{
			var mesg="";
			incrementTurn();
		
			if (ent.itemprop.itemdamage>0){
				world.player.damage = ent.itemprop.itemdamage;				
				
				world.entity[p.z][p.y][p.x] = world.player.weaponentity;
				if ( world.player.weaponentity!=null)
					setEntityPos(world.player.weaponentity, p.z,p.y,p.x);
					
				world.player.weaponentity = ent;
				mesg = "YOU EQUIP: "+ent.typename+", "+ent.itemprop.itemdamage+" DMG. ";
				stat("weapons_used");
			}				
			if (ent.itemprop.healamount!=0){
				world.player.entity.hitpoints+=ent.itemprop.healamount;			
				if (ent.itemprop.healamount>0)
					mesg+= "YOU HEAL "+ent.itemprop.healamount+" HP. ";
				else{
					mesg+= "YOU ARE INJURED "+Math.abs(ent.itemprop.healamount)+" HP. ";
					world.player.stats.damage_taken+=Math.abs(ent.itemprop.healamount);
				}
				mesg += "(TOTAL HP: "+world.player.entity.hitpoints+") ";
				
				if (ent.itemprop.itemdamage==0)
					world.entity[p.z][p.y][p.x]=null;
			}
			if (ent.aiprop.isAI)
				removeEntityFromAIArray(ent);
				
			set_bottom_mesg( mesg);
		}
		else if (ent!=null && ent.aiprop.trainprop.istrainable && ent.aiprop.isAI)
		{
			
			incrementTurn();
			
			if (ent.aiprop.trainprop.trainratio >= Math.random()) {
				ent.aiprop.trainprop.istrained=true;
				ent.color_pair = world.player.entity.color_pair;
				set_bottom_mesg("YOU SUCCESSFULLY TRAINED: "+ent.typename);
				ent.aiprop.wasattacked=false;
				if (ent.aiprop.ismonster)
					stat("monsters_trained");
				if (ent.aiprop.isanimal)
					stat("animals_trained");
			}
			else {
				ent.aiprop.trainprop.istrainable=false;
				set_bottom_mesg("YOU FAILED TO TRAIN: "+ent.typename);
			}
		}
		else 
			set_bottom_mesg( "THERE IS NOTHING THERE TO USE OR TRAIN.");
	}
	else if (getchar=='c') { //CONSTRUCT + COMBINE
		var p = getPlayerDirPos();
		var ent = world.entity[p.z][p.y][p.x];
		var tile = world.tile[p.z][p.y][p.x];
		var dragent=getEntityDragEntity(world.player.entity);
		
		if (world.player.isdefending){
			world.player.isdefending=false;
		}
		
		//check for combine
		if (ent!=null && world.player.entity.dragprop.is_dragging && dragent!=null &&
				dragent.itemprop.combine.combinewithtype!="" && dragent.itemprop.combine.combineresulttype!="") {
			
			incrementTurn();
			if (ent.typename.indexOf(dragent.itemprop.combine.combinewithtype)>=0) {
				if (dragent.itemprop.combine.combineratio >= Math.random()) {
					set_bottom_mesg( "YOU COMBINE "+dragent.typename+" WITH "+ent.typename+" TO CREATE: "+dragent.itemprop.combine.combineresulttype);
					world.entity[p.z][p.y][p.x] = null;
					world.entity[dragent.pos.z][dragent.pos.y][dragent.pos.x] = null;
					var etype = getEntityTypeByName(dragent.itemprop.combine.combineresulttype);
					if (etype)
						world.entity[dragent.pos.z][dragent.pos.y][dragent.pos.x] = createEntityFromType(etype,dragent.pos.z,dragent.pos.y,dragent.pos.x,world);
					else 
						set_bottom_mesg( "OOPS, PLEASE CONTACT THE DEVS, YOU SHOULD HAVE CREATED: "+dragent.itemprop.combine.combineresulttype);
				}
				else {
					set_bottom_mesg( "YOU FAILED TO COMBINE: "+dragent.typename+", WITH: "+ent.typename);
					world.entity[p.z][p.y][p.x] = null;
					world.entity[dragent.pos.z][dragent.pos.y][dragent.pos.x] = null;
					world.player.entity.dragprop.is_dragging=false;
				}
			}
			else 
				set_bottom_mesg( "YOU CANNOT COMBINE: "+dragent.typename+", WITH: "+ent.typename);
		}
		else if (ent!=null && ent.tileprop.constructtype!="") {						
			//else construct
			incrementTurn();
			var ttype=getTileTypeByName(ent.tileprop.constructtype);
			if (ttype!=null){
				if (ent.tileprop.constructratio >= Math.random()){
					applyTypeToTile(world,tile, ttype,p.z,p.y,p.x);
					set_bottom_mesg( "YOU SUCCESSFULLY CONSTRUCT: "+ent.tileprop.constructtype+", WITH: "+ent.typename);
					if (ttype.mineprop.isfarmland)
					{
						if (tile.mineprop.minetype==""){
							tile.mineprop.minetype = ent.origtypename;
							tile.mineprop.mineratio = ent.tileprop.constructratio*0.75;
						}
						stat("farmlands");
					}
					stat("objects_constructed");
				}
				else
					set_bottom_mesg( "YOU ATTEMPT CONSTRUCTION WITH: "+ent.typename+", BUT FAIL.");
					
				world.entity[p.z][p.y][p.x]=null;
			}
			else {
				var etype=getEntityTypeByName(ent.tileprop.constructtype);
				if (etype!=null){
					if (ent.tileprop.constructratio >= Math.random()){
						world.entity[p.z][p.y][p.x] = createEntityFromType(etype,p.z,p.y,p.x,world);
						set_bottom_mesg( "YOU SUCCESSFULLY CONSTRUCT: "+ent.tileprop.constructtype+", WITH: "+ent.typename);
						stat("objects_constructed");
					}
					else {
						set_bottom_mesg( "YOU ATTEMPT CONSTRUCTION WITH: "+ent.typename+", BUT FAIL.");
						world.entity[p.z][p.y][p.x]=null;
					}
				}
			}		
		}
		else {
			set_bottom_mesg( "YOU CANNOT DO THAT WITH THIS OBJECT");
		}
	}	
	else {	//SHOW FAV COORD
		var inpval = parseInt(getchar);
		if (inpval>=1 && inpval<=9)
			showBookmark(inpval);
	}
	
	
	if (didmove){
		incrementTurn();
		revealFogAt(world, world.player.entity.pos.z, world.player.entity.pos.y, world.player.entity.pos.x, world.player.viewradius);
		
		var tile = world.tile[world.player.entity.pos.z][world.player.entity.pos.y][world.player.entity.pos.x];
		stat("distance_travelled");
		
		if (tile.typename=="STAIRS_UP"){
			if (world.player.entity.pos.z>0 ){
				changeEntityZ(world.player.entity.pos.z,world.player.entity.pos.y,world.player.entity.pos.x, world.player.entity.pos.z - 1);
				//world.player.entity.pos.z--;
				set_bottom_mesg( "YOU ASCEND THE STAIRS TO LEVEL "+(world.player.entity.pos.z+1));
				stat("stairs_climbed");
				revealFogAt(world, world.player.entity.pos.z, world.player.entity.pos.y, world.player.entity.pos.x, world.player.viewradius);
				}
		}
		else if (tile.typename=="STAIRS_DOWN"){
			if ( world.player.entity.pos.z < world.zdepth-1){
				changeEntityZ(world.player.entity.pos.z,world.player.entity.pos.y,world.player.entity.pos.x, world.player.entity.pos.z + 1);
				//world.player.entity.pos.z++;
				set_bottom_mesg( "YOU DESCEND THE STAIRS TO LEVEL "+(world.player.entity.pos.z+1));
				stat("stairs_climbed");
				revealFogAt(world, world.player.entity.pos.z, world.player.entity.pos.y, world.player.entity.pos.x, world.player.viewradius);
				}
		}
		
		if (tile.damage_to_deal>0){
			plyr.hitpoints -= tile.damage_to_deal;
			world.player.stats.damage_taken+=tile.damage_to_deal;
			set_bottom_mesg(tile.typename+": CAUSED YOU "+tile.damage_to_deal+" DAMAGE, HP LEFT: "+plyr.hitpoints);
		}
		
		if (world.player.isdefending){
			world.player.isdefending=false;
			set_bottom_mesg( "YOU ARE NO LONGER DEFENDING...");
		}
	}
	
	//respawn dead player
	if (plyr && plyr.hitpoints<=0 )
	{
		stat("deaths");
		
		var msg = "YOU HAVE DIED. YOUR BASE IS OVERRUN.";
		var msg2 = "YOUR WEAPON WAS DAMAGED, YOU DO NOT KNOW WHERE YOU ARE.";
		var msg3 = "YOU WILL BE REBORN IN 5 SECONDS.";
		printxy(maxx/2-msg.length/2,maxy/2,msg);
		printxy(maxx/2-msg2.length/2,maxy/2+1,msg2);
		printxy(maxx/2-msg3.length/2,maxy/2+2,msg3);
		refresh_screen();
		sleep(5000);
		
		for (var k=0; k<world.AIArray.length; k++)
		{
			if (world.AIArray[k].entity.aiprop.trainprop.istrained)
				world.AIArray[k].entity.aiprop.trainprop.istrained=false;
		}
		
		var z=Math.floor(Math.random()*(world.player.entity.pos.z+1));
		var y=Math.floor(Math.random()*world.height);
		var x=Math.floor(Math.random()*world.width);
	
		if (world.player.weaponentity!=null){
			world.player.weaponentity.itemprop.itemdamage = Math.floor(world.player.weaponentity.itemprop.itemdamage*0.70);
			world.player.damage = world.player.weaponentity.itemprop.itemdamage;
		}
		world.player.entity.dragprop.is_dragging = false;
		world.player.entity.hitpoints = 65 - (5*world.zdepth);
	
		setEntityPos(world.player.entity,z,y,x);
	
		clearAllBaseTiles(world);
		bulldozePlayerPath(world);
		revealFogAt(world, world.player.entity.pos.z, world.player.entity.pos.y, world.player.entity.pos.x, world.player.viewradius);
	}
}

function incrementTurn()
{
    if (!userealtimemode)
    {
        stat("game_ticks");
        currentTickMs+=333;
    }
}

function doGameLogic()
{
	if (userealtimemode)
    	stat("game_ticks");
	
	doRandomEvents();
	doFarmGrow();
	doAI();	
	
	if (world.player.entity.hitpoints > world.player.stats.mosthp)
		world.player.stats.mosthp = world.player.entity.hitpoints;
}

function doRandomEvents()
{
	if (world.eventFuncArray.length>0 && currentTickMs - world.lastEventTickMs > world.nextEventTickMs)
	{
		eval(world.eventFuncArray[Math.floor(Math.random()*world.eventFuncArray.length)]+"(world);");
		world.lastEventTickMs = currentTickMs;
		world.nextEventTickMs = Math.floor(Math.random()*1200000)+600000;
	}
}

function doFarmGrow()
{
	if (currentTickMs - world.lastFarmTickMs > world.nextFarmTickMs)
	{
		for (var z=0; z<world.zdepth; z++)
			for (var y=0; y<world.height; y++)
				for (var x=0; x<world.width; x++){
					if (world.tile[z][y][x].mineprop.isfarmland && world.tile[z][y][x].mineprop.mineratio>=Math.random()){
						var mtype = world.tile[z][y][x].mineprop.minetype;
						if (world.entity[z][y][x]!=null && world.entity[z][y][x].origtypename==mtype){	
							//destroy non-harvested farmland
							applyTypeToTile(world,world.tile[z][y][x], world.tileTypeArray[0],z,y,x);
						}
						if (world.entity[z][y][x]!=getPlayerEntity())
							world.entity[z][y][x] = createEntityFromType(getEntityTypeByName(mtype),z,y,x,world);
					}
				}
		world.lastFarmTickMs = currentTickMs;
		world.nextFarmTickMs = Math.floor(Math.random()*300000)+900000;
		
		set_bottom_mesg( "THE TIME FOR HARVEST IS UPON YOU...");
	}
}

function doAI()
{
	if (currentTickMs-lastAITickMs >= AIFreqMs){
		for (var i=0; i<world.AIArray.length; i++){
			var ai = world.AIArray[i];
			
			//check if dead
			if (ai.entity.hitpoints <= 0){
				world.AIArray.splice(i,1);
				world.entity[ai.entity.pos.z][ai.entity.pos.y][ai.entity.pos.x] = null;
				
				if (ai.entity.aiprop.item.typename!="" && ai.entity.aiprop.item.dropratio>=Math.random()){
					var etype = getEntityTypeByName(ai.entity.aiprop.item.typename);
					if ( etype!=null){
						world.entity[ai.entity.pos.z][ai.entity.pos.y][ai.entity.pos.x] = createEntityFromType(etype,ai.entity.pos.z,ai.entity.pos.y,ai.entity.pos.x,world);
					}
					else{
						var ttype=getTileTypeByName(ent.tileprop.constructtype);
						if (ttype!=null){
							applyTypeToTile(world,world.tile[ai.entity.pos.z][ai.entity.pos.y][ai.entity.pos.x], ttype,ai.entity.pos.z,ai.entity.pos.y,ai.entity.pos.x);							
						}
					}
				}
				
				ai.entity=null;
				ai=null;
			}
			else {	//call ai routine
				eval(ai.entity.aiprop.aifuncname);
			}
		}
	}
}

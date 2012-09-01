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
function _baseai_hittile(z,y,x,world,ai)
{
	if (z<0||y<0||x<0||z>world.zdepth-1||y>world.height-1||x>world.width-1) 
		return;
		
	var tile = world.tile[z][y][x];
	
	if (tile.destroyable){	
		tile.hitpoints -= ai.entity.aiprop.aiparams.damage;
		if (tile.hitpoints<=0){
			var o = world.tileTypeArray[0];
			if (o!=null){
				applyTypeToTile(world,tile, o,z,y,x);
			}
		}
	}else if(world.entity[z][y][x] && world.entity[z][y][x].aiprop.isAI && world.entity[z][y][x].aiprop.isanimal){		
		AIAttackEntity(ai.entity, world.entity[z][y][x]);
	}
}

function _dobaseai_mine(world,ai)
{
	var res=0;
	var mz = ai.entity.pos.z;					
	var mx = Math.min(Math.max(ai.entity.pos.x-1, 0), world.width-1);
	var my = Math.min(Math.max(ai.entity.pos.y, 0), world.height-1);								
	res = mineTile(world.tile[mz][my][mx], mz,my,mx, ai.entity.aiprop.aiparams.damage / 2);
	if (res==2 && world.entity[mz][my][mx] && !world.tile[mz][my][mx].isbase)
		entityGrabEntity(ai.entity, mz,my,mx);
	
	if (res==0){
		mx = Math.min(Math.max(ai.entity.pos.x+1, 0), world.width-1);
		my = Math.min(Math.max(ai.entity.pos.y, 0), world.height-1);								
		res=mineTile(world.tile[mz][my][mx], mz,my,mx, ai.entity.aiprop.aiparams.damage / 2);
		if (res==2 && world.entity[mz][my][mx] && !world.tile[mz][my][mx].isbase)
			entityGrabEntity(ai.entity, mz,my,mx);
	}
	if (res==0){
		mx = Math.min(Math.max(ai.entity.pos.x, 0), world.width-1);
		my = Math.min(Math.max(ai.entity.pos.y-1, 0), world.height-1);								
		res=mineTile(world.tile[mz][my][mx], mz,my,mx, ai.entity.aiprop.aiparams.damage / 2);
		if (res==2 && world.entity[mz][my][mx] && !world.tile[mz][my][mx].isbase)
			entityGrabEntity(ai.entity, mz,my,mx);
	}
	if (res==0){
		mx = Math.min(Math.max(ai.entity.pos.x, 0), world.width-1);
		my = Math.min(Math.max(ai.entity.pos.y+1, 0), world.height-1);								
		res=mineTile(world.tile[mz][my][mx], mz,my,mx, ai.entity.aiprop.aiparams.damage / 2);
		if (res==2 && world.entity[mz][my][mx] && !world.tile[mz][my][mx].isbase)
			entityGrabEntity(ai.entity, mz,my,mx);
	}
	
	return res;
}

function _dobaseai_attacklogic(world, ai)
{
	var mz = ai.entity.pos.z;
	var mx = ai.entity.pos.x;
	var my = ai.entity.pos.y;
	
	var pz2 = world.player.entity.pos.z;
	var px2 = world.player.entity.pos.x;
	var py2 = world.player.entity.pos.y;
	
	var dist = Math.abs(px2-mx) + Math.abs(py2-my);
	if (mz!=pz2 || dist>=ai.entity.aiprop.aiparams.ignoredistance){
		ai.entity.aiprop.wasattacked=false;
		set_bottom_mesg( ai.entity.typename + " LOST INTEREST IN YOU.");
		return;
	}
	else {
		if (dist==1)
		{
			AIAttackPlayer(ai.entity, ai.entity.aiprop.aiparams.damage);
			ai.entity.aiprop.aiparams.lastAttackMs = currentTickMs;				
			ai.entity.aiprop.aiparams.lastattackpos.z =pz2;
			ai.entity.aiprop.aiparams.lastattackpos.y =py2;
			ai.entity.aiprop.aiparams.lastattackpos.x =px2;
			return;
		}
	}
	
	//check for trained ai
	var ez=mz;
	var ey=my;
	var ex=mx;
	var enemy=null;
	
	if (ey-1>=0){
		enemy=world.entity[ez][ey-1][ex];				
		if (enemy!=null && enemy.aiprop.isAI && enemy.aiprop.trainprop.istrained){
			AIAttackEntity(ai.entity, enemy);
			
		}
	}
	else if (ey+1<world.height){
		enemy=world.entity[ez][ey+1][ex];				
		if (enemy!=null && enemy.aiprop.isAI && enemy.aiprop.trainprop.istrained){
			AIAttackEntity(ai.entity, enemy);
			
		}
	}
	else if (ex-1>=0){
		enemy=world.entity[ez][ey][ex-1];				
		if (enemy!=null && enemy.aiprop.isAI && enemy.aiprop.trainprop.istrained){
			AIAttackEntity(ai.entity, enemy);
			
		}
	}
	else if (ex+1<world.width){
		enemy=world.entity[ez][ey][ex+1];				
		if (enemy!=null && enemy.aiprop.isAI && enemy.aiprop.trainprop.istrained){
			AIAttackEntity(ai.entity, enemy);
			
		}
	}
}

function aifunc_randomraid(world, ai)
{
	if ( typeof ai.entity.aiprop.aiparams.lastMoveMs == "undefined" )
	{
		ai.entity.aiprop.aiparams.lastMoveMs = currentTickMs;
		ai.entity.aiprop.aiparams.lastAttackMs= currentTickMs;		
		
		if (ai.entity.aiprop.aiparams.aiextrastring!=""){
			var aiextra=ai.entity.aiprop.aiparams.aiextrastring.split('|');
			for (var p=0; p<aiextra.length; p++){
				var pa = aiextra[p].split("=");
				switch (pa[0].toLowerCase()){
					case 'speed':
						ai.entity.aiprop.aiparams.moveSpeed = parseInt(pa[1]);
						break;
					case 'viewdistance':
						ai.entity.aiprop.aiparams.viewdistance = parseInt(pa[1]);
						ai.entity.aiprop.aiparams.ignoredistance = parseInt(pa[1])*2;
						break;
				}
			}			
		}
		else {
			ai.entity.aiprop.aiparams.viewdistance = Math.floor(Math.random()*5)+1;
			ai.entity.aiprop.aiparams.ignoredistance = 9;
			ai.entity.aiprop.aiparams.moveSpeed = Math.floor(Math.random()*500)+250;
		}
		
		ai.entity.aiprop.aiparams.lastattackpos = new Object();
		ai.entity.aiprop.aiparams.lastattackpos.z = 0;
		ai.entity.aiprop.aiparams.lastattackpos.y = 0;
		ai.entity.aiprop.aiparams.lastattackpos.x = 0;				
	}
	
	
	//check if time has passed for the ai to move
	if (currentTickMs-ai.entity.aiprop.aiparams.lastMoveMs >= ai.entity.aiprop.aiparams.moveSpeed)
	{
		ai.entity.aiprop.aiparams.lastMoveMs=currentTickMs;			
		var tx=ai.entity.pos.x; 
		var ty=ai.entity.pos.y;
		var tz=ai.entity.pos.z;
	
		
		if (ai.entity.aiprop.wasattacked)//attacked
		{
			//follow player, 
			var mz3 = ai.entity.pos.z;
			var mx3 = ai.entity.pos.x;
			var my3 = ai.entity.pos.y;
			
			var pz3 = world.player.entity.pos.z;
			var px3 = world.player.entity.pos.x;
			var py3 = world.player.entity.pos.y;
			
			var dist = Math.abs(px3-mx3) + Math.abs(py3-my3);
			var mod=0;
			
			//move
			var nextToPlayer=false;
			if (world.player.entity.pos.x > ai.entity.pos.x+mod && moveEntityRight(ai.entity)){						
				tx+=2;doaitiledamage(world, ai);
				}
			else if (world.player.entity.pos.x < ai.entity.pos.x-mod && moveEntityLeft(ai.entity)){
				tx-=2;doaitiledamage(world, ai);
				}
			else if (world.player.entity.pos.y > ai.entity.pos.y+mod && moveEntityDown(ai.entity)){
				ty+=2;doaitiledamage(world, ai);
				}
			else if (world.player.entity.pos.y < ai.entity.pos.y-mod && moveEntityUp(ai.entity)){			
				ty-=2;doaitiledamage(world, ai);
				}
			else 
				nextToPlayer=true;
			
			//attacked, so attack back!			
			if (!ai.entity.aiprop.trainprop.istrained && ai.entity.aiprop.wasattacked && currentTickMs - ai.entity.aiprop.aiparams.lastAttackMs >= ai.entity.aiprop.aiparams.moveSpeed*3)
			{
				_dobaseai_attacklogic(world,ai);
			}
		}
		else  //head toward base
		{
			var mz3 = ai.entity.pos.z;
			var mx3 = ai.entity.pos.x;
			var my3 = ai.entity.pos.y;
			
			var pz3 = ai.entity.aiprop.aiparams.raid.raid_z;
			var px3 = ai.entity.aiprop.aiparams.raid.raid_x;
			var py3 = ai.entity.aiprop.aiparams.raid.raid_y;
			
			if (ai.entity.dragprop.is_dragging && getEntityDragEntity(ai.entity)!=null)
			{
				pz3 = ai.entity.aiprop.aiparams.raid.start_z;
				px3 = ai.entity.aiprop.aiparams.raid.start_x;
				py3 = ai.entity.aiprop.aiparams.raid.start_y;
			}
			if (getEntityDragEntity(ai.entity)==null)
				ai.entity.dragprop.is_dragging = false;
			
			var dist = Math.abs(px3-mx3) + Math.abs(py3-my3);
			var mod=0;
			
			//move
			var nextToBase=false;
			if ((!world.tile[mz3][my3][mx3].isbase || getEntityDragEntity(ai.entity)!=null) && px3 > ai.entity.pos.x+mod && moveEntityRight(ai.entity)){						
				tx+=2;doaitiledamage(world, ai);
				}
			else if ((!world.tile[mz3][my3][mx3].isbase || getEntityDragEntity(ai.entity)!=null) && px3 < ai.entity.pos.x-mod && moveEntityLeft(ai.entity)){
				tx-=2;doaitiledamage(world, ai);
				}
			else if ((!world.tile[mz3][my3][mx3].isbase || getEntityDragEntity(ai.entity)!=null) && py3 > ai.entity.pos.y+mod && moveEntityDown(ai.entity)){
				ty+=2;doaitiledamage(world, ai);
				}
			else if ((!world.tile[mz3][my3][mx3].isbase || getEntityDragEntity(ai.entity)!=null) && py3 < ai.entity.pos.y-mod && moveEntityUp(ai.entity)){			
				ty-=2;doaitiledamage(world, ai);
				}
			else {
				nextToBase=true;
				//destroy surrounding tiles if possible (its a raid!)
				_baseai_hittile(mz3,my3-1,mx3,world,ai);
				_baseai_hittile(mz3,my3+1,mx3,world,ai);
				_baseai_hittile(mz3,my3,mx3-1,world,ai);
				_baseai_hittile(mz3,my3,mx3+1,world,ai);
				
				//move randomly
				switch (Math.floor(Math.random()*4)) {
					case 0:
						if (moveEntityRight(ai.entity)){
							doaitiledamage(world, ai);
						tx+=2;}
						break;
					case 1:
						if (moveEntityLeft(ai.entity)){
							doaitiledamage(world, ai);
						tx-=2;}
						break;
					case 2:
						if (moveEntityUp(ai.entity)){
							doaitiledamage(world, ai);
						ty-=2;}
						break;
					case 3:
						if (moveEntityDown(ai.entity)){
							doaitiledamage(world, ai);
						ty+=2;}
						break;
				}
			}
				
			//grab items
			var px = Math.min(Math.max(tx, 0), world.width-1);
			var py = Math.min(Math.max(ty, 0), world.height-1);
			var pz = ai.entity.pos.z;
			
			if (world.entity[pz][py][px] && world.tile[pz][py][px].isbase)
				entityGrabEntity(ai.entity, pz,py,px);
				
			//attack player
			if (world.player.entity.pos.z==pz && 
					Math.abs(world.player.entity.pos.x-ai.entity.pos.x) + Math.abs(world.player.entity.pos.y-ai.entity.pos.y)==1 &&
					currentTickMs - ai.entity.aiprop.aiparams.lastAttackMs >= ai.entity.aiprop.aiparams.moveSpeed*3)					
			{
				_dobaseai_attacklogic(world,ai);
			}
		}
		
	}	
}

function doaitiledamage(world, ai)
{
	var tile = world.tile[ai.entity.pos.z][ai.entity.pos.y][ai.entity.pos.x];						
	if (tile.damage_to_deal>0 && Math.random()>0.5){
		var dmg  = Math.ceil(tile.damage_to_deal / 2);
		if (dmg<=0)
			dmg=1;
		ai.entity.hitpoints -= dmg;
		
	}
}

function aifunc_random(world, ai)
{	
	//initialize extra variables
	if ( typeof ai.entity.aiprop.aiparams.lastMoveMs == "undefined" )
	{
		ai.entity.aiprop.aiparams.lastMoveMs = currentTickMs;
		ai.entity.aiprop.aiparams.lastAttackMs= currentTickMs;		
		
		if (ai.entity.aiprop.aiparams.aiextrastring!=""){
			var aiextra=ai.entity.aiprop.aiparams.aiextrastring.split('|');
			for (var p=0; p<aiextra.length; p++){
				var pa = aiextra[p].split("=");
				switch (pa[0].toLowerCase()){
					case 'speed':
						ai.entity.aiprop.aiparams.moveSpeed = parseInt(pa[1]);
						break;
					case 'viewdistance':
						ai.entity.aiprop.aiparams.viewdistance = parseInt(pa[1]);
						ai.entity.aiprop.aiparams.ignoredistance = parseInt(pa[1])*2;
						break;
				}
			}			
		}
		else {
			ai.entity.aiprop.aiparams.viewdistance = Math.floor(Math.random()*5)+1;
			ai.entity.aiprop.aiparams.ignoredistance = 9;
			ai.entity.aiprop.aiparams.moveSpeed = Math.floor(Math.random()*500)+250;
		}
		
		ai.entity.aiprop.aiparams.lastattackpos = new Object();
		ai.entity.aiprop.aiparams.lastattackpos.z = 0;
		ai.entity.aiprop.aiparams.lastattackpos.y = 0;
		ai.entity.aiprop.aiparams.lastattackpos.x = 0;	
		ai.path = null;
	}
	
	
	//check if time has passed for the ai to move
	if (currentTickMs-ai.entity.aiprop.aiparams.lastMoveMs >= ai.entity.aiprop.aiparams.moveSpeed)
	{
		ai.entity.aiprop.aiparams.lastMoveMs=currentTickMs;			
		var tx=ai.entity.pos.x; 
		var ty=ai.entity.pos.y;
		var tz=ai.entity.pos.z;
	
		if (ai.entity.aiprop.wasattacked)//attacked
		{
			//follow player, 
			var mz3 = ai.entity.pos.z;
			var mx3 = ai.entity.pos.x;
			var my3 = ai.entity.pos.y;
			
			var pz3 = world.player.entity.pos.z;
			var px3 = world.player.entity.pos.x;
			var py3 = world.player.entity.pos.y;
			
			var dist = Math.abs(px3-mx3) + Math.abs(py3-my3);
			var mod=0;
			//if (ai.entity.aiprop.trainprop.istrained)
			//	mod=2;	//dont follow so close if trained
			
			//move
			var nextToPlayer=false;
			if (world.player.entity.pos.x > ai.entity.pos.x+mod && moveEntityRight(ai.entity)){						
				tx+=2;
				}
			else if (world.player.entity.pos.x < ai.entity.pos.x-mod && moveEntityLeft(ai.entity)){
				tx-=2;
				}
			else if (world.player.entity.pos.y > ai.entity.pos.y+mod && moveEntityDown(ai.entity)){
				ty+=2;
				}
			else if (world.player.entity.pos.y < ai.entity.pos.y-mod && moveEntityUp(ai.entity)){			
				ty-=2;
				}
			else 
				nextToPlayer=true;
			
			//attacked, so attack back!			
			if (!ai.entity.aiprop.trainprop.istrained && ai.entity.aiprop.wasattacked && currentTickMs - ai.entity.aiprop.aiparams.lastAttackMs >= ai.entity.aiprop.aiparams.moveSpeed*3)
			{
				_dobaseai_attacklogic(world, ai)
			}
			if (!nextToPlayer)
				doaitiledamage(world,ai);
		}
		else if (ai.entity.aiprop.trainprop.istrained && ai.entity.dragprop.is_dragging && getEntityDragEntity(ai.entity)!=null)
		{			
			//TRAINED & dragging so head to base
			//printDebug("trained ai is dragging");
			
			//find nearest base, 
			var mz3 = ai.entity.pos.z;
			var mx3 = ai.entity.pos.x;
			var my3 = ai.entity.pos.y;
			
			var base = getNearestBasePosFree(mz3,my3,mx3);
			if (base==null)
				base = getNearestBasePos(mz3,my3,mx3);
				
			if (base!=null && !world.tile[mz3][my3][mx3].isbase)
			{				
				if (ai.path != null)
				{
					if (ai.path.length<=0)
						ai.path=null;
					else {
						var dx=ai.path[0][0];
						var dy=ai.path[0][1];
						
						if (dx > ai.entity.pos.x && moveEntityRight(ai.entity)){						
							ai.path.splice(0,1);
							tx+=2; doaitiledamage(world,ai);
							}
						else if (dx < ai.entity.pos.x && moveEntityLeft(ai.entity)){
							ai.path.splice(0,1);
							tx-=2; doaitiledamage(world,ai);
							}
						else if (dy > ai.entity.pos.y && moveEntityDown(ai.entity)){
							ai.path.splice(0,1);
							ty+=2; doaitiledamage(world,ai);
							}
						else if (dy < ai.entity.pos.y && moveEntityUp(ai.entity)){			
							ai.path.splice(0,1);
							ty-=2; doaitiledamage(world,ai);
							}
						//else {
							//pick up any blocking item						
						/*var px = Math.min(Math.max(tx, 0), world.width-1);
						var py = Math.min(Math.max(ty, 0), world.height-1);
						var pz = ai.entity.pos.z;
						
						if (world.entity[pz][py][px])
							entityGrabEntity(ai.entity, pz,py,px);	*/
						//}					
					}
				}
				else 
				{	
					var pz3 = base.z;
					var px3 = base.x;
					var py3 = base.y;
					
					var dist = Math.abs(px3-mx3) + Math.abs(py3-my3);
					var mod=0;
					
					//move
					var nextToBase=false;
					if (base.x > ai.entity.pos.x+mod && moveEntityRight(ai.entity)){						
						tx+=2; doaitiledamage(world,ai);
						}
					else if (base.x < ai.entity.pos.x-mod && moveEntityLeft(ai.entity)){
						tx-=2; doaitiledamage(world,ai);
						}
					else if (base.y > ai.entity.pos.y+mod && moveEntityDown(ai.entity)){
						ty+=2; doaitiledamage(world,ai);
						}
					else if (base.y < ai.entity.pos.y-mod && moveEntityUp(ai.entity)){			
						ty-=2; doaitiledamage(world,ai);
						}
					else {
						//move randomly						
						nextToBase=true;
						
						switch (Math.floor(Math.random()*4)) {
							case 0:
								if (moveEntityRight(ai.entity)){
									 doaitiledamage(world,ai);
								tx+=2;}
								break;
							case 1:
								if (moveEntityLeft(ai.entity)){
									 doaitiledamage(world,ai);
								tx-=2;}
								break;
							case 2:
								if (moveEntityUp(ai.entity)){
									 doaitiledamage(world,ai);
								ty-=2;}
								break;
							case 3:
								if (moveEntityDown(ai.entity)){
									 doaitiledamage(world,ai);
								ty+=2;}
								break;
						}
						
						//find path
						if (dist>10)
						{
							var startpoint = new Array(ai.entity.pos.x,ai.entity.pos.y);
							var endpoint = new Array(base.x,base.y);						
							path = AStar(world.collisionMap[ai.entity.pos.z],startpoint,endpoint,"Manhattan");
							
							if(path && path.length > 1){
								path.splice(0,1);
								ai.path = path;
								//printDebug("path set");
							}
						}
						
					}
					
					//grab items
					/*
					var px = Math.min(Math.max(tx, 0), world.width-1);
					var py = Math.min(Math.max(ty, 0), world.height-1);
					var pz = ai.entity.pos.z;
					
					if (world.entity[pz][py][px])
						entityGrabEntity(ai.entity, pz,py,px);*/
				}
			}
			else 
			{
				switch (Math.floor(Math.random()*4)) {
					case 0:
						if (moveEntityRight(ai.entity)){
							 doaitiledamage(world,ai);
						tx+=2;}
						break;
					case 1:
						if (moveEntityLeft(ai.entity)){
							 doaitiledamage(world,ai);
						tx-=2;}
						break;
					case 2:
						if (moveEntityUp(ai.entity)){
							 doaitiledamage(world,ai);
						ty-=2;}
						break;
					case 3:
						if (moveEntityDown(ai.entity)){
							 doaitiledamage(world,ai);
						ty+=2;}
						break;
				}
			}
			
			if (ai.entity.dragprop.is_dragging && world.tile[ai.entity.dragprop.drag_z][ai.entity.dragprop.drag_y][ai.entity.dragprop.drag_x].isbase)
				ai.entity.dragprop.is_dragging=false;
			//drop item in base
			//if (!ai.entity.dragprop.is_dragging )		
			//{
				var px = Math.min(Math.max(tx, 0), world.width-1);
				var py = Math.min(Math.max(ty, 0), world.height-1);
				var pz = ai.entity.pos.z;
				
				if (world.entity[pz][py][px])
					entityGrabEntity(ai.entity, pz,py,px);
				
				if (ai.entity.dragprop.is_dragging && world.tile[ai.entity.pos.z][ai.entity.pos.y][ai.entity.pos.x].isbase)
				{
					//swap position and drop
					switch (getEntityDirEntity(ai.entity,getEntityDragEntity(ai.entity)))
					{
						case 0://up
							moveEntityUp(ai.entity); break;
						case 1://down
							moveEntityDown(ai.entity); break;
						case 2://left
							moveEntityLeft(ai.entity); break;
						case 3://right
							moveEntityRight(ai.entity); break;
					}
					ai.entity.dragprop.is_dragging=false;
				}
			//}
		}
		else if (ai.entity.aiprop.trainprop.istrained){
			//TRAINED, FOLLOW PLAYER IF HES CLOSE
			var mz3 = ai.entity.pos.z;
			var mx3 = ai.entity.pos.x;
			var my3 = ai.entity.pos.y;
			
			var pz3 = world.player.entity.pos.z;
			var px3 = world.player.entity.pos.x;
			var py3 = world.player.entity.pos.y;
			
			var dist = Math.abs(px3-mx3) + Math.abs(py3-my3);
			var mod=3;
			if (dist<=10){ //follow player
				var nextToPlayer=false;
				if (world.player.entity.pos.x > ai.entity.pos.x+mod && moveEntityRight(ai.entity)){						
					tx+=2; doaitiledamage(world,ai);
					}
				else if (world.player.entity.pos.x < ai.entity.pos.x-mod && moveEntityLeft(ai.entity)){
					tx-=2; doaitiledamage(world,ai);
					}
				else if (world.player.entity.pos.y > ai.entity.pos.y+mod && moveEntityDown(ai.entity)){
					ty+=2; doaitiledamage(world,ai);
					}
				else if (world.player.entity.pos.y < ai.entity.pos.y-mod && moveEntityUp(ai.entity)){			
					ty-=2; doaitiledamage(world,ai);
					}
				else {
					nextToPlayer=true;
				}
				
				//attack nearby monsters to protect player
				if (currentTickMs - ai.entity.aiprop.aiparams.lastAttackMs >= ai.entity.aiprop.aiparams.moveSpeed*3)
				{
					var ez=mz3;
					var ey=my3;
					var ex=mx3;
					var enemy=null;
					
					if (ey-1>=0){
						enemy=world.entity[ez][ey-1][ex];				
						if (enemy!=null && enemy.aiprop.isAI && enemy.aiprop.ismonster){
							AIAttackEntity(ai.entity, enemy);
							ai.entity.aiprop.aiparams.lastAttackMs=currentTickMs;
						}
					}
					else if (ey+1<world.height){
						enemy=world.entity[ez][ey+1][ex];				
						if (enemy!=null && enemy.aiprop.isAI && enemy.aiprop.ismonster){
							AIAttackEntity(ai.entity, enemy);
							ai.entity.aiprop.aiparams.lastAttackMs=currentTickMs;
						}
					}
					else if (ex-1>=0){
						enemy=world.entity[ez][ey][ex-1];				
						if (enemy!=null && enemy.aiprop.isAI && enemy.aiprop.ismonster){
							AIAttackEntity(ai.entity, enemy);
							ai.entity.aiprop.aiparams.lastAttackMs=currentTickMs;
						}
					}
					else if (ex+1<world.width){
						enemy=world.entity[ez][ey][ex+1];				
						if (enemy!=null && enemy.aiprop.isAI && enemy.aiprop.ismonster){
							AIAttackEntity(ai.entity, enemy);
							ai.entity.aiprop.aiparams.lastAttackMs=currentTickMs;
						}
					}					
				}
			
			} 
			else {	//wander aimlessly				
				
				//mine if not near base	
				var res=0;
				
				var base = getNearestBasePos(ai.entity.pos.z,ai.entity.pos.y,ai.entity.pos.x);				
				var dist=0;
				if (base!=null)
					dist = Math.abs(base.x-mx3) + Math.abs(base.y-my3);
				
				if (dist > 6 && ai.entity.aiprop.aiparams.damage / 2>=1.0)
				{
					res=_dobaseai_mine(world,ai);
				}
				
				if (res==0){
					switch (Math.floor(Math.random()*4))
					{
						case 0:
							if (moveEntityRight(ai.entity)){
								 doaitiledamage(world,ai);
							tx+=2;}
							break;
						case 1:
							if (moveEntityLeft(ai.entity)){
								 doaitiledamage(world,ai);
							tx-=2;}
							break;
						case 2:
							if (moveEntityUp(ai.entity)){
								 doaitiledamage(world,ai);
							ty-=2;}
							break;
						case 3:
							if (moveEntityDown(ai.entity)){
								 doaitiledamage(world,ai);
							ty+=2;}
							break;			
					}
				}
			}
			
			//grab items
			var px = Math.min(Math.max(tx, 0), world.width-1);
			var py = Math.min(Math.max(ty, 0), world.height-1);
			var pz = ai.entity.pos.z;
			
			if (world.entity[pz][py][px])// && !world.tile[pz][py][px].isbase)
				entityGrabEntity(ai.entity, pz,py,px);
		}
		else 
		{	//UNTRAINED
			
			switch (Math.floor(Math.random()*5))
			{
				case 0:
					if (moveEntityRight(ai.entity)){
						 doaitiledamage(world,ai);
					tx+=2;}
					break;
				case 1:
					if (moveEntityLeft(ai.entity)){
						 doaitiledamage(world,ai);
					tx-=2;}
					break;
				case 2:
					if (moveEntityUp(ai.entity)){
						 doaitiledamage(world,ai);
					ty-=2;}
					break;
				case 3:
					if (moveEntityDown(ai.entity)){
						 doaitiledamage(world,ai);
					ty+=2;}
					break;
				case 4:
					break;			
			}
			
			//chance to grab a draggable item	
			if (ai.entity.aiprop.isanimal){
				var px = Math.min(Math.max(tx, 0), world.width-1);
				var py = Math.min(Math.max(ty, 0), world.height-1);
				var pz = ai.entity.pos.z;
				
				if (world.entity[pz][py][px])
					entityGrabEntity(ai.entity, pz,py,px);
			}
			
			//calc straightline player distance if monster
			if (ai.entity.aiprop.ismonster){
				var mz = ai.entity.pos.z;
				var mx = ai.entity.pos.x;
				var my = ai.entity.pos.y;
				
				var pz = world.player.entity.pos.z;
				var px = world.player.entity.pos.x;
				var py = world.player.entity.pos.y;
				
				var dist = Math.abs(px-mx) + Math.abs(py-my);
				
				if (mz==pz && dist<=ai.entity.aiprop.aiparams.viewdistance)
				{
					ai.entity.aiprop.wasattacked=true;
					set_bottom_mesg( ai.entity.typename + " NOTICED YOU.");
				}
			}
		}
	}	
}

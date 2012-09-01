//used by tiles.js
function applyTypeToTile(tileobj,typeobj)
{
	tileobj.character = typeobj.character;
	//tileobj.does_block = typeobj.does_block;
	tileobj.typename = typeobj.typename;
	tileobj.isbase = false;
	tileobj.canbebase = typeobj.canbebase;
	tileobj.minable = typeobj.minable;
	tileobj.mineratio = typeobj.mineratio;
	tileobj.destroyable = typeobj.destroyable;
	tileobj.hitpoints = typeobj.hitpoints;
	tileobj.minetype = typeobj.minetype;
	tileobj.damage_to_deal= typeobj.damage_to_deal;
}
function getTileTypeByName(name)
{
	for (var i=0; i<world.tileTypeArray.length; i++)
	{	
		if (world.tileTypeArray[i].typename == name)
			return world.tileTypeArray[i];
	}
	return null;
}
function increaseLastTileTypeOdds(amt, tileTypeArray)
{
	for (var i=0; i<amt; i++)
		tileTypeArray.push(tileTypeArray[tileTypeArray.length-1]);
}
function createTileType(typename, character, does_block, minable, minetype, mineratio, destroyable, canbebase, damage_to_deal, hitpoints)
{
	var o = new Object();
	o.typename = typename;
	o.character = character;
	o.does_block = does_block;
	o.minable = minable;
	o.mineratio = mineratio;
	o.destroyable = destroyable;
	o.hitpoints = hitpoints;
	o.canbebase = canbebase;
	o.minetype = minetype;
	o.damage_to_deal = damage_to_deal;
	return o;
}

//used by entities.js
function createEntityFromType(typeobj,z,y,x)
{
	var e=new Object();
	
	e.character = typeobj.character;
	e.does_block = typeobj.does_block;
	e.typename = typeobj.typename;	
	e.color_pair = typeobj.color_pair;		
	e.isAI = typeobj.isAI;
	e.destroyable = typeobj.destroyable;
	e.constructtype = typeobj.constructtype;
	e.constructratio = typeobj.constructratio;
	e.x_last = x;
	e.y_last = y;
	e.z_last = z;					
	e.is_dragging = false;
	e.is_draggable = typeobj.is_draggable;
	e.hitpoints = typeobj.hitpoints + Math.floor(Math.random(typeobj.hitpoints_variance));
	e.drag_x=0;
	e.drag_y=0;
	e.drag_z=0;
	
	return e;
}
function getEntityTypeByName(name)
{
	for (var i=0; i<world.entityTypeArray.length; i++)
	{	
		if (world.entityTypeArray[i].typename == name)
			return world.entityTypeArray[i];
	}
	return null;
}
function increaseLastEntityTypeOdds(amt, entityTypeArray)
{
	for (var i=0; i<amt; i++)
		entityTypeArray.push(entityTypeArray[entityTypeArray.length-1]);
}
function createEntityType(typename, does_block, is_draggable, hitpoints, hitpoints_variance, destroyable, constructtype, constructratio)
{
	var o = new Object();
	
	o.typename = typename;
	o.does_block = does_block;
	o.is_draggable = is_draggable;
	o.hitpoints = hitpoints;
	o.hitpoints_variance = hitpoints_variance;
	o.destroyable = destroyable;
	o.constructtype=constructtype;
	o.constructratio=constructratio;
	
	//randomly gened are below, just set some defaults
	o.character = 'E';
	o.color_pair = 1;
	
	return o;
}

function printDebug(){}

/* worldCreator function - generates the world */
function worldCreator(world)     //NOTE: DO NOT USE % AS A CHAR
{	
	printDebug("world creator start");
	
	var playercharacter="@";
				
	//load in tile type specs/ranges, entity specs/ranges
	//tiles should spec values for all properties (incl. character)
	//entities should spec ranges for all properties except character
	var tileTypeArray = new Array(); // REQUIRED DO NOT REMOVE
	var entityTypeArray = new Array(); // REQUIRED DO NOT REMOVE
	
	world.tileTypeArray = tileTypeArray;
	world.entityTypeArray = entityTypeArray;
	
	world.baseTileType = createTileType(
		"base",			/* typename */
		".",			/* character */
		false,			/* does_block */
		false,			/* minable */
		"",				/* minetype */
		/*false,			/* diggable */
		false,			/* destroyable */
		false,			/* canbebase */
		999				/* hitpoints */	
	);
	tileTypeArray.push(world.baseTileType);
	
	
	world.baseEntityType = createTileType(
		"base",			/* typename */
		".",			/* character */
		false,			/* does_block */
		false,			/* minable */
		"",				/* minetype */
		/*false,			/* diggable */
		false,			/* destroyable */
		false,			/* canbebase */
		999				/* hitpoints */	
	);
	entityTypeArray.push(world.baseTileType);
	
	printDebug("start evals");
	
	//eval(stringFromFile('game/settings/tiles.js')); //var tileTypeArray
	//eval(stringFromFile('game/settings/entities.js')); //var entityTypeArray
	
	printDebug("evals complete");
	
	//assign chars to entity types
	printDebug("assign chars to entity types");
	
	var entitychars="!,$,^,&,*,(,),_,+,-,=,~,/,|,},{,],[,;,:,?,>,<,a,Q,o,0,I,U,v,V,8,z"; // make this an array to shuffle?
	var entitycharArray = entitychars.split(",");
	//entitycharArray = arrayShuffle(entitycharArray);	
	for (var i=0; i< entityTypeArray.length; i++) {
		entityTypeArray[i].character = entitycharArray[i];
		entityTypeArray[i].color_pair = Math.floor(Math.random()*15)+1; //1-15
	}
	
	printDebug("assign chars complete");
	
	//create tile arrays 
	printDebug("create tile arrays");
	
	world.tile = new Array(world.zdepth);
	/*
	for (var z =0; z< world.zdepth; z++)
	{
		world.tile[z] = new Array(world.height);
		for (var y =0; y< world.height; y++)
		{
			world.tile[z][y] = new Array(world.width);
			for (var x =0; x< world.width; x++)
			{
				world.tile[z][y][x]=new Object();
				var typeindex = Math.floor(Math.random()*tileTypeArray.length);
				var typeobj = tileTypeArray[typeindex];
				
				applyTypeToTile(world.tile[z][y][x], typeobj);
			}
		}
	}
	*/		
	world.tile = new Array();
	//for (var i=0; i< world.zdepth*world.width*world.height; i++)
	var i=0;
	while (true)
	{
		
		world.tile[i]=new Object();
		world.tile[i].param=1;
		world.tile[i].param2=1;
		world.tile[i].param3=1;
		world.tile[i].param4=1;
		world.tile[i].param5=1;
		world.tile[i].param6=1;
		world.tile[i].param7=1;
		world.tile[i].param8=1;
		world.tile[i].param9=1;
		world.tile[i].param0=1;
		
		
		var typeindex = Math.floor(Math.random()*tileTypeArray.length);
		var typeobj = tileTypeArray[typeindex];
		
		//applyTypeToTile(world.tile[i], typeobj);
		if (i%10000==0 )
			print(i+", ");
			
		i++;
	}	
	
	return;
	
	
	
	
	printDebug("tile arrays complete");
	
	//create entities
	printDebug("create entity arrays");
	
	world.entity = new Array();
	for (var z =0; z< world.zdepth; z++)
	{
		world.entity[z] = new Array();
		for (var y =0; y< world.height; y++)
		{
			world.entity[z][y] = new Array();
			for (var x =0; x< world.width; x++)
			{
				if (Math.random()*100.0 > 99.0 && !world.tile[z][y][x].does_block)
				{
					var typeindex = Math.floor(Math.random()*entityTypeArray.length);
					var typeobj = entityTypeArray[typeindex];
				
					world.entity[z][y][x] = createEntityFromType(typeobj,z,y,x);
				}
				else
					world.entity[z][y][x] = null;
			}
		}
	}
	
	printDebug("entity arrays complete");
	
	//create player entity
	world.player = new Object();
	world.player.x = Math.floor(world.width/2);
	world.player.y = Math.floor(world.height/2);
	world.player.z = 0;
	world.player.damage = 2;
	world.player.dir = 0; //0=up, 1=down, 2=left, 3=right

	var z=world.player.z;
	var y=world.player.y;
	var x=world.player.x;
	
	world.entity[z][y][x] = new Object();
	world.entity[z][y][x].character = playercharacter;
	world.entity[z][y][x].hitpoints = 10;
	world.entity[z][y][x].does_block = true;					
	world.entity[z][y][x].x_last = world.player.x;
	world.entity[z][y][x].y_last = world.player.y;
	world.entity[z][y][x].z_last = world.player.z;
	world.entity[z][y][x].color_pair = 14;
	world.entity[z][y][x].isAI = false;
	world.entity[z][y][x].is_dragging = false;
	world.entity[z][y][x].is_draggable = false;
	world.entity[z][y][x].drag_x=0;
	world.entity[z][y][x].drag_y=0;
	world.entity[z][y][x].drag_z=0;
}	



var world = new Object();
world.zdepth=50;
world.width=500;
world.height=500;
worldCreator(world);
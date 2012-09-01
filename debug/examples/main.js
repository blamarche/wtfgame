screen_init();
var maxx = get_max_x();
var maxy = get_max_y();


create_color_pair(1,12,14);
create_color_pair(2,4,10);
use_color_pair(1);

/*

stringToFile("examples/test.txt","Hello there whats going on?\nYo!");

var j = stringFromFile('examples/hello.txt');
printxy(0,0,j);
refresh_screen();
sleep(1000);

use_color_pair(2);
clear_screen();
refresh_screen();
printxy(0,0,getstring(10,10,"Enter your name: "));
refresh_screen();
sleep(1000);



var dom = loadXMLFile('examples/test.xml');
var docRoot = dom.getDocumentElement();

printxy(10,10,docRoot.getElementsByTagName("name").item(0).getFirstChild().getNodeValue());
printxy(10,11,docRoot.getFirstChild().getAttribute("id"));
refresh_screen();


var world = new Object();
world.abc=1;
world.row=new Array();
world.row.push(new Array());
world.row.push(new Array());
world.row.push(new Array());
world.Meeeeeep = function() { printxy(30,30, "Meep"); };


printxy(10,15,serializeObjToJS(world, 'world'));
refresh_screen();



sleep(1000);

clear_screen();
refresh_screen();
printxy(10,10,getmstime());
sleep(120);
printxy(10,12,getmstime());
refresh_screen();
sleep(1000);
*/
clear_screen();
refresh_screen();

var getchvar = -1;
var getchar='';
var x =10;//Math.random()*maxx;
var y =10;//Math.random()*maxy;

while(getchvar!=27) // == ESCAPE
{	
	//clear_screen();
	
	

	getchvar = getch();
	getchar = String.fromCharCode(getchvar);
	waitUntilNoKey();
	
	//movement
	if (getchar=='i')
		y--;
	if (getchar=='k')
		y++;
	if (getchar=='j')
		x--;
	if (getchar=='l')
		x++;
		
	refresh_screen();
	
	sleep(500);
	
}

screen_end();
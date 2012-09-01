
function waitUntilNoKey()
{
	while (getch()!=-1) { sleep(0); }
}

/*
* getstring
* -- pauses program and gets user input (blocking)
*/
function getstring(x,y,prompt)
{
	var res="";
	var getchval=-1;
	printxy(x,y,prompt);
	refresh_screen();
	
	while (getchval!=10)
	{
		getchval = getch();
		if (getchval!=-1 && getchval!=10)
		{
			res += String.fromCharCode(getchval);
			print(String.fromCharCode(getchval));
			refresh_screen();
		}
		
		sleep(1);
	}
	
	return res;
}


/*
* loadXML
* -- creates DOM from xml
*/
function loadXML(xmlStr) {
  var parser = new DOMImplementation();
  parser.namespaceAware = false;
  var dom = parser.loadXML(xmlStr);

  return dom;
}

function loadXMLFile(filename){
	return loadXML(stringFromFile(filename));
}


/*
* serializeObjToJS
* -- Creates JS code from js object
*/
function serializeObjToJS(obj, objname)
{	
	var objSerializer = new JSSerializer();
	
	//Prefs
	objSerializer.Prefs.SmartIndent =	true;
	objSerializer.Prefs.ShowLineBreaks =true;
	objSerializer.Prefs.ShowTypes =		true;
	
	//Types
	objSerializer.Types.UseNull =		true;
	objSerializer.Types.UseUndefined =	true;
	objSerializer.Types.UseArray =		true;
	objSerializer.Types.UseObject =		true;
	objSerializer.Types.UseBoolean =	true;
	objSerializer.Types.UseDate =		true;
	objSerializer.Types.UseError =		true;
	objSerializer.Types.UseFunction =	true;
	objSerializer.Types.UseNumber =		true;
	objSerializer.Types.UseRegExp =		true;
	objSerializer.Types.UseString =		true;
	objSerializer.Types.UseUserDefined =			true;
	objSerializer.Types.UseObjectsForUserDefined =	false;
	
	
	//Rules
	objSerializer.CheckInfiniteLoops =	true;
	objSerializer.MaxDepth =			null;
	
	objSerializer.Serialize(obj);
	
	return objSerializer.GetJSString(objname);
	//objSerializer.GetXMLString(objname);
	
	//make object
	//eval(frm.txaOut.value);
}


/*
* serializeObjToXML
* -- Creates XML string from js object
*/
function serializeObjToXML(obj, objname)
{	
	var objSerializer = new JSSerializer();
	
	//Prefs
	objSerializer.Prefs.SmartIndent =	true;
	objSerializer.Prefs.ShowLineBreaks =true;
	objSerializer.Prefs.ShowTypes =		true;
	
	//Types
	objSerializer.Types.UseNull =		true;
	objSerializer.Types.UseUndefined =	true;
	objSerializer.Types.UseArray =		true;
	objSerializer.Types.UseObject =		true;
	objSerializer.Types.UseBoolean =	true;
	objSerializer.Types.UseDate =		true;
	objSerializer.Types.UseError =		true;
	objSerializer.Types.UseFunction =	true;
	objSerializer.Types.UseNumber =		true;
	objSerializer.Types.UseRegExp =		true;
	objSerializer.Types.UseString =		true;
	objSerializer.Types.UseUserDefined =			true;
	objSerializer.Types.UseObjectsForUserDefined =	false;
	
	
	//Rules
	objSerializer.CheckInfiniteLoops =	true;
	objSerializer.MaxDepth =			null;
	
	objSerializer.Serialize(obj);
	
	//return objSerializer.GetJSString(objname);
	return objSerializer.GetXMLString(objname);
	
	//make object
	//eval(frm.txaOut.value);
}
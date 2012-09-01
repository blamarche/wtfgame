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

// V8Embedder.cpp : Defines the entry point for the console application.


#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include "../V8src/v8/include/v8.h"
#include "easyzlib.h"
#include "SDL/SDL.h"

#if defined( WIN32  ) // whatever the symbol is...
#include <windows.h>
#else
#include <sys/time.h>
#include <unistd.h>
#endif

#include "ExposeCurses.h"

#define		DEFAULT_CMD_OPTS	"--max_old_space_size=950000000"
#define		SCRMBL_KEY		0xFBC2

using namespace v8;


//encrypt string
//void scrmbl(char * str,int key)
//{
//    unsigned int i;
//    for(i=0;i<strlen(str);++i)
//    {
//          //if(str[i] != key) str[i] = str[i] - key;
//		if(str[i] != key) str[i] = str[i] ^ key;
//    }
//}

//decrypt string
void uscrmbl(char * str,int key)
{
    unsigned int i;
    for(i=0;i<strlen(str);++i)
    {
         //if(str[i] != key) str[i] = str[i] + key;
		if(str[i] != key) str[i] = str[i] ^ key;
    }
}


//getmstime
Handle<Value> getmstime(const Arguments& args) {	
	int32_t ms = args[0]->Int32Value();
	
	#if defined( WIN32  ) // whatever the symbol is...
		uint32_t t = GetTickCount();		
	#else
		struct timeval tv;
		if (gettimeofday(&tv,NULL)!=0)
			return Undefined();
		uint32_t t=(tv.tv_sec*1000)+(tv.tv_usec / 1000);
	#endif

	
	return Integer::NewFromUnsigned(t);
}

//pause thread, 100% cpu
Handle<Value> sleep_v8greedy(const Arguments& args) {	
	int32_t ms = args[0]->Int32Value();
	clock_t start=clock();
	while(clock() - start < ms);

	return Undefined();
}

//call sleep, free cpu
Handle<Value> sleep_v8(const Arguments& args) {	
	int32_t ms = args[0]->Int32Value();
	
	#if defined( WIN32  ) // whatever the symbol is...
		Sleep( ms );
	#else // whatever the symbol is...
		usleep( ms * 1000 );
	#endif

	return Undefined();
}

//read contents of file to strign, zlib decomp
Handle<Value> StringFromFileZlib(const Arguments& args) {
    for (int i = 0; i < args.Length(); i++) {
        String::Utf8Value str(args[i]);

        FILE *f = fopen(*str, "rb");
		if (f!=NULL)
		{
			fseek(f, 0, SEEK_END);
			long pos = ftell(f);
			fseek(f, 0, SEEK_SET);

			char * bytes = new char[pos];
			fread(bytes, pos, 1, f);
			fclose(f);

			ezbuffer bufsrc;
			ezbuffer bufdest;
			bufsrc.pBuf = (unsigned char *)bytes;
			bufsrc.nLen = pos;
			ezuncompress(bufdest, bufsrc);

			if(pos > 0) {
				const char * uncomp = new char[bufdest.nLen];
				strcpy((char *)uncomp, (const char *)bufdest.pBuf);
				Local<String> s = String::New(uncomp, bufdest.nLen);
				//delete bytes;
				delete uncomp;
				
				return s;
			}			
		}
    }
    return Undefined();
}

//read contents of file to strign with zlib compress
Handle<Value> StringToFileZlib(const Arguments& args) {    
	String::Utf8Value str(args[0]);
	String::Utf8Value str2(args[1]);
		
	ezbuffer bufdest;
	ezbuffer bufsrc;

	char * copy = new char[str2.length()];
	strcpy(copy,*str2);

	bufsrc.pBuf = (unsigned char *)(copy);
	bufsrc.nLen = str2.length();

	ezcompress(bufdest, bufsrc);

	FILE *fp;

	if((fp = fopen(*str, "wb"))!=NULL) {
		fwrite(bufdest.pBuf, 1, bufdest.nLen, fp);
		fclose(fp);			
	}
	//delete copy;
	return Undefined();
}

//read sdl title
Handle<Value> SetWindowTitle(const Arguments& args) {    
	String::Utf8Value str(args[0]);
	String::Utf8Value str2(args[1]);

	SDL_WM_SetCaption(*str, *str2);
	
	
	return Undefined();	
}

//read contents of file to strign
Handle<Value> StringToFile(const Arguments& args) {    
	String::Utf8Value str(args[0]);
	String::Utf8Value str2(args[1]);

	FILE *fp;

	if((fp = fopen(*str, "w"))!=NULL) {
		fputs(*str2, fp);
		fclose(fp);			
	}	
	return Undefined();	
}

//read contents of file to strign
Handle<Value> StringFromFile(const Arguments& args) {
    for (int i = 0; i < args.Length(); i++) {
        String::Utf8Value str(args[i]);

        FILE *f = fopen(*str, "rb");
		if (f!=NULL)
		{
			fseek(f, 0, SEEK_END);
			long pos = ftell(f);
			fseek(f, 0, SEEK_SET);

			char *bytes = (char*)malloc(pos);
			fread(bytes, pos, 1, f);
			fclose(f);

			if(pos > 0) {
				Local<String> s = String::New(bytes, pos);
				free(bytes); // free allocated memory
				return s;
			}
			free(bytes); // free allocated memory
		}
    }
    return Undefined();
}

//include js file
Handle<Value> Include(const Arguments& args) {
    for (int i = 0; i < args.Length(); i++) {
        String::Utf8Value str(args[i]);

        FILE *f = fopen(*str, "rb");
		if (f!=NULL)
		{
			fseek(f, 0, SEEK_END);
			long pos = ftell(f);
			fseek(f, 0, SEEK_SET);

			char *bytes = (char*)malloc(pos);
			fread(bytes, pos, 1, f);
			fclose(f);

			if(pos > 0) {
				//TryCatch try_catch;
				//try_catch.SetVerbose(true);
				printf("Running: %s\n", *str);

				Handle<String> source = String::New(bytes, pos);
				Handle<Script> script = Script::Compile(source);
				free(bytes);
				
				Handle<Value> v = script->Run();
				
				/*
				if (script.IsEmpty())
				{
						printf("Error in: %s\n", *str);
				}
				else
				{
					Handle<Value> v = script->Run();
					if (v.IsEmpty())
					{
					  //Handle<Message> message = try_catch.Message();
					  //if (message.IsEmpty() && try_catch.HasCaught())
					  //{
							printf("Error in: %s\n", *str);
					  //}else if (try_catch.HasCaught()){
						// Print line of source code.
					//	String::AsciiValue sourceline(message->GetSourceLine());					
					//	printf("Error in: %s\n", *str);
					//	printf("Error: %s\n", *sourceline);
					  //}
					} 
				}
				*/
				return Undefined();
			}
			free(bytes); // free allocated memory
		}
    }
    return Undefined();
}

//include jss file
Handle<Value> IncludeS(const Arguments& args) {
    for (int i = 0; i < args.Length(); i++) {
        String::Utf8Value str(args[i]);
		
        FILE *f = fopen(*str, "rb");
		if (f!=NULL)
		{
			fseek(f, 0, SEEK_END);
			long pos = ftell(f);
			fseek(f, 0, SEEK_SET);

			char *bytes = (char*)malloc(pos);
			fread(bytes, pos, 1, f);
			fclose(f);

			if(pos > 0) {            
				uscrmbl(bytes, SCRMBL_KEY);			
				Handle<String> source = String::New(bytes, pos);
				Handle<Script> script = Script::Compile(source);
				
				free(bytes);
				return script->Run();
			}
			free(bytes); // free allocated memory
		}
    }
    return Undefined();
}




//main func
int main(int argc, char* argv[])
{
	if (argc>2)
	{	
		V8::SetFlagsFromString(argv[2], strlen(argv[2]));
	}
	else
	{
		V8::SetFlagsFromString(DEFAULT_CMD_OPTS, 
						strlen(DEFAULT_CMD_OPTS));
	}
	HandleScope handle_scope;
	
	Handle<ObjectTemplate> global;
	global = ObjectTemplate::New();
	global->Set(String::New("include"), FunctionTemplate::New(Include));
	global->Set(String::New("include_s"), FunctionTemplate::New(IncludeS));
	global->Set(String::New("stringFromFile"), FunctionTemplate::New(StringFromFile));
	global->Set(String::New("stringFromFileZlib"), FunctionTemplate::New(StringFromFileZlib));
	global->Set(String::New("stringToFile"), FunctionTemplate::New(StringToFile));
	global->Set(String::New("stringToFileZlib"), FunctionTemplate::New(StringToFileZlib));
	global->Set(String::New("sleep"), FunctionTemplate::New(sleep_v8));
	global->Set(String::New("sleepgreedy"), FunctionTemplate::New(sleep_v8greedy));
	global->Set(String::New("getmstime"), FunctionTemplate::New(getmstime));
	global->Set(String::New("setwindowtitle"), FunctionTemplate::New(SetWindowTitle));

	cursesRegisterWithV8(global);

	Persistent<Context> context = Context::New(NULL, global);
	Context::Scope context_scope(context);	

	Handle<String> source = String::New("include('start.js')");
	if (argc>1){
		source = String::Concat(String::New("include('"), String::New(argv[1])); 
		source = String::Concat(source, String::New("')"));	
	}
	
	Handle<Script> script = Script::Compile(source);
	Handle<Value> result = script->Run();

	context.Dispose();
	return 0;
}

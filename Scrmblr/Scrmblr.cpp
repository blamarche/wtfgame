/*
WTF Scrmblr - Simple text scrambler
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

#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#define		SCRMBL_KEY		0xFBC2

void scrmbl(char * str,int key,int len)
{
    unsigned int i;
    for(i=0;i<len;++i)
    {
        //  if(str[i] != key) str[i] = str[i] - key;
		if(str[i] != key) str[i] = str[i] ^ key;
    }
}


int main(int argc, char* argv[])
{	
	
    // load_file loads the file with this name into a string,
    // I imagine you can write a function to do this :)
    FILE *f = fopen(argv[1], "rb");
	fseek(f, 0, SEEK_END);
	long pos = ftell(f);
	fseek(f, 0, SEEK_SET);

	char *bytes = (char*)malloc(pos);
	fread(bytes, pos, 1, f);
	fclose(f);

	scrmbl(bytes, SCRMBL_KEY, pos);
	//printf(bytes);
	
	FILE *fp;

	if((fp = fopen("output.jss", "wb"))!=NULL) {
		fwrite(bytes,pos , 1, fp);
		fclose(fp);			
	}	

        
	return 0;
}
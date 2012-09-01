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

//Expose pdcurses functions to v8


#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include "../V8src/v8/include/v8.h"

#if defined( WIN32  ) // whatever the symbol is...
#include "../pdcurses/curses.h"
#else
#include "../pdcurses/curses-lin.h"
#endif
#include "SDL/SDL.h"
using namespace v8;

//PDCurses for SDL definitions
extern "C" {
	PDCEX SDL_Surface *pdc_screen, *pdc_font, *pdc_icon, *pdc_back;
	PDCEX int pdc_sheight, pdc_swidth, pdc_yoffset, pdc_xoffset;
	/*void PDC_update_rects(void);
	void PDC_retile(void);*/
}


#define MAX_SPRITES 4096
SDL_Surface *pdc_sprites[MAX_SPRITES];


//Begin code
static WINDOW *mainwnd;
static WINDOW *screen;
WINDOW *my_win;


Handle<Value> UseColorPair(const Arguments& args) {	
	if (has_colors())
	{
		int32_t pair = args[0]->Int32Value();
		wcolor_set(screen,(short)pair,NULL);
	}
	return Undefined();
}

Handle<Value> move_cursor_v8(const Arguments& args) {	
	int32_t x = args[0]->Int32Value();
	int32_t y = args[1]->Int32Value();
	
	wmove(screen,y,x);
	return Undefined();
}

Handle<Value> CreateColorPair(const Arguments& args) {	
	if (has_colors())
	{
		int32_t pair = args[0]->Int32Value();
		int32_t fg = args[1]->Int32Value();
		int32_t bg = args[2]->Int32Value();

		init_pair((short)pair,(short)fg,(short)bg);
	}
	return Undefined();
}

Handle<Value> clear_screen_v8(const Arguments& args) {	
	
	SDL_Rect r;
	r.x =0;
	r.y=0;
	r.w = pdc_screen->w;
	r.h = pdc_screen->h;
	
	
	#if defined( WIN32  ) // whatever the symbol is...
	wclear(screen);
	#else
	wclear(screen);
	//SDL_FillRect(pdc_screen, &r, SDL_MapRGB(pdc_screen->format, 0, 0, 0));
	#endif
	
	return Undefined();
}

Handle<Value> draw_spritexy(const Arguments& args) {
	int32_t x = args[0]->Int32Value();
	int32_t y = args[1]->Int32Value();
	int32_t spritei = args[2]->Int32Value();

	if (spritei >= 0 && spritei < MAX_SPRITES && pdc_sprites[spritei])
	{
		/*
		SDL_Rect r;
		r.x = 0;
		r.y = 0;
		r.w = pdc_sprites[spritei]->w;
		r.h = pdc_sprites[spritei]->h;
		*/
		SDL_Rect r2;
		r2.x = x;
		r2.y = y;
		r2.w =  pdc_sprites[spritei]->w;
		r2.h =  pdc_sprites[spritei]->h;
		
		SDL_BlitSurface(pdc_sprites[spritei],&pdc_sprites[spritei]->clip_rect,pdc_screen,&r2);
	}
	return Undefined();
}

Handle<Value> getSpriteHeight(const Arguments& args) {
	int res = 0;
	
	if (args.Length()==0)
	{
		for (int i=0; i<MAX_SPRITES;i++)
			if (pdc_sprites[i]!=NULL){
				res = pdc_sprites[i]->h;
				break;
			}
	}else{
		int32_t i = args[0]->Int32Value();
		if (i >= 0 && i < MAX_SPRITES && pdc_sprites[i])
			res = pdc_sprites[i]->h;
	}

	return Integer::New(res);
}

Handle<Value> getSpriteWidth(const Arguments& args) {
	int res = 0;
	
	if (args.Length()==0)
	{
		for (int i=0; i<MAX_SPRITES;i++)
			if (pdc_sprites[i]!=NULL){
				res = pdc_sprites[i]->w;
				break;
			}
	}else{
		int32_t i = args[0]->Int32Value();
		if (i >= 0 && i < MAX_SPRITES && pdc_sprites[i])
			res = pdc_sprites[i]->h;
	}
	
	return Integer::New(res);
}

Handle<Value> load_sprite(const Arguments& args) {
	String::AsciiValue bmpname(args[1]);
	int32_t index = args[0]->Int32Value();
	
	if (index<MAX_SPRITES && index>=0){
		pdc_sprites[index] = SDL_LoadBMP(*bmpname);
		
		if (pdc_sprites[index]!=NULL){
			pdc_sprites[index] = SDL_DisplayFormat(pdc_sprites[index]);
			SDL_SetColorKey(pdc_sprites[index],SDL_SRCCOLORKEY, SDL_MapRGB(pdc_sprites[index]->format, 255,0,255));
			
			//printf("Loaded: %s\n",*bmpname);
		}
		else {
			printf("Err: %s\n", SDL_GetError());
		}
	}
	
	return Undefined();
}

Handle<Value> print_v8(const Arguments& args) {
	curs_set(0);
	String::AsciiValue str(args[0]);
	wprintw(screen,*str);

	return Undefined();
}

Handle<Value> printxy_v8(const Arguments& args) {
	curs_set(0);
	
	String::AsciiValue str(args[2]);
	int32_t x = args[0]->Int32Value();
	int32_t y = args[1]->Int32Value();

	mvwprintw(screen,y,x,*str);
	return Undefined();
}

Handle<Value> getScreenHeightPx_v8(const Arguments& args) {
	return Integer::New(pdc_screen->h);
}

Handle<Value> getScreenWidthPx_v8(const Arguments& args) {
	return Integer::New(pdc_screen->w);
}

Handle<Value> getMaxY_v8(const Arguments& args) {
	return Integer::New(getmaxy(screen));
}

Handle<Value> getMaxX_v8(const Arguments& args) {
	return Integer::New(getmaxx(screen));
}

Handle<Value> getch_v8(const Arguments& args) {
	return Integer::New(getch());
}

Handle<Value> refresh_noflip(const Arguments& args) {
	wrefresh(screen);
	//refresh();

	return Undefined();
}

Handle<Value> refresh_screen(const Arguments& args) {
	wrefresh(screen);
	//refresh();

	SDL_Flip(SDL_GetVideoSurface());

	return Undefined();
}

Handle<Value> screen_init(const Arguments& args) {
	mainwnd = initscr();
	
	noecho();
	cbreak();
	nodelay(mainwnd, TRUE);
	refresh(); // 1)
	wrefresh(mainwnd);
	screen = newwin(0, 0, 0, 0);
	//box(screen, ACS_VLINE, ACS_HLINE);
	keypad(mainwnd, true);
	keypad(screen, true);
	if (has_colors())
	{
		start_color();					
	}
	
	
	/*pdc_back = SDL_CreateRGBSurface(SDL_SWSURFACE | SDL_SRCCOLORKEY, pdc_screen->w, pdc_screen->h, pdc_screen->format->BitsPerPixel, 
							pdc_screen->format->Rmask, pdc_screen->format->Gmask,pdc_screen->format->Bmask,
							pdc_screen->format->Amask);*/

	//SDL_SetColorKey(pdc_font,SDL_SRCCOLORKEY,SDL_MapRGB(pdc_font->format, 0,0,0));

	return Undefined();
}

Handle<Value> screen_end(const Arguments& args) {
	endwin();
	return Undefined();
}

Handle<Value> flushinp_v8(const Arguments& args) {
	flushinp();
	return Undefined();
}


//Register function
void cursesRegisterWithV8(Handle<ObjectTemplate> context)
{
	context->Set(String::New("screen_init"), FunctionTemplate::New(screen_init));
	context->Set(String::New("screen_end"), FunctionTemplate::New(screen_end));
	
	context->Set(String::New("create_color_pair"), FunctionTemplate::New(CreateColorPair));
	context->Set(String::New("use_color_pair"), FunctionTemplate::New(UseColorPair));
	
	context->Set(String::New("move_cursor"), FunctionTemplate::New(move_cursor_v8));
	context->Set(String::New("get_max_x"), FunctionTemplate::New(getMaxX_v8));
	context->Set(String::New("get_max_y"), FunctionTemplate::New(getMaxY_v8));
	context->Set(String::New("getch"), FunctionTemplate::New(getch_v8));
	context->Set(String::New("flushinp"), FunctionTemplate::New(flushinp_v8));
	
	context->Set(String::New("clear_screen"), FunctionTemplate::New(clear_screen_v8));
	context->Set(String::New("refresh_screen"), FunctionTemplate::New(refresh_screen));
	context->Set(String::New("refresh_noflip"), FunctionTemplate::New(refresh_noflip));
	context->Set(String::New("print"), FunctionTemplate::New(print_v8));
	context->Set(String::New("printxy"), FunctionTemplate::New(printxy_v8));

	context->Set(String::New("draw_spritexy"), FunctionTemplate::New(draw_spritexy));
	context->Set(String::New("load_sprite"), FunctionTemplate::New(load_sprite));
	context->Set(String::New("get_screen_height"), FunctionTemplate::New(getScreenHeightPx_v8));
	context->Set(String::New("get_screen_width"), FunctionTemplate::New(getScreenWidthPx_v8));
	context->Set(String::New("get_sprite_width"), FunctionTemplate::New(getSpriteWidth));
	context->Set(String::New("get_sprite_height"), FunctionTemplate::New(getSpriteHeight));
}

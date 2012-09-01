#WTF game linux scons


#Program('wtfgame','./V8Embedder/V8Embedder.cpp',CCFLAGS="")
#Object('./V8Embedder/easyzlib.c')

Program('./release/wtfgame',['./V8Embedder/V8Embedder.cpp','./V8Embedder/easyzlib.c','./V8Embedder/ExposeCurses.cpp'],LIBS=['SDL', 'SDLmain', 'pdcurses', 'v8'], LIBPATH=['./pdcurses', './V8src/v8/tools/linux'], CCFLAGS="-lpthread", LDFLAGS="-lpthread")

from fastapi import FastAPI, APIRouter, HTTPException
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from routes import directories, contents, files
from database import Base, engine

Base.metadata.create_all(bind=engine)

api_router = APIRouter()

api_router.include_router(directories.router, prefix="/directories", tags=["Directories"])
api_router.include_router(contents.router, prefix="/contents", tags=["Contents"])
api_router.include_router(files.router, prefix="/files", tags=["Files"])

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

app.include_router(api_router, prefix="/api")

class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        try:
            return await super().get_response(path, scope)
        except (HTTPException, StarletteHTTPException) as ex:
            if ex.status_code == 404:
                return await super().get_response("index.html", scope)
            else:
                raise ex


app.mount("/", SPAStaticFiles(directory="out", html=True), name="spa-static-files")

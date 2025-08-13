let IS_PROD = true;
const server = IS_PROD 

    ?

    "https://zoom-clone-backend-970g.onrender.com/" 
    
    :

    "http://localhost:8000"


export default server;
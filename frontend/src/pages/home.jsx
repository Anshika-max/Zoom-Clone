import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent(){

    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");

    const {addToUserHistory} = useContext(AuthContext);
    let handleJoinVideoCall = async()=>{
        await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`);
    }
    return(
        <div>
            <div className="navBar">
                
                <div style={{ display: "flex", alignItems: "center",margin:"20px" }}>

                    <h1>Apna Video Call</h1>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={
                        () => {
                            navigate("/history")
                        }
                    }>
                        <RestoreIcon />
                    </IconButton>
                    <p>History</p>

                    &nbsp;&nbsp;&nbsp;

                    <Button style={{backgroundColor:"pink",color:"black",fontWeight:"bold"}} onClick={() => {
                        localStorage.removeItem("token")
                        navigate("/auth")
                    }}>
                        Logout
                    </Button>
                </div>


            </div>
            <div className="meetContainer">
                 <div className="leftPanel">
                    <div>
                        <h2>Providing Quality Video Call Just Like Quality Education</h2>
                        <br></br>
                        <div style={{ display: 'flex', gap: "10px" }}>

                            <TextField onChange={e => setMeetingCode(e.target.value)} id="outlined-basic" label="Meeting Code" variant="outlined" />
                            <Button onClick={handleJoinVideoCall} variant='contained'>Join</Button>

                        </div>
                    </div>
                </div>

                <div className='rightPanel'>
                    <img srcSet='/logo3.png' alt="" />
                </div>
            </div>
        </div>
    )
}

export default withAuth(HomeComponent);

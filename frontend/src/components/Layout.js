import React from 'react'
import { makeStyles } from '@mui/styles';
import { Drawer, Typography, ListItem, ListItemIcon, ListItemText, List} from '@mui/material';
import { useLocation, useNavigate} from 'react-router-dom';
import { AddCircleOutlineOutlined, SubjectOutlined } from '@mui/icons-material';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';


const drawerWidth = 240;

const useStyles = makeStyles({
    page: {
        paddingTop: '3%',
        paddingBottom: '3%',
        background: '#f9f9f9',
        width: '100%',
        height: '100%'
    },
    drawer: {
        width: drawerWidth,

    },
    drawPaper: {
        width: drawerWidth
    },
    root: {
        display: 'flex',
        position: 'absolute',
        bottom: 0,
        top: 0,
        right: 0,
        left: 0
    },
    active: {
        background: '#f4f4f4'
    },
    logout: {
        marginTop: 100,
    },
    navbar: {
        height: '100%'
    }

})


function Layout({children}) {

    const location = useLocation();
    const navigate = useNavigate();
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');


    const handleLogoutClick = async () => {
        try {
            const resp = await axios.post("/users/logout");
            console.log(resp);
            navigate("/login");
        } catch (err) {
            console.log(err.response.data)
        }
    }

    const menuItems = [
        {
            text: 'My bugs',
            icon: <SubjectOutlined color="secondary" />,
            path: '/'
        },
        {
            text: 'Create new bug',
            icon: <AddCircleOutlineOutlined color="secondary" />,
            path: '/create'
        }
    ]

    
    const loginNav = () => {
        if (location.pathname !== "/login" && location.pathname !== "/signup" &&
            location.pathname !== "/forgotpassword" && location.pathname.substring(0, location.pathname.lastIndexOf('/')) !== "/newpassword") {
            console.log(location.pathname);
            return <Drawer
            className={classes.drawer}
            variant="permanent"
            anchor="left"
            classes={{paper: classes.drawPaper}}
            >
                <div>
                    <Typography 
                    align='center'
                    variant='h6'
                    gutterBottom
                    mt={3}
                    >
                        Bug Tracker
                    </Typography>

                    <Typography 
                    align='center'
                    variant='h6'
                    gutterBottom
                    mt={3}
                    >
                        Welcome {name}
                    </Typography>

                </div>

                <List className={classes.navbar}>       
                    {menuItems.map(item => (
                        <ListItem 
                        key={item.text}
                        button
                        onClick={() => navigate(item.path)}
                        className={location.pathname === item.path ? classes.active : null}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text}/>
                        </ListItem>
                    ))}

                     { role === "admin" ?  <ListItem
                    className={classes.logout} 
                    onClick={() => navigate("/all")}
                    button
                    >
                        <ListItemIcon>
                            <AssignmentIcon color="secondary"/>
                        </ListItemIcon>
                        <ListItemText
                        >All bugs</ListItemText>
                    </ListItem>    : null }


                    { role === "admin" ?  <ListItem
                    className={classes.logout} 
                    onClick={() => navigate("/administrator")}
                    button
                    >
                        <ListItemIcon>
                            <SupervisorAccountIcon color="secondary"/>
                        </ListItemIcon>
                        <ListItemText
                        >Administrator</ListItemText>
                    </ListItem>    : null }

                    <ListItem
                    className={classes.logout} 
                    onClick={handleLogoutClick}
                    button
                    >
                        <ListItemIcon>
                            <LogoutIcon color="error"/>
                        </ListItemIcon>
                        <ListItemText
                        >Logout</ListItemText>
                    </ListItem>           
                </List>
            </Drawer>
        }
    }

   

    const classes = useStyles();

    return (
        <div className={classes.root}> 
            {loginNav()}    
            <div className ={classes.page}>       
                {children}       
            </div>

        </div>
    )
}

export default Layout
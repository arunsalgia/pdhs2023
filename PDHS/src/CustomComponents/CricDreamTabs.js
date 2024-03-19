import React, { useEffect, useState } from 'react';
//import { createBrowserHistory } from "history";
import { useHistory } from "react-router-dom";
import { useParams } from 'react-router-dom'
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import GroupIcon from '@material-ui/icons/Group';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu'; 
import {red, blue, green, deepOrange, white} from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';

import Dashboard from 'views/Dashboard/Dashboard'
import Directory from 'views/Directory/Directory'
import Member from 'views/Member/Member'
import Humad from 'views/Humad/Humad'
import Pjym from 'views/Pjym/Pjym'
import Prws from 'views/Prws/Prws'
import Admin from 'views/Admin/Admin'
import Application from 'views/Application/Application'

import Profile from "views/Profile/UserProfile" 
//import Home from "views/MED/Home.js";
//import UserApplication from "views/Application/UserApplication";


// only for admin
import Gotra from "views/Admin/Gotra";
import City from "views/Admin/City";
import Permissions from "views/Admin/Permissions";

import PDHSAdmin from "views/SuperUser/PDHSAdmin";


import Modal from 'react-modal';
// import download from 'js-file-downloader';
//import { BlankArea } from './CustomComponents';

import {
	ADMIN, 
} from "views/globals.js";

import {
  displayType, getWindowDimensions,
  cdRefresh, specialSetPos, upGradeRequired, isMobile, getAdminInfo,
  downloadApk, clearBackupData,
  checkIdle, setIdle,
  internalToText, textToInternal,
  vsDialog, handleLogout,
} from "views/functions.js"



const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : '#000000',
    color                 : '#FFFFFF',
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
	doctor: {
		fontSize: theme.typography.pxToRem(28),
    fontWeight: theme.typography.fontWeightBold,
    color: 'white',
		backgroundColor: green[800],
	},
	userName: {
		fontSize: theme.typography.pxToRem(24),
    fontWeight: theme.typography.fontWeightBold,
    color: 'white',
		marginLeft: theme.spacing(50),
	},
	ankit: {
		fontSize: theme.typography.pxToRem(22),
    fontWeight: theme.typography.fontWeightBold,
	},
  noSpacing: { 
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
  },
  menuButton: {
    // marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  icon : {
    color: '#FFFFFF',
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  statButton: {
    //marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  teamButton: {
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  visitButton: {
    // marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  new: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    color: '#FFFFFF'
  },
  whatIsNew: {
    backgroundColor: '#B3E5FC',
    color: '#000000',
    fontWeight: theme.typography.fontWeightBold,
  },
	divider: {
		backgroundColor: 'blue',
	},
  title: {
    flexGrow: 1,
		color: 'blue',
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		//paddingTop: theme.spacing(4),
    //paddingBottom: theme.spacing(4),
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
  },
	menuStyle: {
		paddingLeft: theme.spacing(2),
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,	
	},
  avatar: {
    margin: theme.spacing(0),
    // backgroundColor: theme.palette.secondary.main,
    // width: theme.spacing(10),
    // height: theme.spacing(10),
  
  },
  avatar1: {
    margin: theme.spacing(0),
    backgroundColor: deepOrange[500],
    color: theme.palette.getContrastText(deepOrange[500]), 
		//paddingLeft: theme.spacing(10),
    // width: theme.spacing(10),
    // height: theme.spacing(10),
		marginLeft: theme.spacing(6),
  },
}));

export function setTab(num) {
  
  //myTabPosition = num;
  console.log("Menu pos ", num);
  sessionStorage.setItem("menuValue", num);
  cdRefresh();
}

var hid = 0;
var mid = 0;
var currentSelection = "PRWS";

function setMenuHid(xxx) {
	sessionStorage.setItem("menuHid", xxx);	
}

function setMenuMid(xxx) {
	sessionStorage.setItem("menuMid", xxx);	
}

function setMenuCurrent(xxx) {
	sessionStorage.setItem("menuCurrentSelection", xxx);	
	cdRefresh();
}

export function setDisplayPage(item, hid, mid) {
	setMenuHid(hid);
	setMenuMid(mid);
	//setMenuCurrent(item);
	console.log(item);
	setTab(Number(item));
}


export function CricDreamTabs() {
  const gClasses = globalStyles();

	var adminInfo = getAdminInfo();
	const superAdmin = ((adminInfo & ADMIN.superAdmin) > 0);

  const history = useHistory();
  const classes = useStyles();
  // for menu 
  const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());
  const [dispType, setDispType] = React.useState("lg");

  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  // for group menu
  const [grpAuth, setGrpAuth] = React.useState(true);
  const [grpAnchorEl, setGrpAnchorEl] = React.useState(null);
  const grpOpen = Boolean(grpAnchorEl);
  const [arunGroup, setArunGroup] = React.useState(false);
	// check if mobile
	//const [itIsMobile, SetItIsMobile] = React.useState(isMobile());
	
  const [value, setValue] = React.useState(0);
  const [upgrade, setUpgrade] = React.useState(false);
  const [modalIsOpen,setIsOpen] = React.useState(true);
  const [userGroup, setUserGroup] = React.useState([]);
  const [latestApk, setLatestApk] = React.useState(null);

  //console.log(location.pathname);

	//const [currentSelection, setMenuCurrent] = useState("PRWS");
  useEffect(() => {       
    function handleResize() {
			let myDim = getWindowDimensions();
      setWindowDimensions(myDim);
      //console.log(displayType(myDim.width));
      setDispType(displayType(myDim.width));
		}
    const checkVersion = async () => {
      //console.log("about to call upgrade");
      let upg = await upGradeRequired();
      // console.log(upg);
      if (upg.latest) setLatestApk(upg.latest);

      setUpgrade(upg.status);
      if (upg.status) setIsOpen(true);
    }
		
    function InitMenuValue() {
      setValue(parseInt(sessionStorage.getItem("menuValue")));
      setIdle(false);
    }
    InitMenuValue();
		handleResize();
		window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    
}, []);


  //console.log(`in Tab function  ${sessionStorage.getItem("menuValue")}`);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  function ask_Logout_Confirm() {
	vsDialog("Logout", `Continue Logout?`,
		{label: "Yes", onClick: () => handleLogout() },
		{label: "No" }
		); 
	  
  }

  function handleGrpMenu(event) {
    setGrpAnchorEl(event.currentTarget);
    //console.log(event.currentTarget);
		setArunGroup(true);
  };

  async function handleGroupSelect(index) {
    setArunGroup(false);
    let gRec = userGroup[index];
    try {
      await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/setdefaultgroup/${localStorage.getItem("uid")}/${gRec.gid}`);
      localStorage.setItem("gid", gRec.gid);
      localStorage.setItem("groupName", gRec.groupName);
      localStorage.setItem("tournament", gRec.tournament);
      localStorage.setItem("admin", gRec.admin);
      clearBackupData();
      cdRefresh();
    } catch (e) {
      console.log(e);
      console.log("error setting default group");
    }
  }
  
  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleGrpClose = () => {
    setGrpAnchorEl(null);
    setArunGroup(false);
  };

  function setMenuValue(num) {
    setValue(num);
    handleClose();
    sessionStorage.setItem("menuValue", num);
  }


	const handleHome = () => { setMenuValue(1);  }
  
	const handleDashBoard= () => { handleClose(); setMenuValue(900);}
  const handleDirectory = () => { handleClose(); setMenuValue(901);}
	const handleHumad = () => { handleClose(); setMenuValue(902);}
	const handlePjym = () => { handleClose(); setMenuValue(903);}
	const handleFamily = () => { handleClose(); setMenuValue(904);}
	const handleApplication = () => { handleClose(); setMenuValue(905);}
	
	
  const handleGotra = () => { handleClose(); setMenuValue(1001);}
  const handleCity = () => { handleClose(); setMenuValue(1002);}
	const handlePermissions = () => { handleClose(); setMenuValue(951);}
	//const handleAdminApplication = () => { handleClose(); setMenuValue(1003);}
	
  function DisplayCdItems() {
		//console.log("CD Value", value);
    switch(value) {
      case 1: return <Prws />

      case 100: return <Member />;      // called directly from PJYM and Humad 
      case 900: return <Dashboard />;
			case 901: return <Prws />;
      case 902: return <Humad />;
			case 903: return <Pjym />;
			case 904: return <Member hid={Number(sessionStorage.getItem("menuHid"))} mid={Number(sessionStorage.getItem("menuMid"))} />;
			case 905: return <Application />;
			case 999: return <Application userType="user" />;
			
      case 1001: return <Gotra />;
      case 1002: return <City />;
			case 951: return <Permissions />;

      default: return <Dashboard />;
    }
  }

  async function handleUpgrade() {
    //console.log("upgrade requested");
    closeModal();
    await downloadApk();
    console.log("APK has to be downloaded");
  }

  function openModal() { setIsOpen(true); }
 
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
 
  function closeModal(){ setIsOpen(false); }

  function DisplayUpgrade() {
    //console.log(`Upgrate: ${upgrade} Menu Item:   ${value}`)
    // console.log("Current",process.env.REACT_APP_VERSION);
    if (upgrade)
      return(
        <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <Typography className={classes.new} align="center">
          Latest Version {latestApk.version}
        </Typography>
        <br />
        <Typography className={classes.new} align="center">
          What is new
        </Typography>
        <TextField variant="outlined" multiline fullWidth disabled
          id="producttext"
          // label="What is new" 
          className={classes.whatIsNew}
          defaultValue={latestApk.text} 
        />
        <br />
        <Button align="center" key="upgrade" variant="contained" color="primary" size="medium"
        className={classes.visitButton} onClick={handleUpgrade}>Update Now
        </Button>
      </Modal>
      )
    else
      return(null);
  }

  function DisplayGroupMenu() {
   //console.log("Group length");
	return (
	<div align="center" key="usergroups">
		<Typography className={classes.title}>{localStorage.getItem("userName")}</Typography>
		<Divider className={classes.divider} />
		<MenuItem onClick={handleProfile}>
		<Typography className={classes.menuStyle}>Profile</Typography>
		</MenuItem>
		<MenuItem onClick={handleChangePassword}>
		<Typography className={classes.menuStyle}>Change Password</Typography>
		</MenuItem>
		{(window.localStorage.getItem("userType") === "Doctor") &&
			<MenuItem onClick={handleWallet}>
			<Typography className={classes.menuStyle}>Wallet</Typography>
			</MenuItem>
		}
		<Divider className={classes.divider} />
		<MenuItem onClick={() => {handleClose(); ask_Logout_Confirm(); }}>
		<Typography className={classes.menuStyle}>Logout</Typography>
		</MenuItem>
	</div>
	)}

	function DisplayFunctionItem(props) {
	let itemName = props.item;
	return (
	<Grid key={"BUT"+itemName} item xs={4} sm={4} md={2} lg={2} >
	<Typography onClick={() => { setMenuHid(0);  setMenuMid(mid); setMenuCurrent(itemName)} }>
		<span 
			className={(itemName === currentSelection) ? gClasses.functionSelected : gClasses.functionUnselected}>
		{itemName}
		</span>
	</Typography>
	</Grid>
	)}
	
    
  let mylogo = `${process.env.PUBLIC_URL}/favicon.ico`;
  let groupCharacter="G";
  let currencyChar = '₹';
  let myName = localStorage.getItem("userName");
	
	//console.log("menuValue", localStorage.getItem("menuValue"));
	//console.log("value", value);
	//console.log("Is it Mobile", isMobile());
	
	hid = Number(sessionStorage.getItem("menuHid"));
	mid = Number(sessionStorage.getItem("menuMid"));
	currentSelection = sessionStorage.getItem("menuCurrentSelection");
	
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.noSpacing}>
        <Grid key="SUBMITMOBILE" container>
        <Grid align="left" item xs={6} sm={6} md={6} lg={6} >	
					<Typography>
						<span onClick={handleDashBoard}  className={classes.ankit} >{((dispType == "lg") || (dispType == "md")) ? "PRWS" : "PRWS"}</span>
							{/*<span style={{margin: "5px"}}  ><HomeIcon className={classes.icon} onClick={handleHome} /></span>*/}
					</Typography>
        </Grid>
        <Grid align="right" item xs={6} sm={6} md={6} lg={6} >	
          <Typography>
              <span className={gClasses.message16} style={{paddingRight: "5px"}} >{"Welcome "+  sessionStorage.getItem("firstName")}</span>
            <span style={{paddingTop: "10px"}} ><PowerSettingsNewIcon value={{size: 70 }}  onClick={ask_Logout_Confirm} /></span>
          </Typography>
        </Grid>
        </Grid>
		{(false) &&
					<div align="right">
					<Typography className={classes.ankit} style={{paddingRight: "5px"}} >{"Welcome "+sessionStorage.getItem("firstName")}</Typography>
					<Menu
            id="group-appbar"
            anchorEl={grpAnchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            // keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={arunGroup}
            onClose={handleGrpClose}
          >
            <DisplayGroupMenu />
          </Menu>
					</div>
					}
					{/*<Typography onClick={handleHome}>
						<span className={classes.userName}>{localStorage.getItem("userName")}</span>
					</Typography>*/}
			 </Toolbar>
      </AppBar>
			
			{/*<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
				<DisplayFunctionItem item="PRWS"  />
				<DisplayFunctionItem item="PJYM"  match={currentSelection}  onClick={() => setMenuCurrent("PJYM")} />
				<DisplayFunctionItem item="HUMAD"  match={currentSelection}  onClick={() => setMenuCurrent("HUMAD")} />
				<DisplayFunctionItem item="FAMILY"  match={currentSelection}  onClick={() => setMenuCurrent("FAMILY")} />
				<DisplayFunctionItem item="APPLICATION"  match={currentSelection}  onClick={() => setMenuCurrent("APPLICATION")} />
				<DisplayFunctionItem item="ADMIN"  match={currentSelection}  onClick={() => setMenuCurrent("ADMIN")} />
			</Grid>*/}
      {((false) && (dispType !== "lg") && (dispType !== "md")) &&
        <Typography align="center" >
            <span className={gClasses.message16Blue}>{"Welcome "+sessionStorage.getItem("firstName")}</span>
        </Typography>
      }
      <DisplayCdItems/>
      {/* <DisplayUpgrade/> 
			{ (currentSelection === "PRWS") && 
				<Prws />
			}
			{ (currentSelection === "PJYM") && 
				<Pjym />
			}
			{ (currentSelection === "HUMAD") && 
				<Humad />
			}
			{ (currentSelection === "FAMILY") && 
				<Member hid={hid} mid={mid} />
			}
			{ (currentSelection === "APPLICATION") && 
				<Application />
			}
			{ (currentSelection === "ADMIN") && 
				<Admin />
			}
			*/}
    </div>
  );
}
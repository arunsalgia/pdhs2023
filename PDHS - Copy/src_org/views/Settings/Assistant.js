import React, { useState, useContext, useEffect } from 'react';
import { makeStyles, Container, CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import axios from "axios";
import lodashSortBy from "lodash/sortBy";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel"
import IconButton from '@material-ui/core/IconButton';
import Grid from "@material-ui/core/Grid";

/*
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Modal from 'react-modal';
import { borders } from '@material-ui/system';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Datetime from "react-datetime";
*/
import "react-datetime/css/react-datetime.css";
import Drawer from '@material-ui/core/Drawer';
//import Avatar from "@material-ui/core/Avatar"
import { useAlert } from 'react-alert'
//import validator from 'validator'

// styles
import globalStyles from "assets/globalStyles";
//import modalStyles from "assets/modalStyles";
//import {dynamicModal } from "assets/dynamicModal";




import {DisplayPageHeader, ValidComp, BlankArea, DisplayYesNo,
DisplayUserDetails, 
} from "CustomComponents/CustomComponents.js"


// icons
//import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';

//colours 
import { 
red, blue, grey, yellow, orange, pink, green, brown, deepOrange, lightGreen, blueGrey, lime,
} from '@material-ui/core/colors';

import { 
	isMobile, 
	encrypt, decrypt, 
} from "views/functions.js";



const useStyles = makeStyles((theme) => ({
	
	root: {
		width: '100%',
	}, 
	selIndex: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	},
	slotTitle: {
		color: 'green',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		padding: "10px 10px", 
		margin: "10px 10px", 
	},
	unselIndex: {
		fontSize: theme.typography.pxToRem(14),
	},
	freeSlot: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		borderColor: 'blue',
		//backgroundColor: blue[300] 
	},
	usedSlot: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		borderColor: 'blue',
		backgroundColor: grey[500],
	},
	slotboxStyle: {
		borderColor: 'blue', 
		borderRadius: 7, 
		border: 1,
	},
	dateTime: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		backgroundColor: pink[100],
		align: 'center',
		width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeNormal: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		align: 'center',
		//width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeBlock: {
		color: 'blue',
		//fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		width: '40%'
	}, 
	info: {
			color: blue[700],
	}, 
	filterRadio: {
			fontSize: theme.typography.pxToRem(14),
			fontWeight: theme.typography.fontWeightBold,
			color: '#000000',	
	},
	switchText: {
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	}, 
		orange: {
			backgroundColor: orange[300],
			color: '#000000',
		},
    header: {
			color: '#D84315',
    }, 
    error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
		},
		editdelete: {
			marginLeft:  '50px',
			marginRight: '50px',
		},
		NoMedicines: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		radio: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: "blue",
		},
		medicine: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		modalHeader: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},
		messageText: {
			color: '#4CC417',
			fontSize: 12,
			// backgroundColor: green[700],
    },
    symbolText: {
        color: '#4CC417',
        // backgroundColor: green[700],
    },
    button: {
			margin: theme.spacing(0, 1, 0),
    },
		title: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700],
		},
    heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
		},
		accordianSummary: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			//backgroundColor: pink[100],
		},
		zeroAppt: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: pink[100],
		},
		normalAccordian: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: pink[100],
		},
		selectedAccordian: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: yellow[100],
		},
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
		noPadding: {
			padding: "none", 
		},
	apptName: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[700]
	},  
	newAppt: {
		backgroundColor: pink[100],
	},
	allAppt: {
		backgroundColor: blue[100],
	},
	select: {
		padding: "none", 
		backgroundColor: '#B3E5FC',
		margin: "none",
	},
	table: {
    //minWidth: 750,
  },
  td : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdPending : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		backgroundColor: blue[100],
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdCancel : {
		backgroundColor: pink[100],
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdVisit : {
		backgroundColor: lime[300],
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
	th: { 
		border: 5,
    align: "center",
    padding: "none",
		fontSize: theme.typography.pxToRem(13),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: '#FFA726',
		backgroundColor: deepOrange[200],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	wd: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: '#E0E0E0',
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	we: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: '#F8BBD0',
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	today: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: green[300],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	noday: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: blueGrey[300],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	ho: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: yellow[400],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
}));


var userCid;
var customerData;

export default function Assistant() {
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	//gClasses.drawerPaper.width = 300;
	
	const [userArray, setUserArray] = useState([]);
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	
	const [uid, setUid] = useState(0);
	const [userName, setUserName] = useState("");
	const [userMobile, setUserMobile] = useState(0);
	const [userEmail, setUserEmail] = useState("");

  useEffect(() => {	
		customerData = JSON.parse(sessionStorage.getItem("customerData"));
		userCid = sessionStorage.getItem("cid");
		
		const makeSlots  = async () => {
			// check all holidays			
		}
		getUsers();
  }, []);

	async function getUsers() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/getAssistant/${userCid}`;
			var resp = await axios.get(myUrl);
			//console.log(resp.data);
			setUserArray(resp.data);
		} catch (e) {
			console.log(e);
			setUserArray([]);
		}
	}


	async function handleCancel(usr) {
		vsDialog('Delete user',`Are you sure you want to delete user ${usr.displayName}?`,
			{label: "Yes", onClick: () => handleCancelConfirm(usr) },
			{label: "NO" }
		);	
	}
	
	async function handleCancelConfirm(usr) {		
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/deleteassistant/${userCid}/${usr.uid}`;
			var resp = await axios.get(myUrl);
			// success
			let tmp = userArray.filter(x => x.uid !== usr.uid);
			//console.log(tmp);
			setUserArray(tmp);
			alert.success("Successfully deleted user "+usr.displayName);;
		} catch (e) {
			console.log(e);
			alert.success("Error deleting user "+usr.displayName);
		}
			
	}
	
	function handleAdd() {
		setUserName("");
		setUserMobile(0);
		setUserEmail("");
		setIsDrawerOpened("ADD");
	}
	
	async function handleAddEditSubmit() {
		if (isDrawerOpened === "ADD") {
			try {
				let tmp = encrypt(userEmail);
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/addAssistant/${userCid}/${userName}/${tmp}/${userMobile}`;
				var resp = await axios.get(myUrl);
				console.log(resp.data); 	
				let tmpArray = [resp.data].concat(userArray);
				tmpArray = lodashSortBy(tmpArray, 'displayName');
				setUserArray(tmpArray);
				alert.success(`Successfully added user ${resp.data.displayName}`);
				setIsDrawerOpened("");
			}
			catch (e) {
				console.log(e);
				alert.error("Error adding user "+userName);
			}
		} else if (isDrawerOpened === "EDIT") {
			try {
				let tmp = encrypt(userEmail);
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/updateAssistant/${userCid}/${uid}/${userName}/${tmp}/${userMobile}`;
				var resp = await axios.get(myUrl);
				console.log(resp.data); 	
				let tmpArray = userArray.filter(x => x.uid !== resp.data.uid);
				tmpArray.push(resp.data)
				tmpArray = lodashSortBy(tmpArray, 'displayName');
				setUserArray(tmpArray);
				alert.success(`Successfully updated user ${resp.data.displayName}`);
				setIsDrawerOpened("");
			}
			catch (e) {
				console.log(e);
				alert.error("Error adding user "+userName);
			}
		}

		
	}
	
	function handleEdit(usr) {
		setUid(usr.uid);
		setUserName(usr.displayName);
		setUserMobile(usr.mobile);
		setUserEmail(decrypt(usr.email));
		setIsDrawerOpened("EDIT");
	}
	
	
	function DisplayUsers() {
	return (
	<Grid className={gClasses.noPadding} key="Appt" container alignItems="center" >
	{userArray.map( (a, index) => 
		<Grid key={"HOL"+index} item xs={12} sm={6} md={3} lg={3} >
		{(sessionStorage.getItem("userType") === "Doctor") &&
			<DisplayUserDetails 
				user={a} 
				button1={
					<IconButton color={'primary'} size="small" onClick={() => { handleEdit(a)}}  >
						<EditIcon />
					</IconButton>
				}
				button2={
					<IconButton color={'secondary'} size="small" onClick={() => { handleCancel(a)}}  >
						<CancelIcon />
					</IconButton>
				}
			/>
		}
		{(sessionStorage.getItem("userType") !== "Doctor") &&
			<DisplayUserDetails 
				user={a} 
			/>
		}
		</Grid>
	)}
	</Grid>	
	)}
	
	

	return (
	<div className={gClasses.webPage} align="center" key="main">
	<DisplayPageHeader headerName="Configure Users" groupName="" tournament=""/>
	<Container component="main" maxWidth="lg">
	<CssBaseline />
	</Container>
	{(sessionStorage.getItem("userType") === "Doctor") &&
		<VsButton name="Add new user" align="right" onClick={handleAdd} />
	}
	<DisplayUsers />
	<Drawer
		open={isDrawerOpened !== ""}
		anchor="right"
		variant="temporary"
		classes={{
			paper: gClasses.drawerPaper,
		}}
	>
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
	<ValidatorForm align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}>
		<Typography align="center" className={classes.modalHeader}>
		{(isDrawerOpened === "ADD") ? "New User" : "Edit User"}
		</Typography>
		<TextValidator fullWidth  required type="text" className={gClasses.vgSpacing}
			label="User Name" 
			value={userName}
			onChange={() => { setUserName(event.target.value) }}
			validators={["noSpecialCharacters"]}
			errorMessages={['Special characters not permitted']}
		/>
		<TextValidator fullWidth  required type="email" className={gClasses.vgSpacing}
			label="User Email" 
			value={userEmail}
			onChange={() => { setUserEmail(event.target.value) }}
		/>
		<TextValidator fullWidth  required type="number" className={gClasses.vgSpacing}
			label="User Mobile" 
			value={userMobile}
			onChange={() => { setUserMobile(event.target.value) }}
			validators={["minNumber:1111111111)", "maxNumber:9999999999)"]}
				errorMessages={['Invalid mobile number', 'Invalid mobile number']}
		/>
		<VsButton type="submit" name={(isDrawerOpened === "ADD") ? "Add" : "Update"} />
		<ValidComp />
	</ValidatorForm>
	</Box>
	</Drawer>
  </div>
  );    
}
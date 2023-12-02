import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import axios from "axios";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import Modal from 'react-modal';
import Box from '@material-ui/core/Box';
import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import Drawer from '@material-ui/core/Drawer';


import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Select from "@material-ui/core/Select";
import Link from '@material-ui/core/Link';
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Typography from '@material-ui/core/Typography';

import { getImageName, vsDialog } from "views/functions.js"
import {DisplayPageHeader, ValidComp, BlankArea, DisplayMedicineDetails} from "CustomComponents/CustomComponents.js"

// styles
import globalStyles from "assets/globalStyles";
import {dynamicModal } from "assets/dynamicModal";

// icons
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import CancelIcon from '@material-ui/icons/Cancel';

import {red, blue, yellow, orange } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
// import {setTab} from "CustomComponents/CricDreamTabs.js"

const AVATARHEIGHT=4;
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    }, 
		medicineName: {
			fontSize: theme.typography.pxToRem(16),
			fontWeight: theme.typography.fontWeightBold,	
			color: 'blue',
		},
		medicineInfo: {
			fontSize: theme.typography.pxToRem(14),
		},
		switchText: {
			fontSize: theme.typography.pxToRem(14),
			fontWeight: theme.typography.fontWeightBold,
    }, 
    info: {
			backgroundColor: yellow[500],	
			color: blue[700],
			height: theme.spacing(AVATARHEIGHT),
			width: theme.spacing(AVATARHEIGHT),
			fontSize: '12px',
			fontWeight: theme.typography.fontWeightBold,
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
    }, 
		noinfo: {
			backgroundColor: '#FFFFFF',	
			color: '#000000',
			height: theme.spacing(AVATARHEIGHT),
			width: theme.spacing(AVATARHEIGHT),
			fontSize: '12px',
			fontWeight: theme.typography.fontWeightBold,
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
		},       
    td : {
			border: 5,
			align: "center",
			padding: "none",
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
			backgroundColor: '#00E5FF',
		},
		th : {
			border: 5,
			align: "center",
			padding: "none",
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
			backgroundColor: '#FF7043',
		},
		header: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
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
			paddings: '20px',
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
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }));

const ROWSPERPAGE=10;
const BOTTONCOL=13;

const ALPHABETSTR = [
"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
"U", "V", "W", "X", "Y", "Z"
];

const NUMBERINT=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const addEditModal = dynamicModal('60%');

let searchText = "";
function setSearchText(sss) { searchText = sss;}


var userCid; 

export default function Medicine() {
  const classes = useStyles();
	const gClasses = globalStyles();
	
	const [medicineMasterArray, setMedicineMasterArray] = useState([]);
	const [medicineArray, setMedicineArray] = useState([]);
	const [isDrawerOpened, setIsDrawerOpened] = useState(false);
	const [isAdd, setIsAdd] = useState(false);
	const [radioValue, setRadioValue] = useState("Male");

	const [newMedicine, setNewMedicine] = useState(false);
	
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [oldMedicineName, setOldMedicineName] = useState("");
	const	[medicineName, setMedicineName] = useState("");
	const [medicineDesc, setMedicineDesc] = useState("");
	const [medicinePrecaution, setMedicinePrecaution] = useState("");

	

  useEffect(() => {
		const us = async () => {
			let mmm = await getAllMedicines();
			setMedicineArray(mmm);
			setMedicineMasterArray(mmm);
		}
		userCid = sessionStorage.getItem("cid");
		us();
  }, [])


	async  function getAllMedicines() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/list/${userCid}`;
			let resp = await axios.get(myUrl);
			return resp.data;
		} catch (e) {
			return [];
		}	
	}
	
	
	function ShowResisterStatus() {
	//console.log(`Status is ${registerStatus}`);
	let myMsg = "";
	switch (registerStatus) {
		case 601:
			myMsg = "New medicine already in database";
			break;
		case 611:
			myMsg = "Medicine name not found in database";
			break;
	}
	return(
      <div align="center"><Typography className={gClasses.error}>{myMsg}</Typography></div>
	)}
	
	async function handleAddEditSubmit() {
		let myUrl;
		let resp;
		if (isAdd) {
			try {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/add/${userCid}/${medicineName}/${medicineDesc}/${medicinePrecaution}`;
				await axios.get(myUrl);
			} catch (e) {
				console.log(e);
				setRegisterStatus(e.response.status);
				return;
			}
		} else {
			try {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/edit/${userCid}/${oldMedicineName}/${medicineName}/${medicineDesc}/${medicinePrecaution}`;
				await axios.get(myUrl);
				// now successfully updated. come out of if then 
			} catch (e) {
				console.log(e);
				setRegisterStatus(e.response.status);
				return;
			}
		}
		setIsDrawerOpened(false);
		
		let mmm = await getAllMedicines();
		setMedicineMasterArray(mmm);
		setFilter(mmm, searchText);
	}
	
	function handleAdd() {
		setMedicineName("");
		setMedicineDesc("");
		setMedicinePrecaution("")
		
		setRegisterStatus(0);
		setIsAdd(true);
		setIsDrawerOpened(true);
	}
	
	function handleEdit(rec) {
		setOldMedicineName(rec.name);
		setMedicineName(rec.name);		
		setMedicineDesc(rec.description);
		setMedicinePrecaution(rec.precaution);

		setRegisterStatus(0);
		setIsAdd(false);
		setIsDrawerOpened(true);
	}

	async function handleCancel(rec) {
		vsDialog('Delete Medicine',`Are you sure you want to delete medicine ${rec.name}?`,
			{label: "Yes", onClick: () => handleCancelConfirm(rec) },
			{label: "NO" }
		);
	}
	

	async function handleCancelConfirm(rec) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/delete/${userCid}/${rec.name}`;
			await axios.get(myUrl);
			let tmpArray = [].concat(medicineMasterArray);
			tmpArray = tmpArray.filter(x => x.name !== rec.name);
			setMedicineMasterArray(tmpArray);
			tmpArray = [].concat(medicineArray);
			tmpArray = tmpArray.filter(x => x.name !== rec.name);
			setMedicineArray(tmpArray);
		} catch(e) {
			console.log(e);
		}
	}
	
		
	function DisplayAllMedicines() {
	return (
	<Grid className={gClasses.noPadding} key="AllMedicine" container alignItems="center" >
	{medicineArray.map( (m, index) => 
		<Grid key={"MEDITEM"+index} item xs={12} sm={6} md={3} lg={3} >
		<DisplayMedicineDetails 
			medicine={m} 
			button1={
				<IconButton className={gClasses.blue} size="small" onClick={() => {handleEdit(m)}}  >
					<EditIcon  />
				</IconButton>
			}
			button2={
				<IconButton color="secondary" size="small" onClick={() => {handleCancel(m)}}  >
					<CancelIcon />
				</IconButton>
			}
		/>
		</Grid>
	)}
	</Grid>	
	)}
	
	function setFilter(myArray, filterStr) {
		filterStr = filterStr.trim().toLowerCase();
		let tmpArray = myArray.filter(x => x.name.toLowerCase().includes(filterStr));
		setMedicineArray(tmpArray);
	}
	
	function filterMedicine(filterStr) {
		setSearchText(filterStr);
		setFilter(medicineMasterArray, filterStr);
	}
	
  return (
  <div className={gClasses.webPage} align="center" key="main">
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		<DisplayPageHeader headerName="Medicine Directory" groupName="" tournament=""/>
		<BlankArea />
		<Grid className={gClasses.vgSpacing} key="MedicineFilter" container alignItems="center" >
			<Grid key={"F1"} item xs={false} sm={false} md={2} lg={2} />
			<Grid key={"F2"} item xs={12} sm={12} md={4} lg={4} >
			<TextField id="filter"  padding={5} fullWidth label="Search Medicine by name" 
				defaultValue={searchText}
				onChange={(event) => filterMedicine(event.target.value)}
				InputProps={{endAdornment: (<InputAdornment position="end"><SearchIcon/></InputAdornment>)}}
			/>
			</Grid>
			<Grid key={"F4"} item xs={8} sm={8} md={3} lg={3} >
				<Typography>Click button to add new Medicine</Typography>
			</Grid>
			<Grid key={"F5"} item xs={4} sm={4} md={2} lg={2} >
				<VsButton name="New Medicine" onClick={handleAdd} />
			</Grid>
			<Grid key={"F6"} item xs={false} sm={false} md={1} lg={1} />
		</Grid>
		<DisplayAllMedicines />
		<Drawer className={classes.drawer}
			anchor="right"
			variant="temporary"
			open={isDrawerOpened}
		>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened(false)}} />
		<ValidatorForm align="center" className={classes.form} onSubmit={handleAddEditSubmit}>
			<Typography className={gClasses.title}>{(isAdd) ? "Add Medicine" : "Edit Medicine"}</Typography>
			<TextValidator fullWidth  className={gClasses.vgSpacing}
				id="newPatientName" label="Name" type="text"
				value={medicineName} 
				onChange={() => { setMedicineName(event.target.value) }}
      />
			<TextValidator  fullWidth className={gClasses.vgSpacing}
				id="newPatientAge" label="Description"
				value={medicineDesc}
				onChange={() => { setMedicineDesc(event.target.value) }}			
      />
			<TextValidator   fullWidth   className={gClasses.vgSpacing} 
				id="newPatientEmail" label="Precaution"
				value={medicinePrecaution} 
				onChange={() => { setMedicinePrecaution(event.target.value) }}
      />
			<ShowResisterStatus />
			<BlankArea />
			<VsButton name={(isAdd) ? "Add" : "Update"} />
			</ValidatorForm>    		
			</Box>
		</Drawer>
		</Container>
  </div>
  );    
}


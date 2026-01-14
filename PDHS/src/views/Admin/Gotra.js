import React,{useState, useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import axios from 'axios';
import Container from '@material-ui/core/Container';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';


import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsRadio from "CustomComponents/VsRadio";


import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, InputAdornment } from "@material-ui/core";

import Drawer from '@material-ui/core/Drawer';
//import { useAlert } from 'react-alert'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import lodashSortBy from 'lodash/sortBy';
import lodashUniqBy from 'lodash/uniqBy';

// icons
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

// styles
import globalStyles from "assets/globalStyles";


import {
	DisplayPageHeader, ValidComp, BlankArea,
	DisplayApplicationName,
} from "CustomComponents/CustomComponents.js"


import { 
	vsDialog,
	showError, showSuccess, showInfo,
	getAdminInfo, getAdminRec,
} from "views/functions.js";

import {
  PADSTYLE,
  ADMIN,
} from "views/globals.js";

const ROWSPERPAGE = 10;

export default function Gotra() {
	const gClasses = globalStyles();
	//const alert = useAlert();
	
  const [gotraArray, setGotraArray] = useState([]);	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [rename, setRename] = useState(false);

	const [editGotraRec, setEditGotraRec] = useState(null);
	
	const [page, setPage] = useState(0);
	
	const [filterText, setFilterText] = useState("");
	
	const [emurName, setEmurName] = useState("");
	const [emurOrigName, setEmurOrigName] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);

   var tmp = getAdminRec();
   const hasEditPerm = tmp.superAdmin || tmp.superduper;
   //console.log(tmp);
	//console.log(hasEditPerm);
   
  useEffect(() => {		
		getAllGotras();
  }, []);

	async  function getAllGotras() {
		try {
			// First get gotra list from database
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/gotra/list`;
			let resp = await axios.get(myUrl);
			setGotraArray(resp.data);
		
		} catch (e) {
			setGotraArray([]);
		}	
	}
		
	function ShowResisterStatus() {
		let myMsg = "";
		switch (registerStatus) {
			case 0:  myMsg = ""; break;
			case 1001: myMsg = "Blank Gotra name"; break;
			case 1002: myMsg = "Duplicate Gotra name"; break;
			case 1004: myMsg = "Gotra not selected from existing list."; break;
			default:  myMsg = "Unknown error"; break;
		}
		return (
		<div>
			<Typography className={(registerStatus != 0) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
		</div>
		);
	}
	

	function addGotra() {
		setRegisterStatus(0); 
		setEmurName("")
		setIsDrawerOpened("ADD");  
	}
	
	function editGotra(gotraRec) {
		setRegisterStatus(0);
		setRename(false);
		setEmurName(gotraRec.gotra); 
		setEmurOrigName(gotraRec.gotra);
		setEditGotraRec(gotraRec);
		
    //console.log(gotraRec.gotra);
		setIsDrawerOpened("EDIT");  
	}
	
	async function  addGotraSubmit()  {
		let newName = emurName.trim().toLowerCase();
		if (newName.length === 0) return  setRegisterStatus(1001);	
		// for blank and duplicate
		if (gotraArray.find(x => x.gotra.toLowerCase() === newName)) return setRegisterStatus(1002);
		// checked for blank and duplicate. Now ask backedn to update
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/gotra/add/${newName}`;
			let resp = await axios.get(myUrl);
			showSuccess(`Successfully added Gotra ${resp.data.gotra} to database.`);
			let tmpArray = gotraArray.concat([resp.data]);
			setGotraArray(lodashSortBy(tmpArray, 'gotra'));
		} catch (e) {
			console.log(e);
			showError("Error adding new Gotra to database");
		}
		setIsDrawerOpened("");
	};
  
		
	async function  editGotraSubmit()  {
		// check for blank and duplicate (if not rename to existing)
		var newGotraName = "";
		if (rename) {
			//console.log(editGotraRec);
			if (!editGotraRec) return setRegisterStatus(1004);
			let tmp =  gotraArray.find(x => x.gotra === editGotraRec.gotra);
			newGotraName = tmp.gotra.toLowerCase();
		} else {
			newGotraName = emurName.trim().toLowerCase();
			if (newGotraName.length === 0) return setRegisterStatus(1001);
			// if not rename to existing, new name must not be defined
			let tmp =  gotraArray.find(x => x.gotra.toLowerCase() === newGotraName);
			if (tmp) return setRegisterStatus(1002);
		}
		setIsDrawerOpened("");
		
		let subcmd = (rename) ? "renametoexisting" : "renametonew"
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/gotra/${subcmd}/${emurOrigName.toLowerCase()}/${newGotraName}`;
			let resp = await axios.get(myUrl);
			// remove the entry of old gotra name
			let tmpArray = gotraArray.filter(x => x.gotra.toLowerCase() !== emurOrigName.toLowerCase());
			if (subcmd !== "renametoexisting") {
				tmpArray = tmpArray.concat([resp.data]);
			}
			setGotraArray(lodashSortBy(tmpArray, 'gotra'));
			showSuccess(`Successfully renamed Gotra ${emurOrigName} to ${resp.data.gotra} in database.`);
		} catch (e) {
			console.log(e);
			showError("Error renaming gotra");
		}
	};
	

	function delGotra(gotraRec) {
		vsDialog("Delete Gotra", `Are you sure you want to delete gotra "${gotraRec.gotra}"?`,
		{label: "Yes", onClick: () => handleDelGotraConfirm(gotraRec) },
		{label: "No" }
		);
	}
	
	async function handleDelGotraConfirm(gotraRec) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/gotra/delete/${gotraRec.gotra}`;
			let resp = await axios.get(myUrl);
			setGotraArray(gotraArray.filter(x => x.gotra !== gotraRec.gotra));
			showSuccess(`Successfully deleted Gotra ${gotraRec.gotra} from database`);
		} catch (e) {
			console.log(e);
			showError(`Gotra ${gotraRec.gotra} is used in members record. Cannot delete`);
		}
		//setIsDrawerOpened("");
	}

	function DisplayAllGotras() {
	return (
	<Grid key="AllDOCS" container>
	{gotraArray.map( (d, index) => 
		<Grid align="left" key={"GOTRAALL"+index} item xs={12} sm={6} md={3} lg={3} >
			<Box style={{margin: "2px" }}  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Typography >
			<span style={{paddingLeft: "8px" }} align="left" className={gClasses.patientInfo2}>{d.gotra+" "}</span>
         {(hasEditPerm) &&
			<span align="right">
            <EditIcon color="primary" size="small" onClick={() => {editGotra(d)}} />
            <DeleteIcon color="primary" size="small" onClick={() => {delGotra(d)}} />
			</span>
         }
			</Typography>
			</Box>
		</Grid>
	)}
	</Grid>
	)}

	// pagination function 
	const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

	return (
		<div className={gClasses.webPage} align="center" key="main">
		<CssBaseline />
		<DisplayPageHeader headerName="Gotra Database" groupName="" tournament=""/>
		<VsButton align="right" disabled={!hasEditPerm} name="Add new Gotra" onClick={addGotra} />	
		<DisplayAllGotras />
		<Drawer anchor="top" variant="temporary" open={isDrawerOpened !== ""}>
		<Container component="main" maxWidth="xs">	
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "20px", paddingRight: "20px"}} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
		{(isDrawerOpened === "ADD") &&   
			<ValidatorForm className={gClasses.form} onSubmit={addGotraSubmit}>
			<Typography className={gClasses.title}>New Gotra</Typography>
			<br />
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				label="Name of the Gotra" type="text"
				value={emurName}
				onChange={(event) => { setEmurName(event.target.value) }}
				validators={['noSpecialCharacters']}
				errorMessages={['Special characters not permitted']}
			/>
			<ShowResisterStatus/>
			<BlankArea />
			<VsButton align="center" name={"Add"} />
			<ValidComp />  			
			</ValidatorForm>
		}
		{(isDrawerOpened === "EDIT") &&   
			<ValidatorForm className={gClasses.form} onSubmit={editGotraSubmit}>
			<Typography>
				<span className={gClasses.patientInfo2Brown} >Edit Gotra: </span>
				<span className={gClasses.title}>{emurOrigName}</span>
			</Typography>
			<DisplayApplicationName name={`(All member records having Gotra as ${emurOrigName} will get updated with the new value)`} value="" style={{paddingTop: "5px" }}  />
			<VsCheckBox align="left" label="Rename to existing" checked={rename} onClick={() => setRename(!rename)} />
			<br />
			{(false && rename) &&
				<Grid key="AllGOtra" container >
					{gotraArray.map( (d, index) => 
						<Grid align="left" key={"GOTRAALL"+index} item xs={12} sm={6} md={2} lg={2} >
							<VsRadio align="left" label={d.gotra} checked={d.gotra === emurName} onClick={(event) => setEmurName(d.gotra) }	/>
						</Grid>
					)}
				</Grid>
			}
			{(rename) &&
				<Autocomplete
				disablePortal
				id="HODNAME"
				defaultValue={editGotraRec}
				onChange={(event, values) => setEditGotraRec(values) }
				style={{paddingTop: "10px" }}
				getOptionLabel={(option) => option.gotra || ""}
				options={gotraArray}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} />}
				/>
			}
			{(!rename) &&
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				label="Name of the Gotra" type="text"
				value={emurName}
				onChange={(event) => { setEmurName(event.target.value) }}
				validators={['noSpecialCharacters']}
				errorMessages={['Special characters not permitted']}
			/>			
			}
			<ShowResisterStatus/>
			<br />
			<VsButton align="center" name={"Update"} />
			<ValidComp />  			
			</ValidatorForm>
			}
		<br />
		<br />
		<br />
		<br />
		</Box>
		</Container>
		</Drawer>
		<ToastContainer />
		</div>
	);
}
 
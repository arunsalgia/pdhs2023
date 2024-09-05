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

// styles
import globalStyles from "assets/globalStyles";


import {
	DisplayPageHeader, ValidComp, BlankArea,
	DisplayApplicationName,
} from "CustomComponents/CustomComponents.js"


import { 
	vsDialog,
	showError, showSuccess, showInfo,
} from "views/functions.js";

import {
  PADSTYLE,
} from "views/globals.js";

const ROWSPERPAGE = 10;

export default function Country() {
	const gClasses = globalStyles();
	//const alert = useAlert();
	
  const [countryArray, setCountryArray] = useState([]);	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [rename, setRename] = useState(false);

	const [editCountryRec, setEditCountryRec] = useState(null);
	
	const [page, setPage] = useState(0);
	
	const [filterText, setFilterText] = useState("");
	
	const [emurName, setEmurName] = useState("");
	const [emurOrigName, setEmurOrigName] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);


	
  useEffect(() => {		
		getAllCountries();
  }, []);

	async  function getAllCountries() {
		try {
			// First get country list from database
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/country/list`;
			let resp = await axios.get(myUrl);
			setCountryArray(resp.data);
		
		} catch (e) {
			setCountryArray([]);
		}	
	}
		
	function ShowResisterStatus() {
		let myMsg = "";
		switch (registerStatus) {
			case 0:  myMsg = ""; break;
			case 1001: myMsg = "Blank Country name"; break;
			case 1002: myMsg = "Duplicate Country name"; break;
			case 1004: myMsg = "Country not selected from existing list."; break;
			default:  myMsg = "Unknown error"; break;
		}
		return (
		<div>
			<Typography className={(registerStatus != 0) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
		</div>
		);
	}
	

	function addCountry() {
		setRegisterStatus(0); 
		setEmurName("")
		setIsDrawerOpened("ADD");  
	}
	
	function editCountry(countryRec) {
		setRegisterStatus(0);
		setRename(false);
		setEmurName(countryRec.country); 
		setEmurOrigName(countryRec.country);
		setEditCountryRec(countryRec);
		
    //console.log(countryRec.country);
		setIsDrawerOpened("EDIT");  
	}
	
	async function  addCountrySubmit()  {
		let newName = emurName.trim().toLowerCase();
		if (newName.length === 0) return  setRegisterStatus(1001);	
		// for blank and duplicate
		if (countryArray.find(x => x.country.toLowerCase() === newName)) return setRegisterStatus(1002);
		// checked for blank and duplicate. Now ask backedn to update
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/country/add/${newName}`;
			let resp = await axios.get(myUrl);
			showSuccess(`Successfully added Country ${resp.data.country} to database.`);
			let tmpArray = countryArray.concat([resp.data]);
			setCountryArray(lodashSortBy(tmpArray, 'country'));
		} catch (e) {
			console.log(e);
			showError("Error adding new Country to database");
		}
		setIsDrawerOpened("");
	};
  
		
	async function  editCountrySubmit()  {
		// check for blank and duplicate (if not rename to existing)
		var newCountryName = "";
		if (rename) {
			//console.log(editCountryRec);
			if (!editCountryRec) return setRegisterStatus(1004);
			let tmp =  countryArray.find(x => x.country === editCountryRec.country);
			newCountryName = tmp.country.toLowerCase();
		} else {
			newCountryName = emurName.trim().toLowerCase();
			if (newCountryName.length === 0) return setRegisterStatus(1001);
			// if not rename to existing, new name must not be defined
			let tmp =  countryArray.find(x => x.country.toLowerCase() === newCountryName);
			if (tmp) return setRegisterStatus(1002);
		}
		setIsDrawerOpened("");
		
		let subcmd = (rename) ? "renametoexisting" : "renametonew"
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/country/${subcmd}/${emurOrigName.toLowerCase()}/${newCountryName}`;
			let resp = await axios.get(myUrl);
			// remove the entry of old country name
			let tmpArray = countryArray.filter(x => x.country.toLowerCase() !== emurOrigName.toLowerCase());
			if (subcmd !== "renametoexisting") {
				tmpArray = tmpArray.concat([resp.data]);
			}
			setCountryArray(lodashSortBy(tmpArray, 'country'));
			showSuccess(`Successfully renamed Country ${emurOrigName} to ${resp.data.country} in database.`);
		} catch (e) {
			console.log(e);
			showError("Error renaming country");
		}
	};
	

	function delCountry(countryRec) {
		vsDialog("Delete Country", `Are you sure you want to delete country "${countryRec.country}"?`,
		{label: "Yes", onClick: () => handleDelCountryConfirm(countryRec) },
		{label: "No" }
		);
	}
	
	async function handleDelCountryConfirm(countryRec) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/country/delete/${countryRec.country}`;
			let resp = await axios.get(myUrl);
			setCountryArray(countryArray.filter(x => x.country !== countryRec.country));
			showSuccess(`Successfully deleted Country ${countryRec.country} from database`);
		} catch (e) {
			console.log(e);
			showError(`Country ${countryRec.country} is used in members record. Cannot delete`);
		}
		//setIsDrawerOpened("");
	}

	function DisplayAllCountry() {
	return (
	<Grid key="AllDOCS" container>
	{countryArray.map( (d, index) => 
		<Grid align="left" key={"COUNTRYALL"+index} item xs={12} sm={6} md={3} lg={3} >
			<Box style={{margin: "2px" }}  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Typography >
			<span style={{paddingLeft: "8px" }} align="left" className={gClasses.patientInfo2}>{d.country+" "}</span>
			<span align="right">
        <EditIcon color="primary" size="small" onClick={() => {editCountry(d)}} />
        <CancelIcon color="secondary" size="small" onClick={() => {delCountry(d)}} />
			</span>
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
		<DisplayPageHeader headerName="Country Database" groupName="" tournament=""/>
		<VsButton align="right" name="Add new Country" onClick={addCountry} />	
		<DisplayAllCountry />
		<Drawer anchor="top" variant="temporary" open={isDrawerOpened !== ""}>
		<Container component="main" maxWidth="xs">	
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "20px", paddingRight: "20px"}} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
		{(isDrawerOpened === "ADD") &&   
			<ValidatorForm className={gClasses.form} onSubmit={addCountrySubmit}>
			<Typography className={gClasses.title}>New Country</Typography>
			<br />
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				label="Name of the Country" type="text"
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
			<ValidatorForm className={gClasses.form} onSubmit={editCountrySubmit}>
			<Typography>
				<span className={gClasses.patientInfo2Brown} >Edit Country: </span>
				<span className={gClasses.title}>{emurOrigName}</span>
			</Typography>
			<DisplayApplicationName name={`(All member records having Country as ${emurOrigName} will get updated with the new value)`} value="" style={{paddingTop: "5px" }}  />
			<VsCheckBox align="left" label="Rename to existing" checked={rename} onClick={() => setRename(!rename)} />
			<br />
			{(false && rename) &&
				<Grid key="AllCountry" container >
					{countryArray.map( (d, index) => 
						<Grid align="left" key={"COUNTRYALL"+index} item xs={12} sm={6} md={2} lg={2} >
							<VsRadio align="left" label={d.country} checked={d.country === emurName} onClick={(event) => setEmurName(d.country) }	/>
						</Grid>
					)}
				</Grid>
			}
			{(rename) &&
				<Autocomplete
				disablePortal
				id="HODNAME"
				defaultValue={editCountryRec}
				onChange={(event, values) => setEditCountryRec(values) }
				style={{paddingTop: "10px" }}
				getOptionLabel={(option) => option.country || ""}
				options={countryArray}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} />}
				/>
			}
			{(!rename) &&
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				label="Name of the Country" type="text"
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
 
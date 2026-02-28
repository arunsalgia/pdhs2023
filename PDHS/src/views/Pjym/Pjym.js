import React, { useState, useContext, useEffect, useRef } from 'react';
import {  Container, CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import Tooltip from "react-tooltip";
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem'; 
import Menu from '@material-ui/core/Menu'; 
import TextField from '@material-ui/core/TextField'; 
import TablePagination from '@material-ui/core/TablePagination';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HumadUpgrade from 'views/Humad/HumadUpgrade';

//import Avatar from '@material-ui/core/Avatar';
import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";
import loadahUniqBy from "lodash/uniqBy";


import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsRadio from "CustomComponents/VsRadio";
import VsRadioSa from "CustomComponents/VsRadioSa";
//import VsRadioGroup from "CustomComponents/VsRadioGroup";
//import VsCheckBox from "CustomComponents/VsCheckBox";
import VsSelect from "CustomComponents/VsSelect";
import VsPdhsFilter from "CustomComponents/VsPdhsFilter";

//import { useLoading, Audio } from '@agney/react-loading';
import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import 'react-step-progress/dist/index.css';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

import {setTab, setDisplayPage } from "CustomComponents/CricDreamTabs.js"

// styles
import globalStyles from "assets/globalStyles";

//icons
//import IconButton from '@material-ui/core/IconButton';
//import MoveUp    from '@material-ui/icons/ArrowUpwardRounded';
//import MoveDown  from '@material-ui/icons/ArrowDownwardRounded';
//import ArrowDropDownCircle from '@material-ui/icons/ArrowDropDownCircle';
import InfoIcon  from 	'@material-ui/icons/Info';
import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';


import {
	BlankArea, DisplayPageHeader,
	//DisplayMemberHeader,
	//PersonalHeader, PersonalMember,
	PjymMember, PjymHeader,
	DisplaySingleTip,
	DisplayPrwsFilter,
} from "CustomComponents/CustomComponents.js"

import {
	ADMIN, APPLICATIONTYPES, SELECTSTYLE, NORMALSELECTSTYLE,
  PADSTYLE,
	MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
	Options_Gender, Options_Marital_Status, Options_Blood_Group,
	READMEMBERINITIAL,
	MOBROWSPERPAGE, NONMOBROWSPERPAGE,	
	PAGELIST,
	STATUS_INFO,
} from "views/globals.js";


import { 
	showError, showSuccess, showInfo,
  displayType, getWindowDimensions,
	decrypt, dispMobile, dispEmail, disableFutureDt,
	isMobile, 
	dateString,
	getImageName,
	vsDialog,
	getMemberName,
	getRelation, dispAge, getAge, capitalizeFirstLetter, getMemberTip,
	downloadTextFile,
	getAdminInfo,
	applicationSuccess,
	getHodCityList,
   canUpgradeHumad, canUpgradePjym,
} from "views/functions.js";


var cityList = ["Mumbai"];
var cityArray = [];


var MasterFilterItems = [
		{item: "FirstName", 					value: "",  		type: "text"},
		{item: "MiddleName", 					value: "", 			type: "text"},
		{item: "LastName", 						value: "",   		type: "text"},
		{item: "Gender",    					value: "", 			type: "text", options: Options_Gender },
		{item: "Marital Status",    	value: "", 			type: "text", options: Options_Marital_Status },
		{item: "Blood Group",    			value: "", 			type: "text", options: Options_Blood_Group },
		{item: "City",    						value: "Mumbai", 		type: "text", options: cityList },
		{item: "Age greater than",    value: 24, 		type: "number", Min: 0, Max: 1000},
		{item: "Age less than",    		value: 24, 		type: "number", Min: 1, Max: 1000},
	];
var inputName="";

const InitialContextParams = {show: false, x: 0, y: 0};


const funCodeTable = [
   {fun: APPLICATIONTYPES.humadUpgrade, 					code: process.env.REACT_APP_HUMAD_UPGRADE},
];


var radioMid = -1;
var menuMember = {};
function setMenuMember(p) { menuMember = p; }

export default function Pjym() {
	var DefaultFilterData = {
		currentPage: 0,
		pageSize:	NONMOBROWSPERPAGE,
		filterList: []
	};

	if ("pjymFilter" in sessionStorage) {
		DefaultFilterData = JSON.parse(sessionStorage.getItem("pjymFilter"));
	}

	const [filterData, setFilterData] = useState(DefaultFilterData);
	
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [dispType, setDispType] = useState("lg");
  const [ROWSPERPAGE, setROWSPERPAGE] = useState(DefaultFilterData.pageSize);
  
	const loginHid = parseInt(sessionStorage.getItem("hid"), 10);
	const loginMid = parseInt(sessionStorage.getItem("mid"), 10);
		
	const gClasses = globalStyles();
	const alert = useAlert();


	const [radioRecord, setRadioRecord] = useState(0);

	const [memberArray, setMemberArray] = useState([]);
	const [memberCount, setMemberCount] = useState(0);
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
		
	// --- start of filter variables
	const	[lastFilter, setLastFilter] = useState("");
	const [inputFilterMode, setInputFilterMode] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [inputInfo, setInputInfo] = useState({});
	//const [filterList, setFilterList] = useState([]);
	const [modMasterFilterItems, setModMasterFilterItems] = useState(MasterFilterItems);
	//---  end of filter variables
	
	
	const [contextParams, setContextParams] = useState(InitialContextParams);

	const [grpAnchorEl, setGrpAnchorEl] = React.useState(null);
	const grpOpen = Boolean(grpAnchorEl);
	
	let menuRef = useRef();
	
	//==================
	const [pjymArray, setPjymArray] = useState([]);
	const [pjymCount, setPjymCount] = useState(0);
	
	//====================
	
  useEffect(() => {	
		function handleResize() {
			let myDim = getWindowDimensions();
			setWindowDimensions(myDim);
			//console.log(displayType(myDim.width));
			setDispType(displayType(myDim.width));
		}

		async function getAllCities() {
			// Update in Menu			
			cityArray = await getHodCityList();
			var tmp = MasterFilterItems.find(x => x.item == 'City');
			cityList = lodashMap(cityArray, 'city');
			tmp.options = cityList;
		}
		// use effects start here
		//getDetails();
		
		let handler = (e) => {
			console.log("In handler");
			if (menuRef.current.contains(e.target)) {
				console.log("Inside");
				setContextParams({show: false});
				console.log(menuRef);		
			}
		}
		
		getAllCities();
		getPjymPage(DefaultFilterData.filterList, DefaultFilterData.currentPage);
		handleResize();
		window.addEventListener('resize', handleResize);
		//return () => window.removeEventListener('resize', handleResize); 
  }, []);

//================

	async function getPjymPage(myFilterList, myPageNumber)  {
		var myFilterData = lodashCloneDeep(filterData);
		myFilterData.filterList = myFilterList;
		myFilterData.currentPage = myPageNumber
		//console.log(myFilterData);
		var myData = encodeURIComponent(JSON.stringify(myFilterData))  ;

		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/pjym/filterdata/${myData}`;
			//console.log(myUrl);
			let resp = await axios.get(myUrl);
			//console.log(resp.data);
			setFilterData(myFilterData);
			//console.log(resp.data.member.length);
			//console.log(resp.data);
			setPjymCount(resp.data.totalCount);
			setMemberArray(resp.data.member);
			setPjymArray(resp.data.pjym);
			//console.log(resp.data.pjym);
		} catch (e) {
			console.log("Error fetching filter member data");
			showError(`Error fetching member data of page ${myPageNumber}`);
		}
		
	}
	

//====================

	function DisplayAllToolTips() {
	return(
		<div>
		{memberArray.map( t =>
		  <DisplaySingleTip key={"MEMBETIP"+t.mid}  id={"MEMBER"+t.mid} />
		)}
		</div>
	)}
	

	function numberToDate(xxx) {
		return new Date(xxx);
	}

	function addFilter(newItem) {
		setLastFilter(newItem);
		var tmp = MasterFilterItems.find(x => x.item === newItem);
		inputName = tmp.item;
		setInputInfo(tmp);
		let tmp1 = "";
		if (tmp.options) 
			tmp1 = "";   //tmp.options[0];
		else {
			tmp = filterData.filterList.find(x => x.item == newItem);
			tmp1 = (tmp) ? tmp.value : "";
		}
		setInputValue(tmp1);
		setInputFilterMode(true);
	}

	async function getMemberPage(filterList, pageNumber, save=true)  {
		//console.log(save);
		var myData = encodeURIComponent(JSON.stringify({
			currentPage: pageNumber,
			pageSize:	ROWSPERPAGE,
			filterList: filterList
		}));

		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/filterdata/${myData}`;
			let resp = await axios.get(myUrl);
			console.log(resp.data);
			if (save) {
				setMemberCount(resp.data.count);
				setMemberArray(resp.data.data);
				//setMemberMasterArray(resp.data.data);
			} 
			else {
				return (resp.data.data);
			}
		} catch (e) {
			console.log("Error fetching filter member data");
			showError(`Error fetching member data of page ${pageNumber}`);
		}
		
	}
	
	
	function addFilterConfirm(tmpValue) {
		//console.log("addFilterConfirm", tmpValue);
		let finalFilter;
		let userSelection = ""
		if (tmpValue.length > 0) 
			userSelection = tmpValue
    else {			
			if (inputValue.length === 0) return;
			userSelection = inputValue;
		}
		//console.log(inputValue);
		let tmp = filterData.filterList.find(x => x.item === inputName);
		//console.log(tmp);
		if (tmp) {
			tmp.value = userSelection;
			finalFilter = lodashCloneDeep(filterData.filterList);
			console.log(finalFilter);
		} 
		else {
			//console.log(inputName, userSelection);
			//console.log(MasterFilterItems[0]);
			tmp = lodashCloneDeep(MasterFilterItems.find(x => x.item === inputName));
			tmp.value = userSelection;
			finalFilter = filterData.filterList.concat(tmp);
			//console.log(finalFilter);
			//setFilterList(finalFilter);
		}
		setInputFilterMode(false);
		updateFilterItems(finalFilter);
		getPjymPage(finalFilter, 0);
	}
	
	function removeFilter(item) {
		let tmp = filterData.filterList.filter(x => x.item !== item);
		//setFilterList(tmp);	
		updateFilterItems(tmp);
		getPjymPage(tmp, 0);
	}
	
	function updateFilterItems(fList) {
		let tmp = lodashCloneDeep(MasterFilterItems);
		for(var i=0; i<fList.length; ++i) {
			tmp = tmp.filter(x => x.item !== fList[i].item);
		}
		setModMasterFilterItems(tmp);
		setLastFilter("");
	}
	

	function updateMemberArray(fList) {
		let tmp = lodashCloneDeep(memberMasterArray);
		for(var i=0; i<fList.length; ++i) {
			switch (fList[i].item) {
				case "FirstName": 
					tmp = tmp.filter(x => x.firstName.toUpperCase().includes(fList[i].value.toUpperCase()) );
					break;
				case "MiddleName":
					tmp = tmp.filter(x => x.middleName.toUpperCase().includes(fList[i].value.toUpperCase()) );
					break;
				case "LastName":
					tmp = tmp.filter(x => x.lastName.toUpperCase().includes(fList[i].value.toUpperCase()) );
					break;
				case "Marital Status":
					if (fList[i].value.toUpperCase() === "MARRIED")
						tmp = tmp.filter(x => !x.emsStatus.toUpperCase().includes("UNMARRIED"));
					else
						tmp = tmp.filter(x => x.emsStatus.toUpperCase().includes("UNMARRIED"));
					break;
				case "Gender":
					tmp = tmp.filter(x => x.gender.toUpperCase().startsWith(fList[i].value.toUpperCase()) );
					break;
				case "Blood Group":
					tmp = tmp.filter(x => x.bloodGroup.toUpperCase().includes(fList[i].value.toUpperCase()) );
					break;	
				case "City":
					console.log(fList[i].value);
					var xxx = cityArray.filter( x => x.city === fList[i].value);
					xxx = lodashMap(xxx, 'hid');
					console.log(xxx);
					tmp = tmp.filter(x => xxx.includes(x.hid)  );
					break;	
				case "Age greater than":
				case "Age less than":
					// calculate dot based on age criteria
					var d = new Date();
					d.setFullYear(d.getFullYear() - fList[i].value);
					// exclude all mebers whose dob is not available
					tmp = tmp.filter(x => numberToDate(x.dob).getFullYear() != 1900 );
					// now do the comparision
					if (fList[i].item === "Age greater than")
						tmp = tmp.filter( x => numberToDate(x.dob).getTime() <= d.getTime() );
					else
						tmp = tmp.filter( x => numberToDate(x.dob).getTime() >= d.getTime() );
					break;
			}
		}
		setMemberArray(tmp);
	}
	
	function jumpFamily() {
      sessionStorage.setItem("previousPage", process.env.REACT_APP_PJYM);
		sessionStorage.setItem("pjymFilter", JSON.stringify(filterData));
		 handlePrwsContextMenuClose();
		 setGrpAnchorEl(null);
		if (radioMid <= 0) return;
		var tmp = memberArray.find( x => x.mid === radioMid);
		setDisplayPage(process.env.REACT_APP_FAMILY, tmp.hid, tmp.mid);
	}

	
	function handleHumadUpgradeBack(sts) {
		if (sts.status === STATUS_INFO.ERROR) 
			showError(sts.msg); 
		else if (sts.status === STATUS_INFO.SUCCESS) {
			showSuccess(sts.msg); 
			// update member list
		}
		else if (sts.status === STATUS_INFO.INFO) {
			console.log("In info");
			vsInfo("Applied for ceased", sts.msg,
				{label: "Okay"}
			);
		}
		setIsDrawerOpened("");
	}

	
	// pagination function 
	const handleChangePage = (event, newPage) => {
		getPjymPage(filterData.filterList, newPage);
  };

	function downloadPrwsData() {
		handlePrwsContextMenuClose();
		setGrpAnchorEl(null);
		vsDialog("Download filtered list", "Are you sure you want to download filtered list?",
				{label: "Yes", onClick: () => downloadPrwsDataConfirm() },
				{label: "No" }
			);		
	}
	
	async function downloadPrwsDataConfirm() {
		
		var myList = await getMemberPage(filterData.filterList, -1, false);
		console.log(myList.length);
		var memData = "Name,Age,Gender,Mobile1,Mobile2,Email1,Email2\n";
		var csvFileName = "prws.csv";
		for (var i=0; i<myList.length; ++i) {
			var m = myList[i];
			var tmp = getMemberName(m) + ",";
			tmp += getAge(m.dob) + ",";
			tmp += capitalizeFirstLetter(m.gender) + ",";
			tmp += m.mobile + ",";
			tmp += m.mobile1 + ",";
			tmp += dispEmail(m.email) + ",";
			tmp += dispEmail(m.email1) + ",";
			tmp += "\n";
			memData += tmp;
	 }
		downloadTextFile(csvFileName, memData);
		showInfo(`Successfully downloaded generated filtered list as csv file ${csvFileName}.`);
 }
 
 	function upgradeHumad() {
      sessionStorage.setItem("pjymFilter", JSON.stringify(filterData));
      handlePrwsContextMenuClose();
      setGrpAnchorEl(null);
      if (radioMid <= 0) return;
      var memberRec = memberArray.find( x => x.mid === radioMid);
      selectCaller(APPLICATIONTYPES.humadUpgrade, "HumadUpgrade", memberRec);
	}	
	function selectCaller(funCode, mode, memberRecord, humadRecord ) {
		sessionStorage.setItem("pjymFilter", JSON.stringify(filterData));
		var myFun = funCodeTable.find(x => x.fun === funCode);
		if (myFun) {
			var myData = JSON.stringify({
				calledFrom: process.env.REACT_APP_PJYM,
				memberRec: memberRecord,
				humadRec: null,
				mode: mode,
				hodMid: 0,
				selectedMid:  memberRecord.mid
			});
			sessionStorage.setItem("humad_props", myData);
			setTab(myFun.code);
		}
		else {
			setIsDrawerOpened(mode);
		}
	}
	  
 const handlePrwsContextMenu = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
	 e.preventDefault();
	setGrpAnchorEl(e.currentTarget);
	//console.log(e.currentTarget);
	 //console.log(radioMid);
	 const {pageX, pageY } = e;
	 //setAnchorEl(event.currentTarget);
	 setContextParams({show: true, x: pageX, y: pageY});
 }
 
 function handlePrwsContextMenuClose() { setContextParams({show: false, x: 0, y: 0}); }
 
 function handleMenu() { handlePrwsContextMenuClose(); console.log("In menu"); }
 
 
	function PrwsContextMenu() {
	//console.log(radioMid);
		var tmp = memberArray.find(x => x.mid === radioMid);
		setMenuMember(tmp);
		//console.log(tmp);
    var myName = tmp.firstName + " " + tmp.lastName;
		//console.log(contextParams);
		var myStyle={top: `${contextParams.y}px` , left: `${contextParams.x}px` };
		//console.log(myStyle);
		//console.log(menuRef);
		//anchorEl={grpAnchorEl}
      var humadUpgradeAllowed = canUpgradeHumad(tmp);
      //var pjymUpgradeAllowed = canUpgradePjym(tmp);
  

	return(
	<div id="PRWSMENU" ref={menuRef} className='absolute z-20' style={myStyle}>
	<Menu
		id="prws-menu"
		anchorEl={grpAnchorEl}
		anchorOrigin={{
			vertical: 'top',
			horizontal: 'center',
		}}
		// keepMounted
		transformOrigin={{
			vertical: 'top',
			horizontal: 'center',
		}}
		open={contextParams.show}
		onClose={handlePrwsContextMenuClose}
	>
		<Typography className={gClasses.patientInfo2Blue} style={{paddingLeft: "5px", paddingRight: "5px"}}>
			{getMemberName(tmp, false, false)}
		</Typography>
		<Divider />
		<MenuItem onClick={jumpFamily}>
			<Typography>{"Family"}</Typography>
		</MenuItem>
		<Divider />
		<MenuItem disabled={!humadUpgradeAllowed} onClick={upgradeHumad}>
			<Typography>Humad Membership</Typography>
		</MenuItem>	</Menu>	
	</div>
	)}
	
	 
	
	function getMyCity(hid) {
		var myCity = "";
      console.log(cityArray[0]);
		for(var i=0; i<cityArray.length; ++i) {
			//console.log(cityArray[i]);
			if (cityArray[i].hidList.includes(hid)) {
				myCity = cityArray[i].city;
				break;
			}
		}
		return myCity;
	}
	
	if (sessionStorage.getItem("isMember") === "false") 
	return (
	<div key="PRWS" className={gClasses.webPage} align="center" key="main">
		<br />
		<br />
		<Typography className={gClasses.message18Blue}>No permission to Guest to view Member information</Typography>
		<br />
		<br />
	</div>
	);
	
	//console.log(filterData);

	// If filter at back-end then we have only 1 page data
	return (
	<div key="PRWS" className={gClasses.webPage} align="center" key="main">
		{/*<DisplayPersonalButtons />*/}
		<DisplayPageHeader headerName={(dispType === "xs") ? "PJYM" : "Pratapgarh Jain Yuva Manch (Mumbai)"} />
		<Box key="BOXPRWSFILTER"className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Grid key="PRWSFILTER" className={gClasses.noPadding} container>
				<Grid align="left" item xs={10} sm={10} md={11} lg={11} >
					<div>
					{(!inputFilterMode) &&
						<Typography style={{paddingLeft: "5px"}}>
						{filterData.filterList.map( (m, index) => {
							return (
								<span key={"FILTER"+index} style={{marginLeft: "5px", paddingLeft: "5px"}} className={gClasses.filterItem} >
									{m.item}: {m.value}
									<CancelIcon size="small" style={{paddingTop: "8px"}} color="secondary" onClick={() => removeFilter(m.item) } />
								</span>
							)
						})}
						</Typography>
					}
					{(inputFilterMode) &&
						<div>
							{ (inputInfo.options) &&
								<VsSelect 
									inputProps={{className: gClasses.dateTimeNormal}} style={NORMALSELECTSTYLE} 
									label={inputName} options={inputInfo.options} value={inputValue} 
									onChange={(event) => { setInputValue(event.target.value); addFilterConfirm(event.target.value); }} 
								/>				
							}
							{ (!inputInfo.options) &&
								<div>
								{/*<TextField id="outlined-required" label={inputName}
										value={inputValue} type={inputInfo.type}
										onChange={(event) => { setInputValue(event.target.value); }}
									/>
									<VsButton name="Apply"  onClick={() => { addFilterConfirm(""); } } />
									<VsButton name="Cancel" onClick={() => { setInputFilterMode(false); setLastFilter(""); }  } />
								*/}
								<ValidatorForm align="left" className={gClasses.form} onSubmit={() => { addFilterConfirm(""); }}>
								<TextValidator 
									id="outlined-required" label={inputName} required className={gClasses.vgSpacing}
									type={inputInfo.type}
									value={inputValue}
									onChange={(event) => { setInputValue(event.target.value); }}
								/>
								<VsButton  name="Apply"  type="submit" />
								<VsButton name="Cancel"  type="button" onClick={() => { setInputFilterMode(false); setLastFilter(""); }  } />
								</ValidatorForm>
								
								</div>
							}
						</div>
					}
					</div>
				</Grid>
				<Grid align="left" item xs={2} sm={2} md={1} lg={1} >
					<div style={{paddingLeft: "5px", paddingRight: "5px"}} >
					<VsPdhsFilter style={SELECTSTYLE} options={modMasterFilterItems} field="item"
					value={lastFilter} onChange={(event) => { addFilter(event.target.value); }} />			
					</div>
				</Grid>
			</Grid>			
		</Box>		
		{/*<PjymHeader dispType={dispType} />*/}
		{/* display members here */}
<Box key="BOXPJYMFILTERTABLE"className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
<TableContainer>
<Table style={{padding: "2px" }} >
<TableHead>
		<TableRow key={"MEMGRIDHDR"}  className={gClasses.boxStyleOdd} >
		<TableCell style={{padding: "2px" }} >
				<Typography style={{marginLeft: "0px", paddingLeft: "0px" }} className={gClasses.patientInfo2Brown } >
					Member Name
				</Typography>		
		</TableCell>
		<TableCell style={{padding: "2px" }} align="center" >
				<Typography style={{marginLeft: "0px", paddingLeft: "0px" }} className={gClasses.patientInfo2Brown } >
					Mobile
				</Typography>		
		</TableCell>
			{((dispType != "xs") && (dispType != "sm") && (dispType != "md"))  &&
		<TableCell style={{padding: "2px" }} align="center" >
				<Typography style={{marginLeft: "0px", paddingLeft: "0px" }} className={gClasses.patientInfo2Brown } >
					Mar. Sts. 
				</Typography>		
		</TableCell>
			}
			{((dispType != "xs") && (dispType != "sm") && (dispType != "md"))  &&
		<TableCell style={{padding: "2px" }} align="center" >
				<Typography style={{marginLeft: "0px", paddingLeft: "0px" }} className={gClasses.patientInfo2Brown } >
					Blood Grp. 
				</Typography>		
		</TableCell>
			}
			{((dispType != "xs") && (dispType != "sm"))  &&
		<TableCell style={{padding: "2px" }} align="center" >
				<Typography style={{marginLeft: "0px", paddingLeft: "0px" }} className={gClasses.patientInfo2Brown } >
					Membership
				</Typography>		
		</TableCell>
			}
		<TableCell style={{padding: "2px" }} align="center" >
			<Typography className={gClasses.patientInfo2Brown}></Typography>
		</TableCell>
		</TableRow>
</TableHead>
<TableBody>
{memberArray.map( (m, index) => {
	if (m.ceased) return null;	
	let p = pjymArray.find(x => x.mid === m.mid);			
	var memberCity = getMyCity(m.hid);
	//console.log(memberCity);
	//console.log(m.email);
	return (
	<TableRow key={"MEMGRID"+index}  className={((index % 2) == 0) ? gClasses.boxStyleEven : gClasses.boxStyleOdd} >
	<TableCell style={{padding: "2px" }} >
		<Typography >
			<span className={gClasses.patientInfo2}>{getMemberName(m) + ((dispType != "xs") ? " ("+dispAge(m.dob, m.gender)+")" : "") }</span>
			<span align="left" data-for={"MEMBER"+m.mid} data-tip={getMemberTip(m, dispType, memberCity)} data-iscapture="true" >
				<InfoIcon color="primary" size="small"/>
			</span>
		</Typography>
	</TableCell>
	<TableCell style={{padding: "2px" }} align="center" >
		<Typography className={gClasses.patientInfo2}>{m.mobile}</Typography>
	</TableCell>
	{((dispType != "xs") && (dispType != "sm") && (dispType != "md") && false)  &&
	<TableCell style={{padding: "2px" }} align="center" >
			<Typography className={gClasses.patientInfo2}>{m.mid}</Typography>
	</TableCell>
	}
	{((dispType != "xs") && (dispType != "sm") && (dispType != "md"))  &&
	<TableCell style={{padding: "2px" }} align="center" >
			<Typography className={gClasses.patientInfo2}>{capitalizeFirstLetter(m.emsStatus)}</Typography>
	</TableCell>
	}
	{((dispType != "xs") && (dispType != "sm") && (dispType != "md"))  &&
	<TableCell style={{padding: "2px" }} align="center" >
			<Typography className={gClasses.patientInfo2}>{m.bloodGroup.toUpperCase()}</Typography>
	</TableCell>
	}
	{((dispType != "xs") && (dispType != "sm"))  &&
	<TableCell style={{padding: "2px" }} align="center" >
			<Typography className={gClasses.patientInfo2}>{(p) ? p.membershipNumber : ""}</Typography>
	</TableCell>
	}
	<TableCell style={{padding: "2px" }} align="center" >
		<Typography>
		 <span><MoreVertIcon color="primary" size="small" onClick={(event) => { radioMid = m.mid; handlePrwsContextMenu(event); }} id={m.id}	 /></span>
		</Typography>
	</TableCell>
</TableRow>
				)})}	
		</TableBody>
		</Table>
    </TableContainer>
		</Box>		
		{/* Table pagination here */}
		<TablePagination
			align="right"
			rowsPerPageOptions={[ROWSPERPAGE]}
			component="div"
			labelRowsPerPage="Pjym Members per page"
			count={pjymCount}
			rowsPerPage={ROWSPERPAGE}
			page={filterData.currentPage}
			onPageChange={handleChangePage}
			//onRowsPerPageChange={handleChangeRowsPerPage}
			//showFirstButton={true}
		/>
		<DisplayAllToolTips />
		{contextParams.show && <PrwsContextMenu /> }
		<Drawer style={{ width: "100%"}} anchor="top" variant="temporary" open={isDrawerOpened != ""} >
		<Container component="main" maxWidth="xs" >	
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
		{(isDrawerOpened === "HumadUpgrade") &&
			<HumadUpgrade memberRec={menuMember} humadRec={null} onReturn={handleHumadUpgradeBack} />
		}
		</Box>
		</Container>
		</Drawer>
		<ToastContainer />
  </div>
  );    
}

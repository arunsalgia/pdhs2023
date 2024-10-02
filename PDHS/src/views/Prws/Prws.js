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
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsCheckBox from "CustomComponents/VsCheckBox";
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
import IconButton from '@material-ui/core/IconButton';
import MoveUp    from '@material-ui/icons/ArrowUpwardRounded';
import MoveDown  from '@material-ui/icons/ArrowDownwardRounded';
import InfoIcon  from 	'@material-ui/icons/Info';
import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';
import ArrowDropDownCircle from '@material-ui/icons/ArrowDropDownCircle';
import MoreVertIcon from '@material-ui/icons/MoreVert';


import {
	BlankArea, DisplayPageHeader,
	DisplayMemberHeader,
	PersonalHeader, PersonalMember, PersonalMemberTable,
	DisplaySingleTip,
	DisplayPrwsFilter,
	PrwsHeaderBody, PrwsDataRow,
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
	hasHumadpermission,
} from "views/functions.js";


const funCodeTable = [
{fun: APPLICATIONTYPES.humadUpgrade, 					code: process.env.REACT_APP_HUMAD_UPGRADE},
];

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

var radioMid = -1;
var menuMember = {};    function setMenuMember(p) { menuMember = p; }

export default function Prws() {
	var DefaultFilterData = {
		currentPage: 0,
		pageSize:	NONMOBROWSPERPAGE,
		filterList: []
	};

	if ("prwsFilter" in sessionStorage) {
		DefaultFilterData = JSON.parse(sessionStorage.getItem("prwsFilter"));
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
	
	//const [cityArray, setCityArray] = useState([]);
	// pagination
	const [page, setPage] = useState(0);
	
	// --- start of filter variables
	const	[lastFilter, setLastFilter] = useState("");
	const [inputFilterMode, setInputFilterMode] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [inputInfo, setInputInfo] = useState({});
	const [modMasterFilterItems, setModMasterFilterItems] = useState(MasterFilterItems);
	//---  end of filter variables
	
	
	const [contextParams, setContextParams] = useState(InitialContextParams);

	const [grpAnchorEl, setGrpAnchorEl] = React.useState(null);
	const grpOpen = Boolean(grpAnchorEl);
	
	let menuRef = useRef();
	
  useEffect(() => {	
		function handleResize() {
			let myDim = getWindowDimensions();
			setWindowDimensions(myDim);
			//console.log(displayType(myDim.width));
			setDispType(displayType(myDim.width));
		}
		
		async function getAllMembers() {
			// first get all cities
			//await getAllCities();
			// now fetch all members
			try {
				await getMemeberPage(DefaultFilterData.filterList, DefaultFilterData.currentPage);
			} catch (e) {
				console.log("Error fetching member data");		
			}
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
		
		if ("humad_returnstatus" in sessionStorage) {
			console.log("has return status");
			var sts = JSON.parse(sessionStorage.getItem("humad_returnstatus"));
			sessionStorage.removeItem("humad_returnstatus");
			handlePrwsReturn(sts);
		}

		setPage(0);
		getAllCities();
		if (sessionStorage.getItem("isMember") === "true") {
			getAllMembers();
		}
		handleResize();
		window.addEventListener('resize', handleResize);
		//return () => window.removeEventListener('resize', handleResize); 
  }, []);


	function handlePrwsReturn(sts) {
		console.log(sts);
		if ((sts.msg !== "") && (sts.status === STATUS_INFO.ERROR)) showError(sts.msg); 
		else if ((sts.msg !== "") && (sts.status === STATUS_INFO.SUCCESS)) showSuccess(sts.msg); 
		
		if (sts.status == STATUS_INFO.SUCCESS) {
		}
		else {
			console.log("Yaha kaise aaya");
		}
		setIsDrawerOpened("");
	}
	
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

	async function getMemeberPage(newFilterList, newPage, save=true)  {
		var myFilterData = lodashCloneDeep(filterData);
		myFilterData.currentPage = newPage;
		myFilterData.filterList = newFilterList;
	
		var myDataStr = encodeURIComponent(JSON.stringify(myFilterData));
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/filterdata/${myDataStr}`;
			let resp = await axios.get(myUrl);
			setFilterData(myFilterData);
			if (save) {
				setMemberCount(resp.data.count);
				setMemberArray(resp.data.data);
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
		
		console.log("addFilterConfirm", tmpValue);
		var currFilterData = lodashCloneDeep(filterData.filterList);
		let finalFilter;
		let userSelection = ""
		if (tmpValue.length > 0) 
			userSelection = tmpValue
    else {			
			if (inputValue.length === 0) return;
			userSelection = inputValue;
		}
		//console.log(inputValue);
		console.log("AFC",inputName);
		let tmp = currFilterData.find(x => x.item === inputName);
		//console.log(tmp);
		if (tmp) {
			tmp.value = userSelection;
			finalFilter = currFilterData;
			console.log(finalFilter);
		} 
		else {
			//console.log(inputName, userSelection);
			//console.log(MasterFilterItems[0]);
			tmp = lodashCloneDeep(MasterFilterItems.find(x => x.item === inputName));
			tmp.value = userSelection;
			finalFilter = currFilterData.concat(tmp);
		}
		// for testing blank on Mobile
		if (finalFilter.length === 0) return;
		
		
		setInputFilterMode(false);
		updateFilterItems(finalFilter);
		getMemeberPage(finalFilter, 0);
	}
	
	function removeFilter(item) {
		let tmp = filterData.filterList.filter(x => x.item !== item);
		updateFilterItems(tmp);
		getMemeberPage(tmp, 0);
	}
	
	function updateFilterItems(fList) {
		let tmp = lodashCloneDeep(MasterFilterItems);
		for(var i=0; i<fList.length; ++i) {
			tmp = tmp.filter(x => x.item !== fList[i].item);
		}
		setModMasterFilterItems(tmp);
		setLastFilter("");
	}
	

	function jumpFamily() {
		sessionStorage.setItem("prwsFilter", JSON.stringify(filterData));
		handlePrwsContextMenuClose();
		setGrpAnchorEl(null);
		if (radioMid <= 0) return;
		var tmp = memberArray.find( x => x.mid === radioMid);
		console.log("Mem info", tmp.hid, tmp.mid);
		setDisplayPage(process.env.REACT_APP_FAMILY, tmp.hid, tmp.mid);
	}
	
	function jumpPjym() {
		sessionStorage.setItem("prwsFilter", JSON.stringify(filterData));
		handlePrwsContextMenuClose();
		setGrpAnchorEl(null);
		//setTab(process.env.REACT_APP_PJYM);
		console.log("Here");
		showInfo("Membership of PJYM to be implemented");
		console.log("Here again");
	}

	function jumpHumad() {
		sessionStorage.setItem("prwsFilter", JSON.stringify(filterData));
		handlePrwsContextMenuClose();
		setGrpAnchorEl(null);
		//setTab(process.env.REACT_APP_HUMAD);
		setIsDrawerOpened("HumadUpgrade");
	}
	
	function upgradeHumad() {
		sessionStorage.setItem("prwsFilter", JSON.stringify(filterData));
		handlePrwsContextMenuClose();
		var memberRec = memberArray.find( x => x.mid === radioMid);
		selectCaller(APPLICATIONTYPES.humadUpgrade, "HumadUpgrade", memberRec);
	}	
	
	function selectCaller(funCode, mode, memberRecord, humadRecord ) {
		sessionStorage.setItem("prwsFilter", JSON.stringify(filterData));
		var myFun = funCodeTable.find(x => x.fun === funCode);
		if (myFun) {
			var myData = JSON.stringify({
				calledFrom: process.env.REACT_APP_PRWS,
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
		getMemeberPage(filterData.filterList, newPage);
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
		
		var myList = await getMemeberPage(filterList, -1, false);
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
		// if not humad member and is humad admin then allowd humad upograde
		var humadUpgradeAllowed = !tmp.humadMember && hasHumadpermission();
		
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
		<MenuItem disabled={tmp.pjymMember} onClick={jumpPjym}>
			<Typography>Pjym Membership</Typography>
		</MenuItem>
		<MenuItem disabled={!humadUpgradeAllowed} onClick={upgradeHumad}>
			<Typography>Humad Membership</Typography>
		</MenuItem>
	</Menu>	
	</div>
	)}
	
	function getMyCity(hid) {
		var myCity = "";
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
	

	// If filter at back-end then we have only 1 page data
	var cellPadStyle = {padding: "2px" };
	return (
	<div key="PRWS" className={gClasses.webPage} align="center" key="main">
		{/*<DisplayPersonalButtons />*/}
		<DisplayPageHeader headerName={(dispType === "xs") ? "PRWS" : "Pratapgarh Rajasthan Welfare Samiti"} 
			button1={<VsButton style={{marginRight: "10px" }}  name="Export to CSV" onClick={downloadPrwsData} />}
		/>
		{/*<DisplayPrwsFilter 
			inputFilterMode={inputFilterMode} 
			inputName={inputName}
			inputInfo={inputInfo}
			inputValue={inputValue}
			selectClick={(event) => { setInputValue(event.target.value); addFilterConfirm(event.target.value); }}
			setInputValue={setInputValue}
			filterList={filterList}
			balanceFilterList={modMasterFilterItems}
			lastFilter={lastFilter}
			removeFilter={removeFilter}
			pdhsFilter={(event) => { addFilter(event.target.value); }}
			applyClick={() => { addFilterConfirm(""); } }
			cancelClick={() => { setInputFilterMode(false); setLastFilter(""); } }
		/>*/}

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
		{/*<PersonalHeader dispType={dispType} />*/}
		{/* display members here */}
		<Box key="BOXPRWSFILTERTABLE"className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
    <TableContainer>
		<Table style={{padding: "2px" }} >
		<PrwsHeaderBody key="PRWSHHHHHH" dispType={dispType} />
		<TableBody>
		{memberArray.map( (m, index) => {
				if (m.ceased) return null;		
				var memberCity = getMyCity(m.hid);
				//console.log(memberCity);
				//console.log(m.email);
				return (
				<PrwsDataRow key={"PERSONALMEMBER"+index} index={index} m={m} dispType={dispType} memberCity={memberCity} 
					datatip={getMemberTip(m, dispType, memberCity)} onClick={(event) => { radioMid = m.mid; handlePrwsContextMenu(event); }}
				/>
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
			labelRowsPerPage="Members per page"
			count={memberCount}
			rowsPerPage={ROWSPERPAGE}
			page={filterData.currentPage}
			onPageChange={handleChangePage}
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

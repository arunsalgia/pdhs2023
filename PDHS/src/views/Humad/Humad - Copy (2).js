import React, { useState, useContext, useEffect, useRef } from 'react';
import { Container, CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import TablePagination from '@material-ui/core/TablePagination';
import ReactTooltip from "react-tooltip";
import MenuItem from '@material-ui/core/MenuItem'; 
import Menu from '@material-ui/core/Menu'; 

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

import {setTab, setDisplayPage} from "CustomComponents/CricDreamTabs.js"

import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsTextSearch from "CustomComponents/VsTextSearch";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsRolodex from 'CustomComponents/VsRolodex';

import HumadUpgrade from 'views/Humad/HumadUpgrade';


// styles
import globalStyles from "assets/globalStyles";
//import modalStyles from "assets/modalStyles";


import InfoIcon   from 	'@material-ui/icons/Info';
import Upgrade from 	'@material-ui/icons/ArrowUpwardOutlined'
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const BlankMemberData = {firstName: "", middleName: "", lastName: ""};



import {
	BlankArea, DisplayPageHeader,
	DisplayPrwsFilter,
} from "CustomComponents/CustomComponents.js"

import {
	ADMIN, HUMADCATEGORY,
	Options_Gender, Options_Marital_Status, Options_Blood_Group,
	MOBROWSPERPAGE, NONMOBROWSPERPAGE,	
	PAGELIST,
	STATUS_INFO,
} from "views/globals.js";

import { 
	showInfo, showError, showSuccess,
	displayType, getWindowDimensions,
	isMobile,
	dateString,
	vsDialog,
	getMemberName,
	dispAge,
	getAdminInfo,
	disableFutureDt,
	getMemberTip,
	getHodCityList,
	hasPRWSpermission,
} 
from "views/functions.js";

var cityList = ["Mumbai"];
var cityArray = [];


const MasterFilterItems = [
		{item: "FirstName", 					value: "",  	type: "text"},
		{item: "MiddleName", 					value: "", 		type: "text"},
		{item: "LastName", 						value: "",   	type: "text"},
		{item: "Gender",    					value: "", 		type: "text", options: Options_Gender },
		{item: "Marital Status",    	value: "", 		type: "text", options: Options_Marital_Status },
		{item: "Blood Group",    			value: "", 		type: "text", options: Options_Blood_Group },
		{item: "City",    						value: "Mumbai", 		type: "text", options: cityList },
		{item: "Age greater than",    value: 24, 		type: "number", Min: 0, Max: 1000},
		{item: "Age less than",    		value: 24, 		type: "number", Min: 1, Max: 1000},
	];
var inputName="";

var menuMember = {};
function setMenuMember(p) { menuMember = p; }

//const ROWSPERPAGE = isMobile() ? 7 : 12;

const InitialContextParams = {show: false, x: 0, y: 0};

var currentPage = 0;

export default function Humad() {
	const adminInfo = getAdminInfo();
	const humadAdmin = ((adminInfo & (ADMIN.superAdmin | ADMIN.humadAdmin)) !== 0);
	//console.log(adminInfo, humadAdmin);
	
	const mobileVersion = isMobile();
	const gClasses = globalStyles();
	const alert = useAlert();

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [dispType, setDispType] = useState("lg");
  const [ROWSPERPAGE, setROWSPERPAGE] = useState(NONMOBROWSPERPAGE);

	const [humadArray, setHumadArray] = useState([]);
	const [humadMasterArray, setHumadMasterArray] = useState([]);
	const [memberArray, setMemberArray] = useState([])
	const [memberMasterArray, setMemberMasterArray] = useState([]);


	const [humadCount, setHumadCount] = useState(0);
	
	const [currentHumad, setCurrentHumad] = useState(null);
	
	const [upgradeCount, setUpgradeCount] = useState(-1);
	
	const [newCategory, setNewCategory] = useState("");
	
	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");

	const [modalRegister, setModalRegister] = useState(0);

	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	
	// pagination
	const [page, setPage] = useState(0);	
	const [currentChar, setCurrentChar] = useState('A');

	// --- start of filter variables
	const	[lastFilter, setLastFilter] = useState("");
	const [inputFilterMode, setInputFilterMode] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [inputInfo, setInputInfo] = useState({});
	const [filterList, setFilterList] = useState([]);
	const [modMasterFilterItems, setModMasterFilterItems] = useState(MasterFilterItems);
	//---  end of filter variables

	const [humadRec, setHumadRec] = useState(null);
	
	const [contextParams, setContextParams] = useState(InitialContextParams);
	const [grpAnchorEl, setGrpAnchorEl] = React.useState(null);
	const grpOpen = Boolean(grpAnchorEl);
	
	let menuRef = useRef();
	
  useEffect(() => {
    function handleResize() {
			let myDim = getWindowDimensions();
      setWindowDimensions(myDim);
      var myDispType = displayType(myDim.width);
      //console.log(myDispType);
      setROWSPERPAGE( (myDispType == "xm") ? MOBROWSPERPAGE : NONMOBROWSPERPAGE);
      setDispType(displayType(myDim.width));
		}
			
		async function org_getAllHumad() {
			try {
				//console.log('in humad fetch', chrStr )
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/humad/listwithnames`;
				let resp = await axios.get(myUrl);
				
				setHumadArray(resp.data.humad);
				setMemberArray(resp.data.member);
				setMemberMasterArray(resp.data.member);
				
				//setCurrentChar(chrStr);
			} catch (e) {
				console.log(e);
				alert.error(`Error fetching Humad details`);
				setMemberArray([]);
				setHumadArray([]);
			}	
		}

			
		async function getAllHumad() {
			if (process.env.REACT_APP_BACKENDFILTER === "true") {
					await getHumadPage([], 0);
			}
			else {
				try {
				//console.log('in humad fetch', chrStr )
					let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/humad/listwithnames`;
					let resp = await axios.get(myUrl);
					
					setHumadArray(resp.data.humad);
					setMemberArray(resp.data.member);
					setMemberMasterArray(resp.data.member);
					
					//setCurrentChar(chrStr);
				} 
				catch (e) {
					console.log(e);
					alert.error(`Error fetching Humad details`);
					setMemberArray([]);
					setHumadArray([]);
				}	
			}
		}

		async function getAllCities() {
			// Update in Menu			
			cityArray = await getHodCityList();
			var tmp = MasterFilterItems.find(x => x.item == 'City');
			cityList = lodashMap(cityArray, 'city');
			tmp.options = cityList;
		}

		if (sessionStorage.getItem("isMember") === "true") {
			getAllHumad();
			getAllCities();
		}
		
		handleResize();
		window.addEventListener('resize', handleResize);

  }, []);
	

	
	async function getHumad(chrStr) {
		try {
			//console.log('in humad fetch', chrStr )
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/humad/listbyalphabet/${chrStr}`;
			let resp = await axios.get(myUrl);
			
			setHumadArray(resp.data.humad);
			setMemberArray(resp.data.member);

			setCurrentChar(chrStr);
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching Humad details`);
			setMemberArray([]);
			setHumadArray([]);
		}	
	}

	async function getHumadPage(filterList, pageNumber)  {
		var myData = encodeURIComponent(JSON.stringify({
			pageNumber: pageNumber,
			pageSize:	ROWSPERPAGE,
			filterData: filterList
		}));

		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/humad/filterdata/${myData}`;
			//console.log(myUrl);
			let resp = await axios.get(myUrl);
			console.log(resp.data.member.length);
			currentPage = (process.env.REACT_APP_BACKENDFILTER === "true") ? 0 : pageNumber;
			setMemberArray(resp.data.member);
			setMemberMasterArray(resp.data.member);
			setHumadArray(resp.data.humad);
			setHumadCount(resp.data.count);
		} catch (e) {
			console.log("Error fetching filter member data");
			showError(`Error fetching member data of page ${pageNumber}`);
		}
		
	}
	
	

	function ModalResisterStatus() {
    // console.log(`Status is ${modalRegister}`);
		let regerr = true;
    let myMsg;
    switch (modalRegister) {
      case 0:
        myMsg = "";
				regerr = false;
        break;
      case 1001:
        myMsg = `Selected Symptom already added`;
        break;
      case 2001:
        myMsg = `Selected Diagnosis already added`;
        break;
      default:
          myMsg = "Unknown Error";
          break;
    }
    return(
      <div>
        <Typography className={(regerr) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
      </div>
    )
  }

	async function newPage(newChar) {
		setPage(0);
		await getHumad(newChar);
		//console.log(num)
	}
	
	// pagination function 
	const handleChangePage = (event, newPage) => {
		if (process.env.REACT_APP_BACKENDFILTER === "true") {
			getHumadPage(filterList, newPage);
		}
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function displayMember() {
		handleHumadMenuClose();
		//console.log(menuMember);
    //sessionStorage.setItem("memberHid", menuMember.hid);
    //sessionStorage.setItem("memberMid", menuMember.mid);
    //setTab(100);
		setDisplayPage(PAGELIST.FAMILY, menuMember.hid, menuMember.mid);
  }
	
	 	
	function OrgupgradeHumad() {
		handleHumadMenuClose();
		let humadRec = humadArray.find(x => x.mid === menuMember.mid);
		let  myIndex = -1;  
		for(var i = 0; i < HUMADCATEGORY.length; i++) {
			if (HUMADCATEGORY[i].short === humadRec.membershipNumber.substr(0, 1)) {
					myIndex = i;
					break;
			}
    }
		if (myIndex >= 0) {
			setNewCategory(HUMADCATEGORY[myIndex-1].desc);
			setUpgradeCount(myIndex);
			setCurrentHumad(humadRec);
			setIsDrawerOpened("Upgrade");
		}
	}
	
	function upgradeHumad() {
		handleHumadMenuClose();
		// get Humad record
		let tmpHumadRec = humadArray.find(x => x.mid === menuMember.mid);
		let  myIndex = HUMADCATEGORY.map(e => e.short).indexOf(tmpHumadRec.membershipNumber.substr(0, 1));  //.find(x => x.short === );
		if (myIndex === 0) {
			showInfo(`${getMemberName(menuMember, false, false)} is already ${HUMADCATEGORY[0].desc} (highest upgrade)`);
			return;
		}
		setHumadRec(tmpHumadRec);
		setIsDrawerOpened("Upgrade");
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

	async function upgradeHumadSubmit() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/humad/upgrade/${currentHumad.mid}/${newCategory}`;
			let resp = await axios.get(myUrl);
			setHumadArray([resp.data].concat(humadArray.filter(x => x.mid !== currentHumad.mid)));
		} catch (e) {
			console.log(e);
			alert.error(`Error updating Humad category`);
		}			
	}
	
	
	function JunkDisplayAllHumad() {
		if (memberArray.length === 0) return null;
		return (
		<div>
		<Box  key={"MEMHDRBOX"} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMHDRGRID"} className={gClasses.noPadding} container align="center" alignItems="center" >
		<Grid align="left" item md={5} lg={5} >
			<Typography className={gClasses.patientInfo2Brown}>Name</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mem. No.</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mobile</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mem. Id</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mem. Date</Typography>
		</Grid>
		<Grid align="center" item md={2} lg={2} >
			<Typography className={gClasses.patientInfo2Brown}>Remarks</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
		</Grid>
		</Grid>
		</Box>
		{memberArray.slice(page*ROWSPERPAGE, (page+1)*ROWSPERPAGE).map( (m, index) => {
			let h = humadArray.find(x => x.mid === m.mid);
			if (!h) return null;
			let memDateStr = dateString(h.membershipDate);
			return (
			<Box  style={{paddingLeft: "5px", paddingRight: "5px" }} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"MEMGRID"+index} className={gClasses.noPadding} container align="center" alignItems="center" >
				<Grid align="left" item md={5} lg={5} >
					<Typography className={gClasses.patientInfo2}>{getMemberName(m)+"(" + dispAge(m.dob, m.gender) + ")"}</Typography>
				</Grid>
				<Grid align="center" item md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{h.membershipNumber}</Typography>
				</Grid>
				<Grid align="center" item md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{m.mobile}</Typography>
				</Grid>
				<Grid align="center" item md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{m.mid}</Typography>
				</Grid>
				<Grid align="center" item md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{memDateStr}</Typography>
				</Grid>
				<Grid align="center" item md={2} lg={2} >
					<Typography className={gClasses.patientInfo2}>{h.remarks}</Typography>
				</Grid>
				<Grid align="center" item md={1} lg={1} >
				{((humadAdmin) && (h.membershipNumber.substr(0, 1) !== HUMADCATEGORY[0].short)) &&
          <div>
					<EditRoundedIcon color='primary'  onClick={() => upgradeHumad(h) } />
					<Upgrade color='primary'  onClick={() => upgradeHumad(h) } />
          </div>
				}
				</Grid>
			</Grid>
			</Box>
			)}
		)}	
		</div>	
		)}
	
	function JunkDisplayMobileHumad() {
		if (memberArray.length === 0) return null;
		return (
		<div>
		<Box  key={"MEMHDRBOX"} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMHDRGRID"} className={gClasses.noPadding} container align="center" alignItems="center" >
		<Grid align="left" item xs={9} sm={10} md={6} lg={6} >
			<Typography className={gClasses.patientInfo2Brown}>Name</Typography>
		</Grid>
		<Grid align="center" item xs={3} sm={2} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mobile</Typography>
		</Grid>
		</Grid>
		</Box>
		{memberArray.slice(page*ROWSPERPAGE, (page+1)*ROWSPERPAGE).map( (m, index) => {
			let h = humadArray.find(x => x.mid === m.mid);
			if (!h) return null;
			let memDateStr = dateString(h.membershipDate);
			let myInfo = "Mem.Id. : " + h.mid + "<br />";
			myInfo +=    "Mem.No. : " +  h.membershipNumber + "<br />";
			myInfo +=    "Mem.Date: " +  dateString(h.membershipDate);
			if (h.remarks !== "")
				myInfo +=  "<br />" + "Remarks:  " + h.remarks;
			return (
			<Box  key={"MEMBOX"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"MEMGRID"+index} className={gClasses.noPadding} container align="center" alignItems="center" >
				<Grid align="left" item xs={9} sm={10}>
					<Typography >
					<span className={gClasses.patientInfo2}>{getMemberName(m)+"(" + dispAge(m.dob, m.gender) + ")"}</span>
					{(humadAdmin) &&
						<span align="left"
							data-for={"HUMAD"+h.mid}
							data-tip={myInfo}
							data-iscapture="true"
						>
							<InfoIcon color="primary" size="small"/>
						</span>
					}
					</Typography>
				</Grid>
				<Grid align="center" item xs={3} sm={2} >
					<Typography className={gClasses.patientInfo2}>{m.mobile}</Typography>
				</Grid>
				</Grid>
			</Box>
			)}
		)}	
		</div>	
	)}

	function HumadContextMenu() {
		console.log("in HUmadContextMenu");
		console.log(menuMember);
		console.log(grpAnchorEl);
		//let family = (menuMember.hid === loginHid);
		//let admin = ((adminInfo & (ADMIN.superAdmin | ADMIN.prwsAdmin)) !== 0);
	
		//var tmp = menuMember;		//memberArray.find(x => x.mid === menuMember.mid);
		if (!menuMember) return;	
		var tmpHumadRec = humadArray.find(x => x.mid === menuMember.mid);
		var myStyle={top: `${contextParams.y}px` , left: `${contextParams.x}px` };
	return(
	<div ref={menuRef} className='absolute z-20' style={myStyle}>
	<Menu id="pjym-menu" 
		anchorEl={grpAnchorEl}
		anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
		// keepMounted
		transformOrigin={{ vertical: 'top', horizontal: 'center', }}
		open={contextParams.show} onClose={handleHumadMenuClose}
	>
		<Typography className={gClasses.patientInfo2Blue} style={{paddingLeft: "5px", paddingRight: "5px"}}>{getMemberName(menuMember, false, false)}</Typography>
		<MenuItem disabled={tmpHumadRec.membershipNumber.substr(0, 1) === HUMADCATEGORY[0].short} onClick={upgradeHumad}>
			<Typography>Upgrade</Typography>
		</MenuItem>
		<Divider />
		<MenuItem onClick={displayMember}>
			<Typography>Family</Typography>
		</MenuItem>
	</Menu>	
	</div>
	)}
	
	const handleHumadContextMenu = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
		//console.log("In handleMemberPersonalContextMenu");
		e.preventDefault();
		setGrpAnchorEl(e.currentTarget);
		//console.log(e.currentTarget);
		//console.log(radioMid);
		const {pageX, pageY } = e;
		//console.log(pageX, pageY);
		setContextParams({show: true, x: pageX, y: pageY});
	}
	 
	function handleHumadMenuClose() { setContextParams({show: false, x: 0, y: 0}); }
 
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
	
	function DisplayAllHumad() {
		if (memberArray.length === 0) return null;
		return (
		<div>
		<Box  key={"MEMBOXHDR"} className={gClasses.boxStyleOdd} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMGRIDHDR"} className={gClasses.noPadding} key={"SYMHDR"} container align="center" alignItems="center" >
		<Grid align="left" item md={5} lg={5} >
			<Typography className={gClasses.patientInfo2Brown}>Name</Typography>
		</Grid>
		
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mem. No.</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mobile</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mem. Id</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mem. Date</Typography>
		</Grid>
		<Grid align="center" item md={2} lg={2} >
			<Typography className={gClasses.patientInfo2Brown}>Remarks</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
		</Grid>
		</Grid>
		</Box>
		{memberArray.slice(currentPage*ROWSPERPAGE, (currentPage+1)*ROWSPERPAGE).map( (m, index) => {
			var memberCity = getMyCity(m.hid);
			let h = humadArray.find(x => x.mid === m.mid);
			if (!h) return null;
			let memDateStr = dateString(h.membershipDate);
			return (
			<Box  key={"MEMBOX"+index} className={((index % 2) == 0) ? gClasses.boxStyleEven : gClasses.boxStyleOdd } borderColor="black" borderRadius={30} border={1} >
			<Grid key={"MEMGRID"+index} className={gClasses.noPadding} key={"SYM"+index} container align="center" alignItems="center" >
				<Grid align="left" item md={5} lg={5} >
					<Typography>
						<span style={{marginLeft: "0px", paddingLeft: "0px" }} className={gClasses.patientInfo2Blue } >{getMemberName(m)+" ("+dispAge(m.dob, m.gender)+")"}</span>
							<span align="left" data-for={"HUMAD"+m.mid} data-tip={getMemberTip(m, dispType, memberCity) } data-iscapture="true" >
							<InfoIcon color="primary" size="small"/>
							</span>
					</Typography>		
				</Grid>
				<Grid align="center" item md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{h.membershipNumber}</Typography>
				</Grid>
				<Grid align="center" item md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{m.mobile}</Typography>
				</Grid>
				<Grid align="center" item md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{m.mid}</Typography>
				</Grid>
				<Grid align="center" item md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{memDateStr}</Typography>
				</Grid>
				<Grid align="center" item md={2} lg={2} >
					<Typography className={gClasses.patientInfo2}>{h.remarks}</Typography>
				</Grid>
				<Grid align="center" item md={1} lg={1} >
				{((false) &&(humadAdmin) && (h.membershipNumber.substr(0, 1) !== HUMADCATEGORY[0].short)) &&
          <div>
					<EditRoundedIcon color='primary'  onClick={() => upgradeHumad(h) } />
					<Upgrade color='primary'  onClick={() => upgradeHumad(h) } />
          </div>
				}
				<MoreVertIcon className={gClasses.blue} size="small" onClick={() => { setMenuMember(m); handleHumadContextMenu(event); } } />
				</Grid>
			</Grid>
			</Box>
			)}
		)}	
		{contextParams.show && <HumadContextMenu /> }
		</div>	
		)}

// Functions required for Filter 

	function addFilter(newItem) {
		setLastFilter(newItem);
		var tmp = MasterFilterItems.find(x => x.item === newItem);
		inputName = tmp.item;
		setInputInfo(tmp);
		let tmp1 = "";
		if (tmp.options) 
			tmp1 = "";   //tmp.options[0];
		else {
			tmp = filterList.find(x => x.item == newItem);
			tmp1 = (tmp) ? tmp.value : "";
		}
		setInputValue(tmp1);
		setInputFilterMode(true);
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
		let tmp = filterList.find(x => x.item === inputName);
		//console.log(tmp);
		if (tmp) {
			tmp.value = userSelection;
			finalFilter = lodashCloneDe1ep(filterList);
			console.log(finalFilter);
		} 
		else {
			//console.log(inputName, userSelection);
			//console.log(MasterFilterItems[0]);
			tmp = lodashCloneDeep(MasterFilterItems.find(x => x.item === inputName));
			//console.log(MasterFilterItems);
			//console.log(tmp);
			tmp.value = userSelection;
			finalFilter = filterList.concat(tmp);
			//console.log(finalFilter);
			setFilterList(finalFilter);
		}
		setInputFilterMode(false);
		updateFilterItems(finalFilter);
		updateMemberArray(finalFilter);
		setPage(0);
	}
	
	function removeFilter(item) {
		let tmp = filterList.filter(x => x.item !== item);
		setFilterList(tmp);	
		updateFilterItems(tmp);
		updateMemberArray(tmp);
		setPage(0);
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
					var xxx = cityArray.filter( x => x.city === fList[i].value);
					xxx = lodashMap(xxx, 'hid');
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
	
	
	function DisplayAllToolTips() {
	return(
		<div>
		{memberArray.slice(page*ROWSPERPAGE, (page+1)*ROWSPERPAGE).map( t =>
			<ReactTooltip key={"HUMAD"+t.mid} type="info" effect="float" id={"HUMAD"+t.mid} multiline={true}/>
		)}
		</div>
	)}	

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
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	<DisplayPageHeader headerName="Humad Samaj" />
	<DisplayPrwsFilter 
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
	/>
	<DisplayAllHumad />
	{(humadCount > ROWSPERPAGE) &&
		<TablePagination
			align="right"
			rowsPerPageOptions={[ROWSPERPAGE]}
			component="div"
			labelRowsPerPage="Members per page"
			count={humadCount}
			rowsPerPage={ROWSPERPAGE}
			page={page}
			onPageChange={handleChangePage}
			//onRowsPerPageChange={handleChangeRowsPerPage}
			//showFirstButton={true}
		/>
	}
	<DisplayAllToolTips />
	<Drawer style={{ width: "100%"}} anchor="top" variant="temporary" open={isDrawerOpened != ""} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	{((isDrawerOpened === "Upgrade") || (isDrawerOpened === "EDIT")) &&
		<HumadUpgrade memberRec={menuMember} humadRec={humadRec} onReturn={handleHumadUpgradeBack}/>
	}
	</Box>
	</Container>
	</Drawer>
	<ToastContainer />
  </div>
  );    
}

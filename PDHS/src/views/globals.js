import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export const SupportedMimeTypes = ["image/png",  "image/jpeg", "application/pdf"]
export const SupportedExtensions = ["PNG",  "JPG", "PDF"];

export const str1by4 = String.fromCharCode(188)
export const str1by2 = String.fromCharCode(189)
export const str3by4 = String.fromCharCode(190)
export const INR = String.fromCharCode(8377)

export const TOAST_TIMEOUT = 2000;		// Messages to be displayed for 2 second

export const PADSTYLE = {paddingLeft: "10px", paddingRight: "10px" };

export const VISITTYPE = {pending: "pending", expired: "expired", cancelled: "cancelled", visit: ""};
export const WALLETTYPE = {all: "all", wallet: "wallet", bonus: "bonus"};

export const READMEMBERINITIAL = 10;

export const ALPHABETSTR = [
"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
"U", "V", "W", "X", "Y", "Z"
];

export const ADMIN = {superAdmin: 1, pjymAdmin: 2, humadAdmin: 4, prwsAdmin: 8, pmmAdmin: 16, };

export const HUMADCATEGORY = [
	{short: "S", desc: "Sangrakshak sadasya"}, 
	{short: "L", desc: "Life sadasya"},
	{short: "H", desc: "Humad sadasya"} 
];

export const Options_Gender = 				["Male", "Female", "Others" ];
export const Options_Marital_Status = ["Married", "UnMarried" ];
export const Options_Blood_Group = 		["O+", "AB+", "A+", "B+", "O-", "AB-", "A-", "B-" ];


export const WEEKSTR = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const SHORTWEEKSTR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHSTR = ["January", "February", "March", "April", "May", "June",
							"July", "August", "September", "October", "November", "December"];	
export const SHORTMONTHSTR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oc", "Nov", "Dec"];	

export const HOURSTR = [
"00", 
"01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
"21", "22", "23"
];

export const MINUTESTR = [
"00", "01", "02", "03", "04", "05", "06", "07", "08", "09",
"10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
"20", "21", "22", "23", "24", "25", "26", "27", "28", "29", 
"30", "31", "32", "33", "34", "35", "36", "37", "38", "39", 
"40", "41", "42", "43", "44", "45", "46", "47", "48", "49", 
"50", "51", "52", "53", "54", "55", "56", "57", "58", "59"
];

export const MINUTEBLOCK=[0, 15, 30, 45];

export const DATESTR = [
"00",
"01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
"21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
"31"							
];

//in date function 0 represents JAN I.e. month number 1
export const MONTHNUMBERSTR = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

export const BLOCKNUMBER={
allBlockStart: 0,
allBlockEnd: 95,
morningBlockStart: 0,
morningBlockEnd: 47,
afternoonBlockStart: 48,
afternoonBlockEnd: 63,
eveningBlockStart: 64,
eveningBlockEnd: 95,
}

export const dialogOptions={
  title: 'Title',
  message: 'Message',
  buttons: [],
  childrenElement: () => <div />,
  //customUI: ({ onClose }) => <div>Custom UI</div>,
  closeOnEscape: false,
  closeOnClickOutside: false,
  willUnmount: () => {},
  afterClose: () => {},
  onClickOutside: () => {},
  onKeypressEscape: () => {},
  overlayClassName: "overlay-custom-class-name"
}


export const MAGICNUMBER = 99999;

export const MEMBERTITLE = ["Shri", "Smt.", "Mast", "Ms."];

export const GENDER = ["Male", "Female", "Other"];

export const BLOODGROUP = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export const MARITALSTATUS = ["Married", "Unmarried", "Widower", "Widow", "Divorcee"];

export const SELFRELATION = ["Self"];

export const CASTE = ["Humad", "NonHumad"];

export const HUMADSUBCASTRE = ["Dasha", "Visha"];

export const MUMBAIREGION = ["mumbai", "than", "thana", "bhayan", "virar", "palgh" ];

export const RELATION = [
	"Aunt",
	"Brother",
	"Brother in law",
	"Daughter",
	"Daughter in law",
	//"Family",
	"Father",
	"Father in law",
	"Gr. grand daughter",
	"Gr. grand DIL",
	"Gr. grand father",
	"Gr. grand FIL",
	"Gr. grand mother",
	"Gr. grand MIL",
	"Gr. grand son",
	"Gr. grand SIL",
	"Grand daughter",
	"Grand DIL",
	"Grand father",
	"Grand FIL",
	"Grand mother",
	"Grand MIL",
	"Grand son",
	"Grand SIL",
	"Mother",
	"Mother in law",
	"Nephew",
	"Neice",
	"Relative",
	"Sister",
	"Sister in law",
	"Son",
	"Son in law",
	"Spouse",
	"Uncle"
];

export const GENTSRELATION = [
	"Brother",
	"Brother in law",
	//"Family",
	"Father",
	"Father in law",
	"Gr. grand father",
	"Gr. grand FIL",
	"Gr. grand son",
	"Grand father",
	"Grand FIL",
	"Grand son",
	"Nephew",
	"Relative",
	"Son",
	"Son in law",
	"Spouse",
	"Uncle"
];

export const LADIESRELATION = [
	"Aunt",
	"Daughter",
	"Daughter in law",
	//"Family",
	"Gr. grand daughter",
	"Gr. grand DIL",
	"Gr. grand mother",
	"Gr. grand MIL",
	"Gr. grand SIL",
	"Grand daughter",
	"Grand DIL",
	"Grand mother",
	"Grand MIL",
	"Grand SIL",
	"Mother",
	"Mother in law",
	"Neice",
	"Relative",
	"Sister",
	"Sister in law",
	"Spouse"
];

export const JUNKED_COMPACTRELATION = [
	"Brother",
	"Brother in law",
	"Daughter",
	"DIL",
	//"Family",
	"Father",
	"Father in law",
	"Gr. grand daughter",
	"Gr. grand DIL",
	"Gr. grand father",
	"Gr. grand FIL",
	"Gr. grand mother",
	"Gr. grand MIL",
	"Gr. grand son",
	"Gr. grand SIL",
	"Grand daughter",
	"Grand DIL",
	"Grand father",
	"Grand FIL",
	"Grand mother",
	"Grand MIL",
	"Grand son",
	"Grand SIL",
	"Mother",
	"Mother in law",
	"Nephew",
	"Neice",
	"Relative",
	"Sister",
	"Sister in law",
	"Son",
	"Son in law",
	"Spouse"
];




export const MemberStyle={ 
	marginTop: 5,
	marginLeft: 5,
	marginRight: 5,
	paddingLeft: 10,
	paddingTop: 4,
	paddingBottomp: 4,
	border: 2,
	borderLeft: 10,
	//borderRight: 10,
	borderStyle: 'solid',
	borderColor: 'black',
	borderLeftColor: 'green',
	//borderRightColor: 'green',
	backgroundColor: '#F5F5F5',
	borderRadius: 7,
};
	
export const AppHeaderStyle={ 
	marginTop: 3,
	marginLeft: 1,
	paddingRight: 10,
	border: 2,
	borderLeft: 10,
	borderStyle: 'solid',
	borderColor: 'black',
	borderLeftColor: 'green',
	backgroundColor: '#F5F5F5',
	borderRadius: 7,
	};
	
export	const AppDataStyle={ 
			marginTop: 5,
			border: 2,
			borderRight: 15,
			borderStyle: 'solid',
			borderColor: 'black',
			borderRightColor: 'green',
			backgroundColor: '#F5F5F5',
			backgroundColor: '#F5F5F5',
			borderRadius: 7,
			marginBottom: 5,
			paddingLeft: 5,
	};
	
export const  SELECTSTYLE = {
	marginBottom: 20, 
	marginLeft: 15,
	paddingLeft: 10,
	width: "100%"
} ;

export const  NORMALSELECTSTYLE = {
	marginBottom: 20, 
	marginLeft: 15,
	paddingLeft: 10,
} ;
	
export const MOBROWSPERPAGE = 5;
export const NONMOBROWSPERPAGE = 8;

export const PAGELIST = {
PRWS: "PRWS",
PJYM: "PJYM",
HUMDAD: "HUMAD",
FAMILY: "FAMILY",
APPLICATION: "APPLICATION",
ADMIN: "ADMIN",
DASHBOARD: "DASHBOARD",
};

export const STATUS_INFO = 
{
ERROR: -2,
FAILURE: -2,
CANCEL: -1,
OKAY: 1,
SUCCESS: 1,
INFO: 2,
};



export const APPLICATIONTYPES = {
	editGotra:  			"Edit Gotra",
	addMember: 				"Add Member",
	editMember: 			"Edit Member",
	memberCeased: 		"Member Ceased",
	spouseDetails: 		"Spouse Details",
	memberHOD: 				"New HOD",
	transferMember:		"Transfer members",
};


export const APPLICATIONSTATUS = {
	approved: "Approved",
	rejected: "Rejected",
	pending:  "Pending"
};

export const VALUEDIRECTION = {
	previous: -1,
	next: 1,
	current: 0
};

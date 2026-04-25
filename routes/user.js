otpGenerator = require('otp-generator')
router = express.Router();
const { encrypt, decrypt, dbencrypt, dbdecrypt, dbToSvrText, 
  akshuGetGroup, akshuUpdGroup, akshuGetGroupMembers,
  akshuGetAuction, akshuGetTournament,
  getTournamentType,
  svrToDbText, getLoginName, getDisplayName, getMemberName, 
	sendCricMail, sendCricHtmlMail,
  akshuGetUser, akshuUpdUser,
  getMaster, setMaster,
  getDate,
} = require('./functions'); 


const {
	memberGetAll, memberGetHodMembers,
	memberAddOne, memberAddMany,
	memberUpdateOne, memberUpdateMany,
	memberGetByMidOne, memberGetByHidMany, memberGetByMidMany, memberGetByMobileOne, memberGetByEmailOne,
	
} = require('./dbfunctions');

const SENDCAPTAOVEREMAIL = true;

 
var _group;

var SUGGESTIONDETAILS = {
  header: '',
  email:  ''
}

 

/* GET all users listing. */
router.get('/', function (req, res, next) {
  // CricRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  if (req.url == "/")
    publish_users(res, {});
  else
    next('route');
});


router.get('/svrtoclient/:text', async function (req, res, next) {
  // CricRes = res;
  setHeader(res);
  var { text } = req.params;
	//let x = dbdecrypt(text);
	//console.log()
  sendok(res, svrToDbText(text));
});


router.get('/encrypt/:text', function (req, res, next) {
  // CricRes = res;
  setHeader(res);
  let { text } = req.params;
  const hash = encrypt(text);
  console.log(hash);
  sendok(res, hash);

});

router.get('/decrypt/:text', function (req, res, next) {
  // CricRes = res;
  setHeader(res);
  let { text } = req.params;
  const hash = decrypt(text);
  console.log(hash);
  sendok(res, hash);

});

router.get('/dbencrypt/:text', function (req, res, next) {
  // CricRes = res;
  setHeader(res);
  let { text } = req.params;
  const hash = dbencrypt(text);
  console.log(hash);
  sendok(res, hash);

});

router.get('/dbdecrypt/:text', function (req, res, next) {
  // CricRes = res;
  setHeader(res);
  let { text } = req.params;
  const hash = dbdecrypt(text);
  console.log(hash);
  sendok(res, hash);

});



//=============== LOGIN
const validNumbers = [
	{name: '8080820084', uid: 1, type: 'Admin'},
	{name: '9920301805', uid: 2, type: 'User'},
	{name: '9867100677', uid: 3, type: 'Admin'},
	{name: '9867061850', uid: 4, type: 'Guest'}
	];
	
	
router.get('/jaijinendra/:myData', async function (req, res, next) {
  setHeader(res);
  var {myData } = req.params;
  var isValid = false;
  
	var myData = JSON.parse(myData);
	var userName = decrypt(myData.userName);

	var myRec;
	var myEmail = "-";
	var myEmail1 = '-';
	var myMobile = "";
	
	if (myData.isMobile) {
		myRec = await memberGetByMobileOne( userName )
		if (myRec) myEmail = dbdecrypt(myRec.email);
		myMobile = userName;
	} 
	else {
		myRec = await memberGetByEmailOne ( userName );
      //if (!myRec) return senderr(res, 601, 'Currently not supported');
		myEmail = userName;
		if (myRec) myMobile = (myRec.mobile.length === 10) ? myRec.mobile : "";
	}
	console.log(myEmail, myMobile);
	
  let myCaptha = await M_Password.findOne({mobile: userName});
  if (!myCaptha) {
    myCaptha = new M_Password();
    myCaptha.mobile = userName;
    myCaptha.captcha = otpGenerator.generate(OTP_LENGTH, { specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false });
	  console.log(`New captha ${myCaptha.captcha}`);
  }
  console.log(myCaptha.captcha);
  //console.log(`***${myEmail}***`);
  	
	if (myMobile) {
		// Send OPT over email
		var mobMsg = "******" + myMobile.substring(6);
	}
	//console.log(emailMsg, mobMsg);
   
   var tmp = "";
   if (mobMsg != "") {
      if (tmp == "") tmp = "OTP sent over ";
         tmp += mobMsg;
   }
   console.log(tmp);
   if (emailMsg != "") {
      if (tmp == "") 
         tmp = "OTP sent over "; 
      else
         tmp += " and ";
      tmp += emailMsg;
      //var tmp = "OTP sent over " + mobMsg + (((mobMsg !== "") && (emailMsg !== "")) ? " and " : "") + emailMsg;
	}
   
  sendok(res, {captcha: myCaptha.captcha, msg: tmp });

	// first save the captcha
	myCaptha.save();

	var emailMsg = "";
	var mobMsg = "";
	if (myEmail !== "-") {
		var tmpValidTimeOffset = Number(process.env.PASSWORDLINKVALIDTIME);
		/*let htmlText = `<div style="background-image: url('https://i.pinimg.com/originals/29/9c/a1/299ca187762b51cb637f29cf7472e574.png');">
			<h4 style="text-align: left;"><strong>Dear Member,</strong></h4>
			<p>Greetings from Pratapgarh Rajasthan Welfare Samiti</p>
			<p><span style="text-align: left;">Login with OTP </span><span style="text-align: left;"><strong>${myCaptha.captcha}</strong></span></p>
			<p>Kindly note that this OTP is valid only for ${process.env.PASSWORDLINKVALIDTIME} minutes.</p>
			<p><span style="text-align: left;"><strong>for Pratapgarh Rajasthan Welfare Samiti</strong></span></p>
			</div>`*/
		let htmlText = `<div>
			<h4 style="text-align: left;"><strong>Dear Member,</strong></h4>
			<p>Greetings from Pratapgarh Rajasthan Welfare Samiti</p>
			<p><span style="text-align: left;">Login with OTP </span><span style="text-align: left;"><strong>${myCaptha.captcha}</strong></span></p>
			<p>Kindly note that this OTP is valid only for ${process.env.PASSWORDLINKVALIDTIME} minutes.</p>
			<p><span style="text-align: left;"><strong>for Pratapgarh Rajasthan Welfare Samiti</strong></span></p>
			</div>`
		
		if (SENDCAPTAOVEREMAIL) {
			let resp = await sendCricHtmlMail(myEmail, PRWSMAILHEADER.login, htmlText);
		}
		
		var tmp = myEmail.split("@");
		console.log(tmp[0]);
		var emailMsg = ((tmp[0].length > 4) ? ("******" + tmp[0].substring(tmp[0].length - 4)) : "****" ) + "@" + tmp[1];
	}
	

});

var directLogin = ['2143658709']; //['8080820084', '9867100677', '9867061850', '9819804128', '1234567890'];

router.get('/orgpadmavatimata/:uMobile/:uPassword', async function (req, res, next) {
  setHeader(res);
  var {uMobile, uPassword } = req.params;
  //uMobile = Number(uMobile);

	if (!directLogin.includes(uMobile)) {
		// verify captcha
		console.log(uMobile, uPassword);
		let myCaptha = await M_Password.findOne({mobile: uMobile});
		if (!myCaptha) return senderr(res, 601, "Invalid password");
		console.log(myCaptha);
		if (myCaptha.captcha !== uPassword) return senderr(res, 601, "Invalid password");
	}
 
	let myAdmin = {
		mid: 0, 
		superAdmin: false, humadAdmin: false, 
		pjymAdmin: false, prwsAdmin: false, 
		pmmAdmin: false
	};
	var isMember = false;
	var isAdmin = false;
  //let myMem = await M_Member.findOne({$or :[{mobile: uMobile}, {mobile1: uMobile}] });
	let myMem = await memberGetByMobileOne(uMobile);
	
  if (myMem) {
		isMember = true;
		myAdmin = await M_Admin.findOne({mid: myMem.mid});
		if (!myAdmin) {
			myAdmin = {
				mid: myMem.mid, 
				superAdmin: false, humadAdmin: false, 
				pjymAdmin: false, prwsAdmin: false, 
				pmmAdmin: false
			};
		}
		else {
			isAdmin = true;
		}
	}
	//console.log(myAdmin);

  sendok(res, {user: myMem, admin: myAdmin, isMember: isMember});

	// Make logger entry of use login.
	let myLogRec = new M_PrwsLog();
	myLogRec.date = new Date();
	if (myMem) {
		myLogRec.mid = myMem.mid;
		myLogRec.name = getMemberName(myMem);
		myLogRec.desc = `Login by ${getMemberName(myMem)}`;
	}
	else {
		myLogRec.mid = 0;
		myLogRec.name = `Guest with mobile number ${uMobile}`;
		myLogRec.desc = `Login by ${uMobile}`;
	}
	myLogRec.isAdmin = isAdmin;
	myLogRec.action = PRWSACTION.login;
	myLogRec.data = '';
	myLogRec.referenceId = 0;
	myLogRec.status = true;
	await myLogRec.save();
	
});

router.get('/padmavatimata/:myData', async function (req, res, next) {
  setHeader(res);
	var {myData } = req.params;
  var isValid = false;
  
	var myData = JSON.parse(myData);
	var userName = decrypt(myData.userName).toLowerCase();
	
	if (!directLogin.includes(userName)) {
		let myCaptha = await M_Password.findOne({mobile: userName});
		if (!myCaptha) return senderr(res, 601, "Invalid password");
		console.log(myCaptha);
		if (myCaptha.captcha !== myData.password) return senderr(res, 601, "Invalid password");
	}
 
	let myAdmin = {
		mid: 0, 
		superAdmin: false, humadAdmin: false, 
		pjymAdmin: false, prwsAdmin: false, 
		pmmAdmin: false
	};
	var isMember = false;
	var isAdmin = false;
  //let myMem = await M_Member.findOne({$or :[{mobile: uMobile}, {mobile1: uMobile}] });
	let myMem = (myData.isMobile) ?
		await memberGetByMobileOne(userName) :
		await memberGetByEmailOne(userName);
	
  if (myMem) {
		isMember = true;
      myMem.email = dbToSvrText(myMem.email);
		myAdmin = await M_Admin.findOne({mid: myMem.mid});
		if (!myAdmin) {
			myAdmin = {
				mid: myMem.mid, 
				superAdmin: false, humadAdmin : false, 
				pjymAdmin: false, prwsAdmin: false, 
				pmmAdmin: false
			};
		}
		else {
			isAdmin = true;
		}
	}
	
  sendok(res, {user: myMem, admin: myAdmin, isMember: isMember, userName: userName, smsImplemented: SMSIMPLEMENTED});

	// Make logger entry of use login.
   if ((LOG_LOGINLOGOUT) || (!isMember)){
		 console.log('Making log for login');
      let myLogRec = new M_PrwsLog();
      myLogRec.date = new Date();
      if (myMem) {
         myLogRec.mid = myMem.mid;
         myLogRec.name = getMemberName(myMem);
         myLogRec.desc = `Login by ${getMemberName(myMem)}`;
      }
      else {
         myLogRec.mid = 0;
         myLogRec.name = `Guest-${userName}`;
         myLogRec.desc = `Login by Guest-${userName})`;
      }
			console.log(myLogRec.desc);
      myLogRec.isAdmin = isAdmin;
      myLogRec.action = PRWSACTION.login;
      myLogRec.data = '';
      myLogRec.referenceId = 0;
      myLogRec.status = true;
      await myLogRec.save();
   }
	
});


router.get('/logout/:myData', async function (req, res, next) {
  setHeader(res);
  var { myData } = req.params;
	sendok(res, "Done");			// First confirm to client for logout

	console.log('In LOGOUT');
	console.log(myData);
	myData = JSON.parse(myData);
	
	if ((LOG_LOGINLOGOUT) || (myData.mid === 0)) {
		// Make logger entry of use login.
		console.log('making log entry for logout');
		let myLogRec = new M_PrwsLog();
		myLogRec.date = new Date();
		if (myData.mid > 0) {
			myLogRec.mid = myData.mid;
			myLogRec.name = myData.name;
			myLogRec.desc = `Logout by ${myData.name}`;
		}
		else {
			myLogRec.mid = 0;
			myLogRec.name = myData.name;
			myLogRec.desc = `Logout by ${myData.name}`;
		}
		myLogRec.isAdmin = myData.isAdmin;
		myLogRec.action = PRWSACTION.logout;
		myLogRec.data = '';
		myLogRec.referenceId = 0;
		myLogRec.status = true;
		await myLogRec.save();
		console.log(myLogRec);
	}
});

router.get('/suggestion/:myData', async function (req, res, next) {
  setHeader(res);
  var { myData } = req.params;
   myData = JSON.parse(myData);
	console.log(myData);
   
   var mySuggest = new M_Suggestion();
   var tmp = await M_Suggestion.find({}, {sid: 1}).sort({sid: -1}).limit(1);
   mySuggest.sid = (tmp.length > 0) ? tmp[0].sid + 1 : 1;
   mySuggest.date = new Date();
   mySuggest.name = myData.name;
   mySuggest.mobile = myData.mobile;
   mySuggest.email = svrToDbText(myData.email);
   mySuggest.remarks = myData.remarks;
   mySuggest.status = true;
   await mySuggest.save();   
	sendok(res, "Done");			// First confirm to client for suggestion received
   
   // Now send the suggestion by email
	if (true) {
		//var tmpValidTimeOffset = Number(process.env.PASSWORDLINKVALIDTIME);
		/*let htmlText = `<div style="background-image: url('https://i.pinimg.com/originals/29/9c/a1/299ca187762b51cb637f29cf7472e574.png');">
			<h4 style="text-align: left;"><strong>Dear Member,</strong></h4>
			<p>Greetings from Pratapgarh Rajasthan Welfare Samiti</p>
			<p><span style="text-align: left;">Login with OTP </span><span style="text-align: left;"><strong>${myCaptha.captcha}</strong></span></p>
			<p>Kindly note that this OTP is valid only for ${process.env.PASSWORDLINKVALIDTIME} minutes.</p>
			<p><span style="text-align: left;"><strong>for Pratapgarh Rajasthan Welfare Samiti</strong></span></p>
			</div>`*/
		let htmlText = `<div>
			<h4 style="text-align: left;"><strong>Suggestion from ${mySuggest.name},</strong></h4>
			<p>Suggestion ID:    ${mySuggest.sid}</p>
         <p>Name:             ${mySuggest.name}</p>
         <p>Mobile:           ${mySuggest.mobile}</p>
         <p>Email:            ${decrypt(myData.email)}</p>
			<p><span style="text-align: left;">${myData.remarks}</span></p>
			</div>`
		
		if (true) { 
		    if (SUGGESTIONDETAILS.email === "") {
		        console.log(LABELS.contactemail);
		        console.log(LABELS.contactheader);
		        var tmp = await M_Setting.findOne({label: LABELS.contactemail});
		        console.log(tmp);		        
		        SUGGESTIONDETAILS.email = tmp.value;
		        tmp = await M_Setting.findOne({label: LABELS.contactheader});
		        console.log(tmp);
		        SUGGESTIONDETAILS.header = tmp.value;
		        console.log(SUGGESTIONDETAILS);		    
		    }
			let resp = await sendCricHtmlMail(SUGGESTIONDETAILS.email, SUGGESTIONDETAILS.header+mySuggest.sid, htmlText);
		}
		
	}
});




router.get('/padmavatimataexcel/:uMobile/:uPassword', async function (req, res, next) {
  setHeader(res);
  var {uMobile, uPassword } = req.params;
  uMobile = Number(uMobile);
  //uPassword = decrypt(uPassword);

  let myCaptha = await M_Password.findOne({mobile: uMobile});
  if (!myCaptha) return senderr(res, 601, "Invalid password");
  if (myCaptha.captcha !== uPassword) return senderr(res, 601, "Invalid password");

	let  myAdmin = {superAdmin: false, humadAdmin: false, pjymAdmin: false, prwsAdmin: false};
  if (uMobile == 8080820084) myAdmin.superAdmin = true;

	console.log(myAdmin);
  sendok(res, myAdmin);

});


router.get('/test', async function (req, res, next) {
   setHeader(res);
   var myRec = new M_Advertisement();
   myRec.topLeft = 'SAMPLE_ADV.JPG';
   myRec.bottomLeft = 'SAMPLE_ADV.JPG';
   myRec.topRight = 'SAMPLE_ADV.JPG';
   myRec.bottomRight = 'SAMPLE_ADV.JPG';
   myRec.delay = 5;
   myRec.active = true;
   await myRec.save();
  sendok(res, "Done");

});

router.get('/getadvert', async function (req, res, next) {
   setHeader(res);
   var myLpRec = await M_LandingPage.findOne({});
   // now get the customer details
   var myData = {
      topLeft: TOPLEFTAD,
      topRight: TOPRIGHTAD,
      bottomLeft: BOTTOMLEFTAD,
      bottomRight: BOTTOMRIGHTAD,
      delay: myLpRec.delay
   };
   console.log(myData);
   
   var currTime = new Date();
   var tmp = await M_Advertisement.findOne({customerName: myLpRec.topLeft});
   if (tmp)
   if (tmp.expiryDate > currTime)
      myData.topLeft = tmp.imageName;
   else
      console.log("TL expired");
   
   var tmp = await M_Advertisement.findOne({customerName: myLpRec.topRight});
   if (tmp)
   if (tmp.expiryDate > currTime)
      myData.topRight = tmp.imageName;
   else
      console.log("TR expired");

   var tmp = await M_Advertisement.findOne({customerName: myLpRec.bottomLeft});
   if (tmp)
   if (tmp.expiryDate > currTime)
      myData.bottomLeft = tmp.imageName;
   else
      console.log("BL expired");
   
   var tmp = await M_Advertisement.findOne({customerName: myLpRec.bottomRight});
   if (tmp)
   if (tmp.expiryDate > currTime)
      myData.bottomRight = tmp.imageName;
   else
      console.log("BR expired");
   
  sendok(res, myData);

});

router.get('/addCust', async function (req, res, next) {
   setHeader(res);
   var myRec = new  M_Advertisement();
   myRec.customerName = "Salgia&Co"
   myRec.imageName = TOPLEFTAD;
   myRec.expiryDate = new Date(2026,1,1)
   await myRec.save();
  sendok(res, myRec);

});


router.get('/addSetting/:label/:value', async function (req, res, next) {
  setHeader(res);
  var {label, value } = req.params;
  
    var myRec = new  M_Setting();
    myRec.label = label.toLowerCase();
   myRec.value = value;
   await myRec.save();
  sendok(res, myRec);

});

router.get('/getSetting/:label', async function (req, res, next) {
  setHeader(res);
  var {label, value } = req.params;
  
    var myRec = await M_Setting.findOne({ label: label.toLowerCase() });
    if (myRec)
        sendok(res, myRec);
    else
        senderr(res, 601, 'Not found');
});



async function publish_users(res, filter_users) {
  //console.log(filter_users);
  var ulist = await User.find(filter_users);
  // ulist = _.map(ulist, o => _.pick(o, ['uid', 'userName', 'displayName', 'defaultGroup']));
  ulist = _.sortBy(ulist, 'userName');
  sendok(res, ulist);
}

const EQSTR = '=================== ';
const HPS = '<strong>';
const HPE = '</strong>';


async function mailInfo(email, header, family, member) {
	let htmlText = `<div>
		<h4 style="text-align: left;"><strong>Dear Member,</strong></h4>

		<p>Greetings from Pratapgarh Rajasthan Welfare Samiti</p>
		<p>Here are the details of your family. If any changes required login to PRWS web site www.prws.in and apply for changes. Member can login using registered mobile number or email. OTP will be sent to the registered email</p>
		<pre>${family}</pre>
		<pre>${member}</pre>
		<p><span style="text-align: left;"><strong>for Pratapgarh Rajasthan Welfare Samiti</strong></span></p>
		</div>`
		
        //console.log(email);
        //email = 'atul@salgia.in';
        
	    let resp = await sendCricHtmlMail(email, header, htmlText);
}


router.get('/sendinfo', async function (req, res, next) {
  setHeader(res);
  var {myData } = req.params;
  var isValid = false;

    let allHod = await M_Hod.find({active: true}).sort({hid: 1})
    let allMembers = [];   // Will get members family by family

    // Get the Start Hid and End Hid
    	var tmp = await M_Setting.findOne({label: LABELS.sendInfoStartHid});
    	var StartHid = Number(tmp.value);
    	var tmp = await M_Setting.findOne({label: LABELS.sendInfoEndHid});
    	var EndHid = Number(tmp.value);

    // No get information about email if
    tmp = await M_Setting.findOne({label: LABELS.sendInfoMail});
    var sendInfoMail = tmp.value;
    
    for(var i=0; i< allHod.length; ++i) {
        var myHod = allHod[i];
        if ((myHod.hid < StartHid) || (myHod.hid > EndHid)) continue;

        var familyInfo='';
        var memDetails = '';

        
        familyInfo += `${HPS}${EQSTR} Family details\n\n${HPE}`;
        familyInfo += `Gotra  : ${myHod.gotra}\n`;
        familyInfo += `Village: ${myHod.village}\n`;
        familyInfo += `Caste  : ${(myHod.caste === 'Humad') ? (myHod.subCaste + " ") : "" } ${myHod.caste}\n`;
        familyInfo += `Address: ${myHod.resAddr1}\n`;
        if (myHod.resAddr2 !==  '') familyInfo += `         ${myHod.resAddr2}\n`;
        if (myHod.resAddr3 !==  '') familyInfo += `         ${myHod.resAddr3}\n`;
        if (myHod.resAddr4 !==  '') familyInfo += `         ${myHod.resAddr4}\n`;
        if (myHod.resAddr5 !==  '') familyInfo += `         ${myHod.resAddr5}\n`;
        if (myHod.resAddr6 !==  '') familyInfo += `         ${myHod.resAddr6}\n`;
        familyInfo += `Suburb : ${myHod.suburb}\n`;
        familyInfo += `Pin    : ${myHod.pinCode}\n`;
        familyInfo += `Dist   : ${myHod.district}\n`;
        familyInfo += `Div    : ${myHod.division}\n`;

        familyInfo += `City   : ${myHod.city}\n`;
        familyInfo += `State  : ${myHod.state}\n`;
        familyInfo += `Country: ${(myHod.indianResident) ? 'India' : 'No'}\n`;
        familyInfo += '\n';
        //console.log(familyInfo);
        
        // Now prepare data for all the manager 
        allMembers = await memberGetByHidMany(myHod.hid);
        //console.log(allMembers.length);
        for(var m = 0; m < allMembers.length; ++m) {
        //for(var m = 0; m < 1; ++m) {
          let myMember = allMembers[m];
          //console.log(myMember.hid, myMember.mid);
          var myEmail = dbdecrypt(myMember.email);
          memDetails += `${HPS}${EQSTR} Member: ${getMemberName(myMember, true)}\n\n${HPE}`;
          //memDetails += `Title      : ${myMember.title}\n`;
          //memDetails += `Last Name  : ${myMember.lastName}\n`;
          //memDetails += `Middle Name: ${myMember.middleName}\n`;
          //memDetails += `First Name : ${myMember.firstName}\n`;
          //memDetails += `Alias      : ${myMember.alias}\n`;
          
          memDetails += `Relation   : ${myMember.relation}\n`;
          memDetails += `DateOfBirth: ${getDate(myMember.dob)}\n`;
          memDetails += `Gender     : ${myMember.gender}\n`;
          memDetails += `Blood Group: ${myMember.bloodGroup}\n`;
          memDetails += `Marital Sts: ${myMember.emsStatus}\n`;
          if (myMember.emsStatus.toUpperCase() === 'MARRIED')  {   // mrrried
              var mySpouse = allMembers.find(x => x.mid === myMember.spouseMid);
              if (!mySpouse) mySpouse = memberGetByMidOne(myMember.spouseMid);
              memDetails += `Spouse     : ${getMemberName(mySpouse, true)}\n`;
              memDetails += `Marr. Date : ${getDate(myMember.dob)}\n`;
          }
          else {
              memDetails += `Spouse     :\n`;
              memDetails += `Marr. Date :\n`;
          }
          
          memDetails += `Mobile1    : ${myMember.mobile}\n`;
          memDetails += `Mobile2    : ${myMember.mobile1}\n`;
          memDetails += `Email1     : ${dbdecrypt(myMember.email)}\n`;
          memDetails += `Email2     : ${dbdecrypt(myMember.email1)}\n`;
          memDetails += `Education  : ${myMember.education}\n`;
          memDetails += `Edu.Level  : ${myMember.educationLevel}\n`;
          memDetails += `Edu.Cat.   : ${myMember.educationCategory}\n`;
          memDetails += `Edu.Field  : ${myMember.educationField}\n`;
          memDetails += `Office     : ${myMember.officeName}\n`;
          memDetails += `Office.Addr: ${myMember.officeAddr}\n`;
          memDetails += `Office. Ph.: ${myMember.officePhone}\n`;
          memDetails += `PRWS Menber: ${(myMember.prwsMember) ? 'Yes' : 'No' }\n`;
          memDetails += `HumadMenber: ${(myMember.humadMember) ? 'Yes' : 'No' }\n`;
          memDetails += `PJYM Menber: ${(myMember.pjymMember) ? 'Yes' : 'No' }\n`;

          
          memDetails += '\n';
          
          //console.log(memDetails);
        }
        
        // Now data is ready
        //for(var m = 0; m < allMembers.length; ++m) {
        for(var m = 0; m < allMembers.length; ++m) {
            var myEmail = '';
            
            if (sendInfoMail.toUpperCase() === 'YES')
               myEmail = dbdecrypt(allMembers[m].email);
            else if (sendInfoMail.toUpperCase() === 'NO')
               myEmail = '-';
            else
               myEmail = sendInfoMail.toLowerCase();
            
            if (myEmail === "-") {
                console.log(allMembers[m].hid, allMembers[m].mid, 'Blank email in db');            
            }
            else {
                console.log(allMembers[m].hid, allMembers[m].mid, myEmail);
                await mailInfo(myEmail, PRWSMAILHEADER.memberInfo, familyInfo, memDetails);
            }
        }
    }
    return sendok(res, `Total HODs ${allHod.length}`);
    console.log('Why here');
    
    
 		let htmlText = `<div>
			<h4 style="text-align: left;"><strong>Dear Member,</strong></h4>

			<p>Greetings from Pratapgarh Rajasthan Welfare Samiti</p>
			<p>Here are the details of your family</p>
			<p>${familyInfo}</p>
			<p>${membersInfo}</p>
			<p>Kindly note that this OTP is valid only for ${process.env.PASSWORDLINKVALIDTIME} minutes.</p>
			<p><span style="text-align: left;"><strong>for Pratapgarh Rajasthan Welfare Samiti</strong></span></p>
			</div>`
		

	    let resp = await sendCricHtmlMail(myEmail, PRWSMAILHEADER.memberInfo, htmlText);
		
		var tmp = myEmail.split("@");
		console.log(tmp[0]);
		var emailMsg = ((tmp[0].length > 4) ? ("******" + tmp[0].substring(tmp[0].length - 4)) : "****" ) + "@" + tmp[1];


  sendok(res, {captcha: myCaptha.captcha, msg: tmp });
	



});
function sendok(res, usrmgs) { res.send(usrmgs); }
function senderr(res, errcode, errmsg) { res.status(errcode).send({error: errmsg}); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}
module.exports = router;

otpGenerator = require('otp-generator')
router = express.Router();
const { encrypt, decrypt, dbencrypt, dbdecrypt, dbToSvrText, 
  akshuGetGroup, akshuUpdGroup, akshuGetGroupMembers,
  akshuGetAuction, akshuGetTournament,
  getTournamentType,
  svrToDbText, getLoginName, getDisplayName, 
	sendCricMail, sendCricHtmlMail,
  akshuGetUser, akshuUpdUser,
  getMaster, setMaster,
} = require('./functions'); 


const is_Captain = true;
const is_ViceCaptain = false;
const WITH_CVC  = 1;
const WITHOUT_CVC = 2;

var _group;
 

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
	
	
router.get('/jaijinendra/:uMobile', async function (req, res, next) {
  setHeader(res);
  var {uMobile } = req.params;
  var isValid = false;
  uMobile = Number(uMobile);
  

  let myCaptha = await M_Password.findOne({mobile: uMobile});
 
  if (!myCaptha) {
    myCaptha = new M_Password();
    myCaptha.mobile = uMobile;
    myCaptha.captcha = otpGenerator.generate(8, { specialChars: false });
	  console.log(`New captha ${myCaptha.captcha}`);
	  myCaptha.save();
  }

  console.log('3', myCaptha);
  //console.log(`Password is ${myCaptha.captcha}`);
  return sendok(res, myCaptha);

    

});

var directLogin = [8080820084, 9867061850, 9819804128, 1234567890];

router.get('/padmavatimata/:uMobile/:uPassword', async function (req, res, next) {
  setHeader(res);
  var {uMobile, uPassword } = req.params;
  uMobile = Number(uMobile);
  //uPassword = decrypt(uPassword);

	if (!directLogin.includes(uMobile)) {
		// verify captcha
		console.log(uMobile, uPassword);
		let myCaptha = await M_Password.findOne({mobile: uMobile});
		if (!myCaptha) return senderr(res, 601, "Invalid password");
		console.log(myCaptha);
		if (myCaptha.captcha !== uPassword) return senderr(res, 601, "Invalid password");
		console.log("All fine");
	}
 
	let myAdmin = {
		mid: 0, 
		superAdmin: false, humadAdmin: false, 
		pjymAdmin: false, prwsAdmin: false, 
		pmmAdmin: false
	};
	var isMember = false;
  let myMem = await M_Member.findOne({$or :[{mobile: uMobile}, {mobile1: uMobile}] });
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
	}
	console.log(myAdmin);
  sendok(res, {user: myMem, admin: myAdmin, isMember: isMember});
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






async function publish_users(res, filter_users) {
  //console.log(filter_users);
  var ulist = await User.find(filter_users);
  // ulist = _.map(ulist, o => _.pick(o, ['uid', 'userName', 'displayName', 'defaultGroup']));
  ulist = _.sortBy(ulist, 'userName');
  sendok(res, ulist);
}


function sendok(res, usrmgs) { res.send(usrmgs); }
function senderr(res, errcode, errmsg) { res.status(errcode).send({error: errmsg}); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}
module.exports = router;

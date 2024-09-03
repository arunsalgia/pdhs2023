var router = express.Router();
const { 
	getLoginName, getDisplayName,
} = require('./functions'); 

async function updateCountryInHod(oldCountry, newCountry) {
	let allHods = await M_Hod.find({active: true, country: oldCountry}); 
	for(let i=0; i<allHods.length; ++i) {
		allHods[i].country = newCountry;
		await allHods[i].save();
	}
}


router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

router.get('/list', async function(req, res, next) {
  setHeader(res);

  var tmp = await M_Country.find({}, {_id: 0, country: 1}).sort({country: 1});
	sendok(res, tmp);
});

router.get('/listfromhod', async function(req, res, next) {
  setHeader(res);

  var tmp = await M_Hod.find({active: true, country: {$ne: ''} }, {_id: 0, country: 1}).sort({country: 1}).sort({country: 1});
	tmp = _.uniqBy(tmp, 'country');
	sendok(res, tmp);
});

router.get('/add/:newCountry', async function(req, res, next) {
  setHeader(res);
  
  var {newCountry} = req.params;
	newCountry = getDisplayName(newCountry);	
	console.log(newCountry);

	var mRec = await M_Country.findOne({country: newCountry});
	if (mRec) return senderr(res, 601, "City already in database");

	mRec = new M_Country();
	mRec.id = newCountry;
	mRec.country = newCountry;
	mRec.enabled = true;
	await mRec.save();
	sendok(res, mRec);
	
});

router.get('/renametonew/:oldCountry/:newCountry', async function(req, res, next) {
  setHeader(res);
  
  var {oldCountry, newCountry} = req.params;
	oldCountry = getDisplayName(oldCountry);
	newCountry = getDisplayName(newCountry);
	
	console.log(oldCountry, newCountry);

	let tmp = await M_Country.findOne({country: newCountry});
	if (tmp) return senderr(res, 601, "new found. Duplicate error");
	
	let rec1 = await M_Country.findOne({country: oldCountry});
	if (!rec1)  return senderr(res, 602, "old not found");

	rec1.id = newCountry;
	rec1.country = newCountry;
	rec1.enabled = true;
	await rec1.save();

	await updateCountryInHod(oldCountry, newCountry)


	sendok(res, rec1);

});


router.get('/renametoexisting/:oldCountry/:newCountry', async function(req, res, next) {
  setHeader(res);
  
  var {oldCountry, newCountry} = req.params;
	oldCountry = getDisplayName(oldCountry);
	newCountry = getDisplayName(newCountry);

	let tmp = await M_Country.findOne({country: oldCountry})
	if (!tmp) return senderr(res, 602, "Old City not found in database");

	let mRec = await M_Country.findOne({country: newCountry})
	if (!mRec) return senderr(res, 601, "New City not found in database");

	// now rename in HOD
	await updateCountryInHod(oldCountry, newCountry);

	// just delete the old one
	await M_Country.deleteOne({country: oldCountry});

	sendok(res, mRec);
});


router.get('/delete/:delCountry', async function(req, res, next) {
  setHeader(res);
  
  var { delCountry } = req.params;
	
	//console.log("In delete...........................");
	delCountry = getDisplayName(delCountry);
	console.log(delCountry);
	
	// confirm if HOD is not using this country
	let temp = await M_Hod.find({active: true, country: delCountry});
	if (temp.length > 0) return senderr(res, 601, "In use");

	console.log("this country is not in use");
	await M_Country.deleteOne({country: delCountry});
	console.log("Deleted....");
	sendok(res, `City ${delCountry} deleted`);
});


router.get('/sethod/:oldCountry/:newCountry', async function(req, res, next) {
  setHeader(res);
	
	var { oldCountry, newCountry } = req.params;

	await updateCountryInHod(getDisplayName(oldCountry), getDisplayName(newCountry))
	sendok(res, "Done");
});


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;
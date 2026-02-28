var router = express.Router();
const { 
	getLoginName, getDisplayName,
} = require('./functions'); 

async function updateCityInHod(oldCity, newCity) {
	let allHods = await M_Hod.find({active: true, city: oldCity}); 
	for(let i=0; i<allHods.length; ++i) {
		allHods[i].city = newCity;
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

  var tmp = await M_City.find({}, {_id: 0, city: 1}).sort({city: 1});
	sendok(res, tmp);
});

router.get('/listfromhod', async function(req, res, next) {
  setHeader(res);

  var tmp = await M_Hod.find({active: true, city: {$ne: ''} }, {_id: 0, city: 1}).sort({city: 1}).sort({city: 1});
	tmp = _.uniqBy(tmp, 'city');
	sendok(res, tmp);
});

router.get('/add/:newCity', async function(req, res, next) {
  setHeader(res);
  
  var {newCity} = req.params;
	newCity = getDisplayName(newCity);	
	console.log(newCity);

	var mRec = await M_City.findOne({city: newCity});
	if (mRec) return senderr(res, 601, "City already in database");

	mRec = new M_City();
	mRec.id = newCity;
	mRec.city = newCity;
	mRec.enabled = true;
	await mRec.save();
	sendok(res, mRec);
	
});

router.get('/renametonew/:oldCity/:newCity', async function(req, res, next) {
  setHeader(res);
  
  var {oldCity, newCity} = req.params;
	oldCity = getDisplayName(oldCity);
	newCity = getDisplayName(newCity);
	
	console.log(oldCity, newCity);

	let tmp = await M_City.findOne({city: newCity});
	if (tmp) return senderr(res, 601, "new found. Duplicate error");
	
	let rec1 = await M_City.findOne({city: oldCity});
	if (!rec1)  return senderr(res, 602, "old not found");

	rec1.id = newCity;
	rec1.city = newCity;
	rec1.enabled = true;
	await rec1.save();

	await updateCityInHod(oldCity, newCity)


	sendok(res, rec1);

});


router.get('/renametoexisting/:oldCity/:newCity', async function(req, res, next) {
  setHeader(res);
  
  var {oldCity, newCity} = req.params;
	oldCity = getDisplayName(oldCity);
	newCity = getDisplayName(newCity);

	let tmp = await M_City.findOne({city: oldCity})
	if (!tmp) return senderr(res, 602, "Old City not found in database");

	let mRec = await M_City.findOne({city: newCity})
	if (!mRec) return senderr(res, 601, "New City not found in database");

	// now rename in HOD
	await updateCityInHod(oldCity, newCity);

	// just delete the old one
	await M_City.deleteOne({city: oldCity});

	sendok(res, mRec);
});


router.get('/delete/:delCity', async function(req, res, next) {
  setHeader(res);
  
  var { delCity } = req.params;
	
	//console.log("In delete...........................");
	delCity = getDisplayName(delCity);
	console.log(delCity);
	
	// confirm if HOD is not using this city
	let temp = await M_Hod.find({active: true, city: delCity});
	if (temp.length > 0) return senderr(res, 601, "In use");

	console.log("this city is not in use");
	await M_City.deleteOne({city: delCity});
	console.log("Deleted....");
	sendok(res, `City ${delCity} deleted`);
});


router.get('/test/:name', async function(req, res, next) {
  setHeader(res);
	var { name } = req.params;
	
	var tmpList = name.split(" ");
	for(var i=0; i<tmpList.length; ++i) {
		tmpList[i] = getDisplayName(tmpList[i].trim());
	}
	name = tmpList.join(" ");

	var tmpList = name.split(".");
	for(var i=0; i<tmpList.length; ++i) {
		tmpList[i] = getDisplayName(tmpList[i]);
	}
	name = tmpList.join(".");

	sendok(res, name);
	return;

getDisplayName(newCity);	
	var allRec = await M_Hod.find({active: true});
	var cityList = _.map(allRec, 'city');
	cityList = _.uniqBy(cityList);
	for (var i=0; i<cityList.length; ++i) {
		var tmp = new M_City({
			id: cityList[i],
			city: cityList[i],
			enabled: true
		});
		await tmp.save();
	}
	sendok(res, "Done");
});

router.get('/sethod/:oldCity/:newCity', async function(req, res, next) {
  setHeader(res);
	
	var { oldCity, newCity } = req.params;

	await updateCityInHod(getDisplayName(oldCity), getDisplayName(newCity))
	sendok(res, "Done");
});


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;
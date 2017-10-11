const AWS_AT = 'hongbro-20';
const AWS_AK = 'AKIAJUTQBV5ZSIZVARLA';
const AWS_SK = 'rUCqEqtC6p0ikg+14kC1QVOWflYtY6G4GwlNelJJ';
const AWS_ENDPOINT = 'webservices.amazon.com';
const AWS_URI = '/onca/xml';

/*  TESTING VARIABLES  */
// const AWS_AT = 'mytag-20';
// const AWS_AK = 'AKIAIOSFODNN7EXAMPLE';
// const AWS_SK = '1234567890';
// const AWS_ENDPOINT = 'webservices.amazon.com';
// const AWS_URI = '/onca/xml';

// const AWS_OPERATION_TYPES = [
// // 	{name: 'ItemSearch', desc: 'Search for item by keyword'},
// // 	{name: '', desc: ''} 
// // ];

function getAmazonDataFromApi(query, signature, callback) {
	const newQuery = `${query}&Signature=${signature}`;
	const endpoint = `http://${AWS_ENDPOINT}${AWS_URI}`;
	console.log(endpoint + '?' + newQuery);
	console.log(newQuery);
    $.getJSON(endpoint, newQuery, callback)
    	.fail(function( jqxhr, textStatus, error ) {
		    let err = textStatus + ", " + error;
		    console.log( "Request Failed: " + err );
	});
}

function prepareSignString(string) {
	return `GET\n${AWS_ENDPOINT}\n${AWS_URI}\n${string}`;
}

function getCanonicalString(query) {
	let string = '';
	query.map(item => {
		string += `${Object.keys(item)}=${item[Object.keys(item)]}&`;
	});
	return string.slice(0, -1);
}

// function getAmazonQuery(searchTerm, timestamp) {
// 	return query = {
// 	  	Service: 'AWSECommerceService',
// 	  	Operation: 'ItemSearch',
// 	  	AWSAccessKeyId: `${AWS_AK}`,
// 	  	AssociateTag: `${AWS_AT}`,
// 	  	// Keywords: `${encodeURIComponent(searchTerm)}`,
// 	  	Timestamp: `${timestamp}`
// 	};
// }

function getAmazonQuery(searchTerm, timestamp) {
	return query = {
	  	Service: 'AWSECommerceService',
	  	AWSAccessKeyId: `${AWS_AK}`,
	  	AssociateTag: `${AWS_AT}`,
	  	Operation: 'ItemSearch',
	  	SearchIndex: 'All',
	  	Keywords: `${encodeURIComponent(searchTerm)}`,
	  	Timestamp: `${encodeURIComponent(timestamp)}`
	};
}

// test function comparing to Amazon example
// http://docs.aws.amazon.com/AWSECommerceService/latest/DG/rest-signature.html
// function getAmazonQuery(searchTerm, timestamp) {
// 	return query = {
// 	  	Service: 'AWSECommerceService',
// 	  	AWSAccessKeyId: `${AWS_AK}`,
// 	  	AssociateTag: `${AWS_AT}`,
// 	  	Operation: 'ItemLookup',
// 	  	ItemId: '0679722769',
// 		ResponseGroup: 'Images%2CItemAttributes%2COffers%2CReviews',
// 	  	Timestamp: '2014-08-18T12%3A00%3A00Z',
// 	  	Version: '2013-08-01'
// 	};
// }

function sortByByteSize(query) {
	let queryKeys = Object.keys(query);
	queryKeys.sort();
	let newQuery = queryKeys.map(item => {
		for (property in query) {
			if (item === property) {
				return {[item]: query[item]}; // Only static for property names - string literals or identifiers; [] - computed variable
			}
		}
	});
	return newQuery;
}


// If the number is below 10 then add zero and return string
// i.e. 5 => '05'
function addZeroString(number) {
	let value = number;
	if (value < 10) {
		value = `0${value}`;
	}
	return value;
}

function getCurrentTimestamp() {
	let d = new Date();
	const year = d.getFullYear(); 				// Returns the 4-digit year
	const month = addZeroString(d.getMonth() + 1); 			// Returns a zero-based integer (0-11) representing the month of the year.
	const day = addZeroString(d.getDate()); 					// Returns the day of the month (1-31).
	const hour = addZeroString(d.getHours()); 					// Returns the hour of the day (0-23).
	const minute = addZeroString(d.getMinutes());				// Returns the minute (0-59).
	const second = addZeroString(d.getSeconds());				// Returns the second (0-59).

	return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
}

function getAmazonSignature(string) {
	let signature = CryptoJS.HmacSHA256(string, AWS_SK);
	return encodeURIComponent(signature.toString(CryptoJS.enc.Base64));
}

function displayAmazonData(data) {
	console.log(data);
}

function handleAmazonApi() {
	const timestamp = getCurrentTimestamp();
	const query = getAmazonQuery('top', timestamp);
	const newQuery = sortByByteSize(query);
	const canonicalString = getCanonicalString(newQuery);
	const stringToSign = prepareSignString(canonicalString);
	console.log(stringToSign);
	const signature = getAmazonSignature(stringToSign);
	getAmazonDataFromApi(canonicalString, signature, displayAmazonData);
}

function test() {
	let testQuery = ['A','b','c','a','aaple','Aaple'];
	console.log(testQuery.sort());
}


$(handleAmazonApi);

// http://webservices.amazon.com/onca/xml?
// Service=AWSECommerceService&
// Operation=ItemSearch&
// AWSAccessKeyId=[Access Key ID]&
// AssociateTag=[Associate ID]&
// SearchIndex=Apparel&
// Keywords=Shirt&
// Timestamp=[YYYY-MM-DDThh:mm:ssZ]&
// Signature=[Request Signature]

//http://webservices.amazon.com/onca/xml?AWSAccessKeyId=AKIAJUTQBV5ZSIZVARLA&AssociateTag=hongbro-20&Keywords=top&Operation=ItemSearch&SearchIndex=All&Service=AWSECommerceService&Timestamp=2017-10-10T18%3A16%3A42Z&Signature=rdI764tovkTDHiXNXRqlIbHFhh13HfK%2BUBlBcLqQbR8%3D
//http://webservices.amazon.com/onca/xml?AWSAccessKeyId=AKIAJUTQBV5ZSIZVARLA&AssociateTag=hongbro-20&Keywords=top&Operation=ItemSearch&SearchIndex=All&Service=AWSECommerceService&Timestamp=2017-10-11T01%3A15%3A24.000Z&Signature=AyO6tbWql5wFChtGFOBlnm4TT2QyI2zeShs2Yf%2BC5TU%3D

// 2017-10-11T01%3A15%3A24.000Z
// 2014-08-18T12%3A00%3A00Z
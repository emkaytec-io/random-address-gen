const faker = require("faker");
const USPS = require("usps-webtools");

const usps = new USPS({
  server: "http://production.shippingapis.com/ShippingAPI.dll",
  userId: process.env.USPS_USER_ID,
  ttl: 10000,
});

const lookupZipCode = (zip) => {
  return new Promise((resolve, reject) => {
    usps.cityStateLookup(zip, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

const calculateSecondaryAddress = () => {
  const d = new Date();
  if (d.getSeconds() % 4 === 0) {
    return faker.address.secondaryAddress().toUpperCase();
  }
  return null;
};

exports.handler = async (event) => {
  let location;
  try {
    while (!location) {
      const zip = faker.address.zipCode("#####");
      try {
        location = await lookupZipCode(zip);
      } catch (e) {
        // do nothing, most likely an invalid zip code, just keep going
      }
    }

    location.address1 = faker.address.streetAddress().toUpperCase();
    location.address2 = calculateSecondaryAddress();
    location.country = "US";
  } catch (e) {
    return Error(e);
  }
  return {
    statusCode: 200,
    // headers: {},
    // isBase64Encoded: false,
    body: JSON.stringify(location),
  };
};

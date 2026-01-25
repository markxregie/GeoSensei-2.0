const axios = require('axios');

async function testTokenExchange() {
  const tokenUrl = 'https://graph.mapillary.com/token';
  const clientId = '24211086625146458';
  const clientSecret = 'MLY|24211086625146458|efe4dd32abaff2377c1d17a97de69912';
  const redirectUri = 'http://localhost:3002/api/mapillary/callback';
  const authorizationCode = 'AQAWZAgNxVp-aeEygoy5fTbH_ibD9So_CndYsUfZDFAH6ozP4WlDPjIyZitI_-BJE8xFAFSdcvHI6-zNJ0cWeLuhgyVPZvDptua4EzpnawSHpxXr_dten56hyyr4BTRkcByZlXrCr79J-VOPfciDbe3nVaMpEZ14Tk0zGXommFnZtvpfyGIHyoycCN5PIEqOCAuPRy6_LVsU_ewmsyLY9RhQl5wbQpGCh3Wn6Tcm6JQgDeAlK0uoLcy4vwG-OHdMFSYC-2xo8Lb5zhoDxElZoJ5E';

  const body = {
    code: authorizationCode,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    client_id: clientId
  };

  try {
    const response = await axios.post(tokenUrl, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `OAuth ${clientSecret}`
      }
    });
    console.log('Access token response:', response.data);
  } catch (error) {
    console.error('Error exchanging authorization code for token:', error.response?.data || error.message);
  }
}

testTokenExchange();

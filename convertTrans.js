import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library';
import fs from 'fs';

// for fetch config translate from google doc to sevice
// please see the config array to add new lan

(async function () {

  const jwt = new JWT({
    email: 'translatewsp@sharp-harbor-401010.iam.gserviceaccount.com',
    key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCTsw5EQ8f+KyNQ\n9zgQwD+MNMXC4GMtHjA2sjVISGWek49IErlcxHtZpTbT1yo5LN/NVnrwFg8t6XWy\n+zyR/h2Gl/UouauVh6qT4Zl9aZt/Fa7/kAI+2SfKpUGoWx4bbAiHUgcAyG/BForZ\ndpZaqZPLm1Aa2Yz8PxSXcg322eKsZocEDIxwypjXRGED4HDQivRukxbXpVH/Jv3X\nYx/qldY05g0QoDbdL4TN518FXMACckuK+J/uc03n6c1Vv3rs1ARfEepgAmuzXkTk\nYMTq006hX+0s4QA88pnu/Tf+SpRpMOip1wPWo4Rn73aRlZ+rSbnhOr+V0At1DQVi\nL+ujggm/AgMBAAECggEAR1HpC7GnOuZdsVUPL5eFmBBLhmSPv1OaeG7pJ7Q9zar3\nPxg7hb4iyhDrPrPhYaZ3k1G1H4WnYsYe3YRPpTeNzlZGPZoabqQKDEqdsV9zhJRV\n4nYJf4ugmUvfPopxKVCrdZx4YTpoLFbUSVnoFHNaOLEQp0Zxu8RCDzc14wMnX5OO\nwXKJHSA5dmaka56uChw/jYnBwEu3mJKBitAJuDGZ+hQrx+J1TD660N9zlt0E6ZXo\nOg3nMNq1LYc7RWlHg6oct55eZNWmFBBB4mdKl3lGu5RJNUclGwkE/NcqgEPMoLiq\nLs9Kmc6GUy8LH9SQpwKwVA4fLCSYoTVVWgybpOPlsQKBgQDFpVRKPPKEDD/WhqBU\nwbNYT/t6aiAO7o/Pvedz5Vuh0RiujjKKkPZcl7+MEiba1tL2RLy53Two9j7WFJCc\nAtvjp23BBHHnhMcgxYja4V78NC6cRJr22iXV/SSxyTD0MFU4pRq0maWTCDJfGF/1\nci40aaZc20rtfdLD8ktbGyNcwwKBgQC/TqCd186k5Oc79FGeNiN98oreJXrX9SZx\nqyEx3gPXhmyOJ/hEz7GFJZYMNHSXLs2S+zYEAidSLbRoa9/9oVQic1+UKVxdNYtt\njTDTaZtsxnGfAbyHRetcE6ibgOmRK+Np73boDla/i4pNqn5J2SvmW2RnsYKaYjgu\nH9btnUr/VQKBgDEb72Gy2x9sW8BWGyh0KLfcx8OW8vhC1oDr0sK9TpNafSOCOZSs\niEphejq3l+fwUOLYGXylN/mFlf9jhLr/Ctv6Eg9Pp227VC8UZfjc3tkTrjEt6sND\nWPtetutl7j/+cm5st8IAG1/5PWrbh5xZDpn/VlLkOi3ggaomXgr5J0Q5AoGAatUH\n0N2RInhJwStg4M8u5sipUADyJuNaAqQkN2raDmOc/43GkPbDFa21qz8n1L1oQ6pR\nsc9aEgQ/+Qg037hV+Z8gQucOE2cxY44zM/yHtSjkjn0zwP8EvjikMaK9zDoMFz6I\n0nIfc3wDUffh6m+CmnNzEI0KeBhdczSIm8z48rkCgYEAjNS5y1euUfEFptyPcJRL\nY1DoOAh8r5hz84+5wT1Atq5165DaB0Ic0D5iUv4JELyLyK7SFzEQFFmYPo8C+xV8\nrLwV3rBFsQFY3dhuGgzx5RJr4tE8dDTxzrW1fhsUVkasLXPNVesbXlz5ARCRwIxP\nkCmOlbLOM2vVHb952vB0INU=\n-----END PRIVATE KEY-----\n",
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  const config = ['EN', 'TH'];
  const rootFolders = './app/assets/locale/';

  const sheetId = '18Te0gupKokzf-rzqeFq6ePuJvdwcoQO5z7sI89aYM2Y';

  const doc = new GoogleSpreadsheet(sheetId, jwt);

  await doc.loadInfo(); // loads document properties and worksheets



  // ---------------------------------------------------  Start load config to translation.json ---------------------------------------------------
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const outputData = config.map((lan) => {
    const out = {
      lan,
      json: {}
    };
    const mem = [];
    rows.forEach((row, idx) => {
      if (row.get('Section') === '-') {
        out.json[row.get('Key')] = row.get(lan);
      } 
      else {
        if (!mem.includes(row.get('Section'))) {
          mem.push(row.get('Section'));
          out.json[row.get('Section')] = {};
        }
        out.json[row.get('Section')][row.get('Key')] = row.get(lan);
      }
    });
    return out;
  });

  outputData.map(({ lan, json }) => {
    // check generate folder
    const folderPath = `${rootFolders}/${lan.toLowerCase()}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    let data = JSON.stringify(json);
    fs.writeFileSync(`${folderPath}/translation.json`, data);
  });

  // ---------------------------------------------------  End load config to translation.json ---------------------------------------------------
})();



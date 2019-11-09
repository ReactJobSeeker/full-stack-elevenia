import axios from "axios";
import { parseString } from "xml2js";

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = "http://api.elevenia.co.id/rest/prodservices/product";

const request = axios.create({
  baseURL: proxyurl + url
});

function xmlToJson(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) reject(err);
      let {
        Products: { product }
      } = result;
      product = product.map(({ prdNo, prdNm, sellerPrdCd, selPrc }) => ({
        prdNo: prdNo[0],
        prdNm: prdNm[0],
        sellerPrdCd: sellerPrdCd[0],
        selPrc: selPrc[0]
      }));
      resolve(product);
    });
  })
}

export async function getListing() {
  try {
    const res = await request.get("/listing", {
      headers: {
        "Content-type": "application/xml",
        openapikey: "721407f393e84a28593374cc2b347a98"
      }
    });
    const products = await xmlToJson(res.data);
    return products;
  } catch (err) {
    console.log(err);
  }
}

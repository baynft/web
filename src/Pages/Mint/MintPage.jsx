import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import * as KlipAPI from "./klip_test.js";
import {
  Container,
} from "react-bootstrap";
import axios from 'axios';

//QR코드와 지갑 주소를 초기화
const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = "0x00000000000000000000000000000";
const DEFAULT_RESULT = "DEFAULT";

export default function MintPage() {

  const [qrvalue_auth, setQrvalue_auth] = useState(DEFAULT_QR_CODE);
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);
  const [mynftlist, setnftlist] = useState(DEFAULT_RESULT);
  const [mintresult, setmintresult] = useState(DEFAULT_RESULT);
  const [mynum, setmynum] = useState(DEFAULT_RESULT);




  //지갑 연동하는 함수 실행
  const getUserData = () => {
    setMyAddress(DEFAULT_ADDRESS)
    setmintresult(DEFAULT_RESULT)
    setmynum(DEFAULT_RESULT)
    KlipAPI.getAddress(setQrvalue_auth, async (address) => {
      setQrvalue_auth("DEFAULT")
      setMyAddress(address);	//사용자의 지갑 주소를 가져온다
      axios.post('http://211.209.43.89:9800/api/mint', { "password": document.getElementById('password').value, "address": address }).then(async function (response) {
        console.log(response)
        setmynum(response.data['nftid'])
        setmintresult(response.data['mintstatus'])
      })

    });
  };


  return (
    <div className="App">
      <header className="App-header">
        <input type="text" id='password' placeholder='이름' />
        <button onClick={getUserData}> "지갑 연동하기"</button>
        {qrvalue_auth !== DEFAULT_QR_CODE ? (		//klip_test.js에서 getAddress의 request_key가 제대로 설정되면 setQRvalue에 의해 DEFAULT 상태에서 벗어나게 된다
          <Container
            style={{
              backgroundColor: "white",
              width: 300,
              height: 300,
              padding: 20,
            }}
          >
            <QRCode value={qrvalue_auth} size={256} style={{ margin: "auto" }} />

            <br />
            <br />
          </Container>
        ) : null}
        {mynum !== DEFAULT_RESULT ? (		//klip_test.js에서 getAddress의 request_key가 제대로 설정되면 setQRvalue에 의해 DEFAULT 상태에서 벗어나게 된다
          <div><h1>{mynum}</h1>
            <img src={"https://akarakaimages.s3.ap-northeast-1.amazonaws.com/" + mynum + ".png"} height="360px" width="360px" />
          </div>
        ) : null}
        {mintresult !== DEFAULT_RESULT ? (		//klip_test.js에서 getAddress의 request_key가 제대로 설정되면 setQRvalue에 의해 DEFAULT 상태에서 벗어나게 된다
          <h6>{mintresult}</h6>
        ) : null}
        {myAddress !== DEFAULT_ADDRESS ? (		//klip_test.js에서 getAddress의 request_key가 제대로 설정되면 setQRvalue에 의해 DEFAULT 상태에서 벗어나게 된다
          <h6>{myAddress}</h6>
        ) : null}
        {mynftlist !== DEFAULT_RESULT ? (		//klip_test.js에서 getAddress의 request_key가 제대로 설정되면 setQRvalue에 의해 DEFAULT 상태에서 벗어나게 된다
          <h6>{mynftlist}</h6>
        ) : null}

      </header>
    </div>
  );
}


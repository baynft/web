const CaverExtKAS = require('caver-js-ext-kas')

const express = require('express');
const app = express();
const api = require('./routes/index');
const cors = require('cors');
const df = require('dataframe-js');

const bodyParser = require('body-parser');  // body-parser 라이브러리 import

app.use(cors()); // cors 사용
app.use(bodyParser.json()); // body-parser 사용


app.post('/api/get', (req, res) => {
    df.DataFrame.fromCSV('C:/nodejs/klaytntest2/my-app/server/dbfile.csv').then(df => {
    const address=req.body['address']
    const selected = df.filter(row => row.get('address') == address);
    const selected_array = selected.toArray()
    console.log("db 발급 이력 : ",selected_array.length)
    res.send(selected_array.length.toString())
    });

  });

const accessKeyId = "KASKS9JJ6G6XYNVU390B0T7W";
const secretAccessKey = "nI63O4gixgm0I98yP34mx5fp3YRwbKROjQoUUeyS";

const caver = new CaverExtKAS()
caver.initKASAPI(8217, accessKeyId, secretAccessKey)
  
// const whitelist = Array('문상원','data')


app.post('/api/mint', async (req, res) => {
    try{
        var nftid = 'DEFAULT'
        var mintstatus = 'DEFAULT'
        const password = req.body['password']
        df.DataFrame.fromCSV('C:/nodejs/klaytntest2/my-app/server/whitelist.csv').then(async (white_df) => {
            const whitelist = white_df.filter(row => row.get('user_id') == password);
            const whitelist_array = whitelist.toArray()
            if (whitelist_array.length==0){
                mintstatus = "whitelist에 없습니다"
                res.send({"nftid":nftid,"mintstatus":mintstatus})
            }
            else if (whitelist_array[0][2]==1){
                mintstatus = "이미 사용한 whitelist 입니다"
                res.send({"nftid":nftid,"mintstatus":mintstatus})
            }
            else {
                const address = req.body['address']
                const response = await caver.kas.kip17.getTokenListByOwner('baynft', address)
                const nft_list=response.items
                console.log("지갑주소 : ", address, "NFT 개수 : " ,nft_list.length)

                if (nft_list.length == 0) {
                    df.DataFrame.fromCSV('C:/nodejs/klaytntest2/my-app/server/dbfile.csv').then(async (df) => {
                        const selected = df.filter(row => row.get('address') == address);
                        const selected_array = selected.toArray()
                        console.log("db 발급 이력 : ",selected_array.length)
                        const issued_num = selected_array.length.toString()
                        if (issued_num ==0 )
                        {
                            let today = new Date()
                            const minttime = today.toLocaleString()
                            const selected = df.filter(row => row.get('minted') == 0);
                            const selected_array = selected.select('Id').toArray()
                            const randomElement = selected_array[Math.floor(Math.random() * selected_array.length)];
                            changed_df=df.setRow(randomElement[0], row => row.set("minted", 1))
                            changed_df=changed_df.setRow(randomElement[0], row => row.set("address", address))
                            changed_df=changed_df.setRow(randomElement[0], row => row.set("time", minttime))
                            changed_df.toCSV(true,'C:/nodejs/klaytntest2/my-app/server/dbfile.csv')

                            changed_white_df=white_df.setRow(whitelist_array[0][0], row => row.set("used", 1))
                            changed_white_df=changed_white_df.setRow(whitelist_array[0][0], row => row.set("minted", 1))
                            changed_white_df=changed_white_df.setRow(whitelist_array[0][0], row => row.set("id", randomElement[0]))                           
                            changed_white_df=changed_white_df.setRow(whitelist_array[0][0], row => row.set("address", address))
                            changed_white_df=changed_white_df.setRow(whitelist_array[0][0], row => row.set("time", minttime))
                            changed_white_df.toCSV(true,'C:/nodejs/klaytntest2/my-app/server/whitelist.csv')
                            console.log("발급 지갑 : ",address," 발급 시간 : ",minttime, " 민팅 번호 : ",randomElement[0])
                            const num = randomElement[0]
                            const zeros= 3-parseInt(Math.log10(num))
                            const id = "0".repeat(zeros)+num.toString()
                            console.log("메타데이터 id : ",id)
                            console.log('https://akaraka.s3.ap-northeast-1.amazonaws.com/'+id+'.json')
                            const result = await caver.kas.kip17.mint('baynft', address, num, 'https://akaraka.s3.ap-northeast-1.amazonaws.com/info'+id+'.json');
                            console.log("contract 실행 결과 : ",result)
                            nftid = id
                            mintstatus = result.status
                            res.send({"nftid":nftid,"mintstatus":mintstatus})
                        }
                        else
                        {
                            mintstatus = "이미 발급 받은 지갑입니다"
                            res.send({"nftid":nftid,"mintstatus":mintstatus})
                        }
                    });
                }
                else{
                    mintstatus = "이미 발급 받은 지갑입니다"
                    res.send({"nftid":nftid,"mintstatus":mintstatus})
                }
            }
        })
    }catch(e){
      console.log(e);
    }
    
}
);


const port = 3002;
app.listen(port, ()=>console.log(`Listening on port ${port}`));
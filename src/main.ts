import {parse} from "csv-parse";
import * as fs from 'fs';
// import iconv from "iconv-lite";
// import * as readline from "readline"

// ヒアドキュメント
let str = `
ヒアドキュメント（別の呼び方としてヒア文字列、heredocなど）は、
文字列リテラルを、シェルスクリプトやプログラミング言語のソースコード中に埋め込むための1つの方法である。

ヒアドキュメント - Wikipedia
https://ja.wikipedia.org/wiki/%E3%83%92%E3%82%A2%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88
`
console.debug(`heredoc=[${str}]`)
console.debug(`pwd=[${process.cwd()}]`);


const readFileAll = async (infname: string): Promise<string> => {
  // read entire file.(test)
  return new Promise((resolve, reject) => {
    fs.readFile(infname, 'utf8', (err, data) => {
      if (err) {
        // console.error(`file read error.[${err}]`)
        reject(err)
        return
      }
      console.error(`readFileAll.read length=[${data.length}]`)
      resolve(data)
    })
  });

}

const csvToJson = (infname: string, outfname: string) => {
  console.log(`csvToJson infname=[${infname}] out=[${outfname}]`)

  try {
    const iconv = require("iconv-lite")

    // read stream
    const parser = parse({delimiter: ',', columns: true});
    const stream = fs.createReadStream(infname)
      .pipe(iconv.decodeStream("Shift_JIS"))  // pipeにwriteableを指定する。
      .pipe(parser) // csv-parse
    //
    const records: any = []
    parser.on('readable', () => {
      let record;
      while ((record = parser.read()) !== null) {
        record['no'] = parseInt(record['no']) // convert type test.
        // console.debug(record['no'],typeof record['no'])
        // console.debug(record)

        for (let [key, value] of Object.entries(record)) {
          // console.debug('key:' + key + ' value:' + value, typeof value);
        }
        records.push(record);
      }
    });
    parser.on('close', () => {
      // console.debug('on close', records);

      const jsonstr = JSON.stringify(records, null, 2)
      // console.debug('jsonstr = ', jsonstr);

      // 書き込み
      fs.writeFile(outfname, jsonstr, (err) => {
        if (err) throw err;
        console.log('succeed.');
      });
    })

  } catch (e) {
    console.error(`erorr.[${e}]`)
  } finally {

  }
}

const input_file = `./data/data_sjis_excelexport.csv`
const output_file = `./out/data_excelexport.json`
// readFileAll(input_file).then(value => console.log(`readFileAll value=[${value}]`))


const promiseTest = () => {
  console.debug("readFileAll single ---- start.")

  readFileAll(input_file)
    .then(value => console.log(`readFileAll then value length=[${value.length}]`))
    .catch(reason => console.error(`readFileAll catch=${reason}`))

  console.debug("readFileAll single (notexistfile) ---- start.")
  readFileAll("notexistfile")
    .then(value => console.log(`readFileAll then value length=[${value.length}]`))
    .catch(reason => console.error(`readFileAll catch=${reason}`))


  console.debug("readFileAll chain ---- start.")
  readFileAll(input_file)
    .then(value => {
      console.log(`readFileAll 01 then value length=[${value.length}]`)
      return readFileAll("notexistfile2")
    })
    .then(value => {
      console.log(`readFileAll 02 then value length=[${value.length}]`)
    })
    .catch(reason => console.error(`catch=${reason}`))
}


const awaitTest = async () => {
  console.debug("readFileAll single ---- start.")
  try {
    let value = await readFileAll(input_file)
    console.log(`readFileAll await value length=[${value.length}]`)
  } catch (e) {
    console.error(`readFileAll await catch=${e}`)
  }

}

promiseTest()
awaitTest()

console.debug("csvToJson ---- start.")
csvToJson(input_file, output_file)
console.debug("csvToJson ---- end.")  // 非同期なのでcsvToJsonはすぐに終わるので注意。
